# Backend – API de Autenticación

Este backend es un servidor **Express + PostgreSQL** que expone una API sencilla de autenticación de usuarios y una "Uma Pedia".

Se conecta a una base de datos PostgreSQL (por defecto `uma_db`) y gestiona usuarios en la tabla `users` y personajes en la tabla `uma_musumes`.

## Requisitos

- Node.js (si quieres ejecutarlo fuera de Docker)
- Docker y Docker Compose (si quieres ejecutarlo usando contenedores)
- Base de datos PostgreSQL accesible con las credenciales configuradas

## Variables de entorno

El backend lee su configuración desde variables de entorno (o desde un archivo `.env` en la carpeta `backend`).

Variables usadas:

- `PORT` – Puerto HTTP del backend (por defecto `3000`).
- `DB_HOST` – Host de la base de datos (por defecto `localhost`).
- `DB_PORT` – Puerto de la base de datos (por defecto `5432`).
- `DB_USER` – Usuario de la base de datos (por defecto `uma_user`).
- `DB_PASSWORD` – Contraseña del usuario de la base de datos (por defecto `uma_password`).
- `DB_NAME` – Nombre de la base de datos (por defecto `uma_db`).
- `JWT_SECRET` – Secreto para firmar los JSON Web Tokens.

Cuando ejecutas con Docker Compose, el servicio `backend` se conecta al servicio `db` usando `DB_HOST=db`.

## Esquema de la base de datos

El backend asume la existencia de las tablas `users` y `uma_musumes` en la base de datos (creada por `db/schema.sql`).

## Arranque del backend

### Con Node (sin Docker)

Desde la carpeta `backend`:

```bash
npm install
npm start
```

El backend quedará escuchando en `http://localhost:3000` (o en el puerto que definas en `PORT`).

### Con Docker Compose

Desde la raíz del proyecto (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

- El servicio `db` levanta PostgreSQL y ejecuta `schema.sql` para crear las tablas si aún no existen.
- El servicio `backend` levanta el servidor Express conectado a esa base de datos.

## Endpoints de la API

La documentación detallada de la API se encuentra en el archivo [API.md](API.md).

## Estructura del backend

Archivos y carpetas relevantes:

- `server.js` – Código principal del servidor Express.
- `db.js` – Configuración de la conexión a la base de datos.
- `routes/` – Carpeta que contiene los archivos de rutas.
  - `index.js` – Archivo principal de rutas.
  - `auth.js` – Rutas de autenticación.
  - `uma_musumes.js` – Rutas de la "Uma Pedia".
- `controllers/` – Lógica de negocio para cada ruta.
  - `auth_controller.js` – Controlador de autenticación.
  - `uma_musume_controller.js` – Controlador de la "Uma Pedia".
- `middleware/` – Middlewares de Express.
  - `auth.js` – Middleware de autenticación JWT.
- `storage/` – Carpeta donde se guardan las imágenes subidas.
- `package.json` – Dependencias y scripts para ejecutar el backend.
- `API.md` – Documentación detallada de la API.
- `Dockerfile` – Define la imagen de Docker para el backend.

## Notas y mejoras futuras

- Añadir validaciones adicionales de contraseña (mínima longitud, complejidad, etc.).
- Manejar mejor los mensajes de error para mostrarlos al usuario final en el frontend.
