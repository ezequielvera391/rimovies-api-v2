# Rimovies API

Proyecto backend para Rimovies, una API construida en TypeScript con NestJS, PostgreSQL y TypeORM.

## 🔗 Tabla de contenido

- [Requisitos](#requisitos)
- [Stack tecnológico](#stack-tecnológico)
- [Instalación local](#instalación-local)
- [Configuración del entorno](#configuración-del-entorno)
- [Modo desarrollo](#modo-desarrollo)
- [Swagger / Documentación](#swagger--documentación)
- [Dockerización](#dockerización)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Endpoints principales](#endpoints-principales)
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
JWT_EXPIRES_IN=15m

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Modo desarrollo

Se recomienda utilizar la base de datos y Redis en Docker y correr NestJS localmente para mayor velocidad y flexibilidad.

### 1. Levantar PostgreSQL y Redis

```bash
docker compose up -d
```

Esto ejecuta solo la base de datos y Redis en Docker. Los valores de conexión están definidos en el archivo `.env`.

### 2. Ejecutar la API localmente

```bash
pnpm start:dev
```

La API estará disponible en `http://localhost:3000`.

## Swagger / Documentación

La documentación interactiva de la API está disponible en Swagger:

- URL: [http://localhost:3000/api](http://localhost:3000/api)

Desde ahí puedes probar todos los endpoints, ver los modelos de request/response y autenticarte con JWT.

## Dockerización

### Solo la base de datos y Redis (desarrollo)

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
│   ├── auth/               # Módulo de autenticación
│   │   ├── dto/           # Data Transfer Objects para auth
│   │   ├── entities/      # Entidades de tokens (AccessToken, RefreshToken)
│   │   ├── guards/        # Guards de autenticación (JWT, RefreshToken)
│   │   ├── strategies/    # Estrategias de Passport (JWT, RefreshToken)
│   │   ├── services/      # Servicios de autenticación
│   │   ├── decorators/    # Decoradores personalizados
│   │   ├── interfaces/    # Interfaces de autenticación
│   │   └── types/         # Tipos específicos de auth
│   ├── common/            # Utilidades y configuraciones comunes
│   │   ├── dto/          # DTOs comunes
│   │   ├── enums/        # Enumeraciones
│   │   └── guards/       # Guards comunes
│   ├── config/           # Configuraciones del sistema
│   │   └── env.utils.ts  # Utilidades de variables de entorno
│   ├── database/         # Configuración de base de datos
│   │   ├── migrations/   # Migraciones de TypeORM
│   │   └── typeorm.options.ts
│   ├── interfaces/       # Interfaces globales
│   ├── movie/           # Módulo de películas (en desarrollo)
│   │   └── dto/         # DTOs de películas
│   ├── scripts/         # Scripts de utilidad
│   │   ├── migrate.ts   # Script de migración
│   │   └── test-db-connection.ts
│   ├── user/            # Módulo de usuarios
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── entities/    # Entidades TypeORM
│   │   ├── interfaces/  # Interfaces de usuario
│   │   └── utils/       # Utilidades específicas
│   ├── app.module.ts    # Módulo principal
│   └── main.ts          # Punto de entrada
├── test/                # Tests
├── .env                 # Variables de entorno
├── docker-compose.yml   # Configuración Docker (desarrollo)
└── docker-compose.prod.yml # Configuración Docker (producción)
```

## Endpoints principales

### Autenticación
- `POST /auth/register` — Registro de usuario
- `POST /auth/login` — Login de usuario
- `POST /auth/refresh` — Refrescar token
- `POST /auth/logout` — Logout
- `POST /auth/logout-all` — Logout de todas las sesiones

### Usuarios
- `GET /user/by-email` — Buscar usuario por email
- `POST /user` — Crear usuario (solo para pruebas, normalmente usar /auth/register)

### Salud del sistema
- `GET /ping` — Verificar que la API está viva

## Scripts útiles

- `pnpm start:dev` — Levanta la API en modo desarrollo
- `pnpm build` — Compila el proyecto
- `pnpm test` — Ejecuta los tests
- `pnpm migration:run` — Ejecuta las migraciones de TypeORM

## Migraciones de base de datos

Las migraciones se encuentran en `src/database/migrations/` y se ejecutan automáticamente al iniciar la app si está configurado así.

## Enlaces de interés

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/)
