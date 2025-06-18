// backend/config/upload.js
import multer from 'multer';
import path from 'path';

// Define onde os arquivos serão armazenados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // A pasta 'public/uploads' será criada dentro da pasta 'backend'
    cb(null, 'public/uploads/'); 
  },
  filename: function (req, file, cb) {
    // Garante que cada imagem tenha um nome único, adicionando a data atual ao nome original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado! Apenas imagens são permitidas.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limite de 5MB por arquivo
  }
});

export default upload;