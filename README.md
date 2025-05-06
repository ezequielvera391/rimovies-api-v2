# Rimovies API

Proyecto backend para Rimovies, una API construida en TypeScript con NestJS, PostgreSQL y TypeORM.

## 🔗 Tabla de contenido

- [Requisitos](#requisitos)
- [Stack tecnológico](#stack-tecnológico)
- [Instalación local](#instalación-local)
- [Modo desarrollo](#modo-desarrollo)
- [Dockerización](#dockerización)
- [Estructura del entorno](#estructura-del-entorno)
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

## Estructura del entorno

```
rimovies-api/
├── src/                    # Código fuente NestJS
│   └── users/              # Módulo de usuarios y entidad
├── .env                    # Variables de entorno (desarrollo)
├── docker-compose.yml      # Solo DB para desarrollo
├── docker-compose.prod.yml # Producción (API + DB)
├── Dockerfile.prod         # Build y ejecución para producción
├── pnpm-lock.yaml
└── ...
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
