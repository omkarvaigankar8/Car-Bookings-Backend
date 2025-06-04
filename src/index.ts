import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import './config/paths';
import router from '@/routes/index';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_END_PORT = process.env.FRONTEND_END_PORT || 3000;

const MAIN_DOMAIN = `localhost:${FRONTEND_END_PORT}`;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            // Allow requests with no origin (like mobile apps or curl)
            return callback(null, true);
        }

        // Validate if the origin is part of the allowed domain or its subdomains
        const allowedDomain = new RegExp(`^https?:\\/\\/[a-zA-Z0-9-]+\\.${MAIN_DOMAIN}$`);

        // Also allow direct access to your S3 endpoint
        if (allowedDomain.test(origin) ||
            origin === `http://${MAIN_DOMAIN}` ||
            origin === `https://${MAIN_DOMAIN}`) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
}));
app.use(bodyParser.json());
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});