/**
 * @fileoverview Configures the 'multer' middleware for handling file uploads.
 * This setup is specifically tailored for uploading product images, defining storage
 * location, filename generation, and file validation rules.
 */

import multer from 'multer';
import path from 'path';

// Configures how files are stored on the server's disk.
const storage = multer.diskStorage({
  /**
   * Specifies the destination folder for uploaded files.
   * For this project, all product images will be saved in 'backend/public/uploads/'.
   */
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  
  /**
   * Generates a unique filename for each uploaded file to prevent overwrites.
   * The new filename will be in the format: 'image-[timestamp]-[random_number].[extension]'.
   */
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * A filter function to ensure only image files are accepted.
 * It checks the file's mimetype to validate its format.
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    // If the file is an image, accept it.
    cb(null, true);
  } else {
    // If not, reject it with an error message.
    cb(new Error('Unsupported file format! Only images are allowed.'), false);
  }
};

// Creates the main multer instance with the defined storage, filter, and limits.
// This 'upload' object will be used as middleware in the product routes.
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Sets a file size limit of 5 Megabytes for each upload.
    fileSize: 1024 * 1024 * 5 // 5MB
  }
});

export default upload;