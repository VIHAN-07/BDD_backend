import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import bddRoutes from './routes/bdd.route.js';
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';
import User from './models/user.model.js';

dotenv.config();

const app = express();
app.use(express.json());

// Set up session and Passport.js
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
}));

// Use passport-local strategy
passport.use(new LocalStrategy(User.authenticate())); // Passport-local strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
