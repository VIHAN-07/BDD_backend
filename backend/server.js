import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import bddRoutes from './routes/bdd.route.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend requests
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
}));

console.log(process.env.MONGO_URI);

app.use('/api/donate', bddRoutes);

app.listen(5000, async () => {           
    await connectDB();
    console.log('Server started on http://localhost:5000');
});
