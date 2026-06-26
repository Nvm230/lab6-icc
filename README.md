# Laboratorio 06 - Desarrollo de aplicación usando servicios en la nube

## Descripción del Proyecto

Esta aplicación web fue desarrollada en Node.js (Express) con un perfil de administrador para gestionar usuarios. Permite realizar operaciones CRUD, almacena los datos de los usuarios en Amazon RDS (PostgreSQL) y guarda las imágenes de perfil en un bucket de Amazon S3.

## Arquitectura y Tecnologías
- **Backend:** Node.js, Express
- **Frontend:** EJS, Vanilla CSS (Mobile Responsive)
- **Base de Datos:** PostgreSQL (Amazon RDS)
- **Almacenamiento de Archivos:** Amazon S3
- **Despliegue:** Docker, Docker Compose, Amazon EC2

## Estructura del Repositorio

- `app.js`: Punto de entrada de la aplicación.
- `routes/`: Definición de rutas web y endpoints de API.
- `controllers/`: Lógica de negocio y consultas a la base de datos.
- `config/`: Archivos de configuración para conectarse a AWS (RDS y S3).
- `views/`: Plantillas visuales en EJS.
- `Dockerfile` & `docker-compose.yml`: Archivos de contenerización.

## Despliegue en Amazon EC2 (Entorno de Producción)

Los siguientes recursos fueron configurados y aprovisionados en AWS para este laboratorio:
- **Amazon EC2 (IP Pública):** `54.82.36.219`
- **Amazon RDS (PostgreSQL):** `lab6-db-1782434549.cgjgmq8eyj78.us-east-1.rds.amazonaws.com`
- **Amazon S3 (Imágenes):** `lab6-utec-profiles-1782434529`

1. **Requisitos previos en la nube:**
   - Una instancia de Amazon EC2 (Ubuntu recomendado) con los puertos `80`, `443`, y `3000` abiertos.
   - Una instancia de Amazon RDS con PostgreSQL en la misma VPC.
   - Un bucket de Amazon S3 público configurado.

2. **Pasos de Despliegue (Docker):**
   - Clona este repositorio en tu instancia EC2.
   - Copia el archivo de ejemplo de variables de entorno y complétalo con tus accesos IAM y contraseña de RDS:
     ```bash
     cp .env.example .env
     ```
   - Construye y levanta el contenedor con Docker:
     ```bash
     docker-compose up -d --build
     ```

3. **Uso de la Aplicación:**
   - Abre el navegador en: `http://54.82.36.219:3000`
   - Ingresa con las credenciales por defecto.
