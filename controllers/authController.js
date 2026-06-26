exports.getLogin = (req, res) => {
  if (req.session.admin) {
    return res.redirect('/users/dashboard');
  }
  res.render('login', { error: null });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username === adminUser && password === adminPass) {
    req.session.admin = true;
    res.redirect('/users/dashboard');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
};
