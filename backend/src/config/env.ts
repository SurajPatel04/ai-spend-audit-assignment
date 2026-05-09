import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["DATABASE_URL"];

for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(`Warning: Environment variable ${varName} is not set.`);
        process.exit(1);
    }
}

export const env = {
    port: Number(process.env.PORT) || 8000,
    db_url: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV || "development"
}