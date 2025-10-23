const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// ✅ MIDDLEWARE SIMPLIFICADO - PERMITE TODO
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/content', require('./routes/content'));
app.use('/api/vendor', require('./routes/vendor'));

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Backend de Plataforma Educativa funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🎯 Servidor corriendo en puerto ${PORT}`);
  console.log(`📚 Plataforma Educativa Backend`);
  console.log(`🔗 http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});