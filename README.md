# Rimovies API

Proyecto backend para Rimovies, una API construida en TypeScript con NestJS, PostgreSQL y TypeORM.

## 🔗 Tabla de contenido

- [Requisitos](#requisitos)
- [Stack tecnológico](#stack-tecnológico)
- [Instalación local](#instalación-local)
- [Configuración del entorno](#configuración-del-entorno)
- [Modo desarrollo](#modo-desarrollo)
- [Dockerización](#dockerización)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Endpoints disponibles](#endpoints-disponibles)
- [Scripts útiles](#scripts-útiles)
- [Migraciones de base de datos](#migraciones-de-base-de-datos)
- [Enlaces de interés](#enlaces-de-interés)

---

## Requisitos

- Node.js 20+
- PNPM
- Docker y Docker Compose

## Stack tecnológico

- **NestJS** como framework principal
- **TypeORM** para manejo de base de datos
- **PostgreSQL** como motor de base de datos relacional

## Instalación local

```bash
pnpm install
```

## Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=rimovies

# API
PORT=3000

# Environment
NODE_ENV=development
DEV_SECRET=your_secure_dev_secret

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
```

## Modo desarrollo

Se recomienda utilizar la base de datos en Docker y correr NestJS localmente para mayor velocidad y flexibilidad.

### 1. Levantar PostgreSQL

```bash
docker compose up -d
```

Esto ejecuta solo la base de datos en Docker. Los valores de conexión están definidos en el archivo `.env`.

### 2. Ejecutar la API localmente

```bash
pnpm start:dev
```

## Dockerización

### Solo la base de datos (desarrollo)

Archivo: `docker-compose.yml`

```bash
docker compose up -d
```

### App + DB en entorno productivo

Archivo: `docker-compose.prod.yml`  
Usa un `Dockerfile.prod` para construir el código y ejecutarlo en modo producción.

```bash
docker compose -f docker-compose.prod.yml up --build
```

## Estructura del proyecto

```
rimovies-api/
├── src/
│   ├── common/              # Utilidades y configuraciones comunes
│   │   ├── enums/          # Enumeraciones
│   │   └── utils/          # Utilidades generales
│   ├── database/           # Configuración de base de datos
│   │   ├── migrations/     # Migraciones de TypeORM
│   │   └── scripts/        # Scripts de base de datos
│   ├── user/               # Módulo de usuarios
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entities/      # Entidades TypeORM
│   │   └── utils/         # Utilidades específicas
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Punto de entrada
├── test/                  # Tests
├── .env                   # Variables de entorno
├── docker-compose.yml     # Configuración Docker (desarrollo)
└── docker-compose.prod.yml # Configuración Docker (producción)
```

## Endpoints disponibles

### Salud del sistema

#### Ping
```http
GET /ping
```
Respuesta exitosa (200):
```json
{
    "message": "pong",
    "timestamp": "2024-06-08T15:30:00.000Z"
}
```

### Autenticación

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

Respuesta exitosa (200):
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "username": "testuser",
        "role": "user"
    }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

Respuesta exitosa (204):
- No content

> **Nota**: 
> - El access token expira después de 24 horas
> - Cuando el token expire, el usuario deberá volver a iniciar sesión

### Usuarios

#### Crear usuario
```http
POST /user
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

Respuesta exitosa (200):
```json
{
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "createdAt": "2024-05-08T12:00:00.000Z",
    "updatedAt": "2024-05-08T12:00:00.000Z"
}
```

#### Obtener usuario por email
```http
GET /user/by-email?email=test@example.com
```

Respuesta exitosa (200):
```json
{
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "createdAt": "2024-05-08T12:00:00.000Z",
    "updatedAt": "2024-05-08T12:00:00.000Z"
}
```

## Scripts útiles

```bash
pnpm start:dev     # Modo desarrollo (hot reload)
pnpm build         # Compilar a dist/
pnpm start         # Ejecutar dist/ en local
```

## Migraciones de base de datos

### Generar migración

```bash
pnpm migration:generate
```

> Esto genera una nueva migración a partir del estado actual de tus entidades TypeORM.

### Ejecutar migraciones

```bash
pnpm migration:run
```

### Revertir última migración (opcional)

```bash
pnpm migration:revert
```

## Enlaces de interés

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
