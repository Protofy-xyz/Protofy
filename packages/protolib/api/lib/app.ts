import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));