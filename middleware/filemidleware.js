const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    try {
      let uploadDir = '';

      if (file.mimetype === 'application/pdf') {
        uploadDir = path.join(__dirname, '../uploads/agreement');
      } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        uploadDir = path.join(__dirname, '../uploads/image');
      } else {
        return callback(new Error('Invalid file type'), null);
      }
      fs.mkdirSync(uploadDir, { recursive: true });
      callback(null, uploadDir); 
    } catch (error) {
      callback(new Error('Failed to create upload directory'), null); 
    }
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
