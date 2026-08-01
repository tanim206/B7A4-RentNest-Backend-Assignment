import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const validateEnv = (name: string, value: string | undefined) => {
  if (!value || value.startsWith("your_") || value.trim() === "") {
    throw new Error(
      `Missing or invalid environment variable ${name}. Please set it in server/.env.`,
    );
  }
  return value;
};

export default {
  port: process.env.PORT || 5000,
  database_url: validateEnv("DATABASE_URL", process.env.DATABASE_URL),
  app_url: validateEnv("APP_URL", process.env.APP_URL),

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt_access_secret: validateEnv(
    "JWT_ACCESS_SECRET",
    process.env.JWT_ACCESS_SECRET,
  ),
  jwt_access_expires_in: validateEnv(
    "JWT_ACCESS_EXPIRES_IN",
    process.env.JWT_ACCESS_EXPIRES_IN,
  ),

  stripe_secret_key: validateEnv(
    "STRIPE_SECRET_KEY",
    process.env.STRIPE_SECRET_KEY,
  ),
  stripe_webhook_secret: validateEnv(
    "STRIPE_WEBHOOK_SECRET",
    process.env.STRIPE_WEBHOOK_SECRET,
  ),
};
