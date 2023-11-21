import express from 'express';
import cookieParser from 'cookie-parser';

export const app = express();
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));