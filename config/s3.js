const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'profiles/' + uniqueSuffix + '-' + file.originalname);
    },
  }),
});

const deleteImageFromS3 = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const urlObj = new URL(imageUrl);
    const key = decodeURIComponent(urlObj.pathname.substring(1));
    const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    await s3.send(command);
    console.log(`Deleted image from S3: ${key}`);
  } catch (err) {
    console.error('Failed to delete image from S3:', err);
  }
};

module.exports = { upload, deleteImageFromS3 };
