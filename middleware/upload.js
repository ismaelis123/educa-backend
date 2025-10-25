const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// Middlewares específicos
const uploadVideo = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten videos!'), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).single('file');

const uploadPdf = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten PDFs!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('file');

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('file');

module.exports = { upload, uploadVideo, uploadPdf, uploadImage };