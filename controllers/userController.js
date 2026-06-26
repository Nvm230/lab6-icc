const db = require('../config/db');
const { deleteImageFromS3 } = require('../config/s3');

exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users ORDER BY id ASC');
    res.render('dashboard', { users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getCreateUser = (req, res) => {
  res.render('user_form', { user: null, error: null });
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    let profileImageUrl = null;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('user_form', { user: { name, email, role }, error: 'Please enter a valid email address.' });
    }

    if (req.file) {
      profileImageUrl = req.file.location; // URL provided by multer-s3
    }

    await db.query(
      'INSERT INTO users (name, email, role, profile_image_url) VALUES ($1, $2, $3, $4)',
      [name, email, role || 'user', profileImageUrl]
    );

    res.redirect('/users/dashboard');
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.render('user_form', { user: req.body, error: 'A user with this email already exists.' });
    }
    res.render('user_form', { user: req.body, error: 'Server Error while creating user.' });
  }
};

exports.getEditUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).send('User not found');

    res.render('user_form', { user: rows[0], error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('user_form', { user: { id, name, email, role }, error: 'Please enter a valid email address.' });
    }
    
    // Get old user image first to delete it later if changed
    const { rows } = await db.query('SELECT profile_image_url FROM users WHERE id = $1', [id]);
    const oldImageUrl = rows[0]?.profile_image_url;

    let query = 'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4';
    let params = [name, email, role, id];

    // If a new image was uploaded, update the URL
    if (req.file) {
      if (oldImageUrl) await deleteImageFromS3(oldImageUrl); // Cleanup S3
      query = 'UPDATE users SET name = $1, email = $2, role = $3, profile_image_url = $4 WHERE id = $5';
      params = [name, email, role, req.file.location, id];
    }

    await db.query(query, params);
    res.redirect('/users/dashboard');
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.render('user_form', { user: { id, name, email, role }, error: 'A user with this email already exists.' });
    }
    res.render('user_form', { user: { id, name, email, role }, error: 'Server Error while updating user.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Get old image URL before deleting
    const { rows } = await db.query('SELECT profile_image_url FROM users WHERE id = $1', [id]);
    const oldImageUrl = rows[0]?.profile_image_url;
    
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    
    if (oldImageUrl) await deleteImageFromS3(oldImageUrl); // Cleanup S3
    
    res.redirect('/users/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
