import 'dotenv/config';
import * as env from 'env-var';

/**
 * Centraliza la lectura y validacion de todas las variables de entorno
 * de la aplicacion. Si falta una variable requerida o tiene un tipo
 * invalido, env-var lanza un error apenas arranca el proceso, evitando
 * fallos silenciosos en tiempo de ejecucion.
 */
export const envs = {
  // App
  port: env.get('PORT').default(3000).asPortNumber(),

  // Database
  dbHost: env.get('DB_HOST').required().asString(),
  dbPort: env.get('DB_PORT').required().asPortNumber(),
  dbUsername: env.get('DB_USERNAME').required().asString(),
  dbPassword: env.get('DB_PASSWORD').required().asString(),
  dbName: env.get('DB_NAME').required().asString(),

  // Mail
  mailHost: env.get('MAIL_HOST').required().asString(),
  mailPort: env.get('MAIL_PORT').required().asPortNumber(),
  mailSecure: env.get('MAIL_SECURE').default('false').asBool(),
  mailUser: env.get('MAIL_USER').required().asString(),
  mailPassword: env.get('MAIL_PASSWORD').required().asString(),
  mailFrom: env.get('MAIL_FROM').required().asString(),

  // Destinatario de los avisos de fuga
  maintenanceCrewEmail: env.get('MAINTENANCE_CREW_EMAIL').required().asEmailString(),

  // AWS S3 (credenciales via cadena de proveedores AWS, no en codigo)
  awsRegion: env.get('AWS_REGION').required().asString(),
  awsBucket: env.get('AWS_S3_BUCKET').required().asString(),
  awsPublicBaseUrl: env.get('AWS_PUBLIC_BASE_URL').asString(),

  // Bcrypt
  bcryptSaltRounds: env.get('BCRYPT_SALT_ROUNDS').default(10).asIntPositive(),
};
