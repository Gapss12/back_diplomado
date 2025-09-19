# Joyería Backend

Este es el backend de una joyería básica que permite gestionar productos, ventas y usuarios. Implementa autenticación básica y sigue las mejores prácticas de desarrollo con Node.js, Express y TypeScript.

## 📌 Tecnologías Utilizadas

- Node.js + TypeScript  
- Express.js  
- Sequelize (ORM para la base de datos)  
- JWT para autenticación  
- PostgreSQL/MySQL (según configuración)  

## 🚀 Instalación y Configuración

1️⃣ Clonar el repositorio  
```sh
git clone https://github.com/tuusuario/joyeria-backend.git  
cd joyeria-backend  
```
2️⃣ Instalar dependencias  
```console
npm install  
```
3️⃣ Configurar variables de entorno  
Crea un archivo .env en la raíz del proyecto y configura las variables necesarias:  
``` text
PORT=3000  
DB_HOST=localhost  
DB_USER=tu_usuario  
DB_PASSWORD=tu_contraseña  
DB_NAME=joyeria  
JWT_SECRET=clave_secreta  
```
4️⃣ Configurar la base de datos  
Si estás usando PostgreSQL o MySQL, asegúrate de que la base de datos esté creada y accesible. Luego, ejecuta las migraciones:  
```
npx sequelize-cli db:migrate  
npx sequelize-cli db:seed:all # Opcional, para datos iniciales  
```
## 📌 Scripts Disponibles

### 🔹 Modo Desarrollo  
Ejecuta el servidor en modo desarrollo con recarga automática:  
```
npm run dev  
```
### 🔹 Compilar TypeScript  
Compila el código TypeScript en JavaScript en la carpeta dist/:  
```
npm run build  
```
### 🔹 Iniciar en Producción  
Ejecuta el servidor con el código compilado:  
```
npm start  
```
## 📌 Endpoints Disponibles  
El backend expone los siguientes endpoints siguiendo el estándar REST:  

### 🔹 Autenticación  
POST /api/auth/login → Iniciar sesión  

### 🔹 Productos  
GET /api/products → Listar productos  
POST /api/products → Crear producto  
GET /api/products/:id → Ver detalle de un producto  
PUT /api/products/:id → Actualizar producto  
DELETE /api/products/:id → Eliminar producto  

### 🔹 Usuarios  
GET /api/users → Listar usuarios  
POST /api/users → Crear usuario  
GET /api/users/:id → Ver detalle de un usuario  
PUT /api/users/:id → Actualizar usuario  
DELETE /api/users/:id → Eliminar usuario  

### 🔹 Ventas  
GET /api/sales → Listar ventas  
POST /api/sales → Registrar una venta  
GET /api/sales/:id → Ver detalle de una venta  

## 📌 Versionamiento  
Este proyecto utiliza Git con las siguientes ramas:  

main → Código estable en producción  
develop → Desarrollo activo  
feature/nombre-feature → Funcionalidades nuevas  

Ejemplo de commits recomendados:  
```
git commit -m "✨ Agregar modelo de productos"  
git commit -m "🚀 Implementar autenticación JWT"  
git commit -m "🐛 Corregir validación de ventas"  
```
## 📌 Contribuciones  
Si deseas contribuir, crea un fork del proyecto, trabaja en una rama separada y envía un Pull Request.
# backend_diplomado
# back_diplomado
