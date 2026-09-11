# Water Reports API

API REST construida con **NestJS v11** para que los ciudadanos reporten fugas de
agua en la via publica. Al crear un reporte, se guarda en PostgreSQL y se
envia automaticamente un correo de aviso a la cuadrilla de mantenimiento con
los datos de la fuga.

## Stack

- **NestJS v11** + TypeScript
- **PostgreSQL** + **TypeORM** (migraciones, `synchronize: false`)
- **env-var** + **dotenv** para variables de entorno (`src/config/envs.ts`)
- **bcryptjs** para hasheo de contrasenas
- **nodemailer** para el envio de correos
- Arquitectura por modulos: `module -> controller -> service -> repository`

## Estructura del proyecto

```
src/
  config/
    envs.ts                 # Lectura y validacion de variables de entorno
  database/
    data-source.ts          # DataSource usado por el CLI de TypeORM (migraciones)
    database.module.ts      # TypeOrmModule.forRoot conectado a la app
    migrations/
      *-CreateWaterReport.ts
      *-CreateSystemUser.ts
  reports/
    dto/create-report.dto.ts
    entities/report.entity.ts       # tabla WATER_REPORT
    enums/report-severity.enum.ts
    repositories/reports.repository.ts
    templates/report.template.ts    # generateReportTemplate(dto)
    reports.controller.ts           # POST /reports, GET /reports
    reports.service.ts
    reports.module.ts
  users/
    dto/create-user.dto.ts
    entities/user.entity.ts         # tabla SYSTEM_USER
    repositories/users.repository.ts
    users.service.ts                # hashea password con bcryptjs
    users.module.ts
  auth/
    dto/login.dto.ts
    auth.controller.ts              # POST /auth/register, POST /auth/login
    auth.service.ts
    auth.module.ts
  email/
    email.service.ts                # transporter de nodemailer + sendEmail()
    email.module.ts
  app.module.ts
  main.ts
```

## Requisitos previos

- Node.js 20+
- PostgreSQL 14+ corriendo localmente o accesible por red
- Una cuenta SMTP (Gmail con contrasena de aplicacion, Mailtrap, SendGrid SMTP, etc.)

## Instalacion

```bash
npm install
cp .env.example .env
# editar .env con tus credenciales reales de DB y SMTP
```

### Variables de entorno (`.env`)

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto donde corre la API (default 3000) |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Conexion a PostgreSQL |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM` | Configuracion del transporter de nodemailer |
| `MAINTENANCE_CREW_EMAIL` | Correo(s) de la cuadrilla de mantenimiento que recibe el aviso |
| `BCRYPT_SALT_ROUNDS` | Rondas de salt para bcryptjs (default 10) |

Todas se leen y validan de forma centralizada en `src/config/envs.ts` usando
`env-var`; si falta una variable requerida, la aplicacion falla al arrancar
con un mensaje claro en vez de fallar en tiempo de ejecucion.

## Base de datos y migraciones

Crea la base de datos vacia (ej. `water_reports_db`) y luego corre las
migraciones (el esquema **no** se sincroniza automaticamente,
`synchronize: false`):

```bash
npm run migration:run
```

Para revertir la ultima migracion:

```bash
npm run migration:revert
```

Las migraciones crean:

- **WATER_REPORT**: `id` (serial, PK), `address`, `description`,
  `severity` (enum `low` / `medium` / `high`), `reporter_phone`,
  `is_resolved` (boolean, default `false`), `created_at` (timestamp, default `now()`).
- **SYSTEM_USER**: `id` (serial, PK), `name`, `email` (unique), `password`,
  `is_notification_enabled` (boolean, default `true`).

## Correr la aplicacion

```bash
npm run start:dev   # modo desarrollo con watch
npm run start:prod  # modo produccion (requiere npm run build antes)
```

## Endpoints

### Reportes de fuga

**POST `/reports`** — crea un reporte, lo guarda en `WATER_REPORT` y envia el
correo de aviso a la cuadrilla de mantenimiento (`MAINTENANCE_CREW_EMAIL`)
usando la plantilla de `generateReportTemplate`.

```json
{
  "address": "Av. Reforma 123, esquina con Calle 5",
  "description": "Fuga importante en la banqueta, se acumula mucha agua",
  "severity": "high",
  "reporterPhone": "+525512345678"
}
```

Respuesta `201 Created`:

```json
{
  "id": 1,
  "address": "Av. Reforma 123, esquina con Calle 5",
  "description": "Fuga importante en la banqueta, se acumula mucha agua",
  "severity": "high",
  "reporterPhone": "+525512345678",
  "isResolved": false,
  "createdAt": "2026-09-10T15:30:00.000Z"
}
```

> Si el envio de correo falla, el reporte igualmente queda guardado; el
> error se registra en el log del servidor para su seguimiento.

**GET `/reports`** — lista todos los reportes (mas recientes primero).

### Autenticacion

**POST `/auth/register`** — crea un usuario (`SYSTEM_USER`), hasheando la
contrasena con bcryptjs antes de guardarla.

```json
{
  "name": "Juan Perez",
  "email": "juan.perez@municipio.gob",
  "password": "unaContrasenaSegura123",
  "isNotificationEnabled": true
}
```

**POST `/auth/login`** — valida credenciales.

```json
{
  "email": "juan.perez@municipio.gob",
  "password": "unaContrasenaSegura123"
}
```

Si el correo no existe o la contrasena no coincide, responde
`400 Bad Request` con un mensaje claro (`"Correo o contrasena invalidos"`),
sin revelar cual de los dos datos fue incorrecto.

## Notas de diseno

- La contrasena nunca se retorna en las respuestas de `/auth/register` ni
  `/auth/login`.
- Los DTOs usan `class-validator` para validar la entrada de cada endpoint
  (`whitelist` + `forbidNonWhitelisted` habilitados globalmente en `main.ts`).
- `EmailService.sendEmail(to, subject, template)` es generico y reutilizable
  para cualquier notificacion futura del sistema, no solo reportes de fuga.
