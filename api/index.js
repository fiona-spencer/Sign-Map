import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import pinRoutes from './routes/pin.route.js';
import emailRoutes from './routes/email.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('mongodb is connected');
    })
    .catch((err) => {
        console.log(err);
    });

const __dirname = path.resolve();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

//Routes

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/pin', pinRoutes);
app.use('/api/email', emailRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

//Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});