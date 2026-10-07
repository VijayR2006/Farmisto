const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only JPEG, PNG, GIF images
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, GIF images are allowed!'), false);
  }
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5 MB default

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter,
});

module.exports = upload;