import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { env } from './config/env.js';
import prisma from './config/db.js';

const PORT = env.port;

await prisma.$connect()
    .then(() => {
        console.log('Connected to the database successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code
    });