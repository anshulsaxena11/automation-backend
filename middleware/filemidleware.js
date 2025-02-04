const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    try {
      // Directory where files will be saved
      const uploadDir = path.join(__dirname, '../uploads/agreement');

      // Create directory if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
      callback(null, uploadDir); // Pass the destination directory to multer
    } catch (error) {
      callback(new Error('Failed to create upload directory'), null); // Error handling if directory creation fails
    }
  },
  filename: function (req, file, callback) {
    // Creating a unique file name using timestamp and original file name
    callback(null, Date.now() + '-' + file.originalname);
  },
});

// Configure multer instance with the defined storage
const upload = multer({ storage: storage });

module.exports = upload;