// app.ts - Actualización para servir archivos estáticos
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { errorHandler } from './src/infrastructure/middlewares/errorHandler';
import { createConnection } from './src/infrastructure/persistence/database';
import router from './src/index';
import path from 'path';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// IMPORTANTE: Servir archivos estáticos ANTES de las rutas de API
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger UI - Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas principales
app.use('/api', router);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    await createConnection();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
      console.log(`Archivos estáticos servidos desde: http://localhost:${PORT}/uploads/`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

// DEBUGGING: Middleware para ver requests a uploads
app.use('/uploads', (req, res, next) => {
  console.log(`Solicitando archivo: ${req.url}`);
  next();
});

// Crear directorios necesarios al inicio
import fs from 'fs';

const createDirectories = () => {
  const dirs = ['uploads', 'uploads/temp'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directorio creado: ${dir}`);
    }
  });
};

createDirectories();