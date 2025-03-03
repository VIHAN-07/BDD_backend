import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import LocalStrategy from 'passport-local';
import { connectDB } from './config/db.js';
import bddRoutes from './routes/bdd.route.js';
import User from './models/user.model.js';



// Load environment variables
dotenv.config();

// Connect to MongoDB before starting the server
connectDB();

const app = express();

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up CORS (Cross-Origin Resource Sharing)
app.use();

// Set up session (must be before passport.session())

app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,  // Use your existing MongoDB connection
        ttl: 14 * 24 * 60 * 60 // Sessions expire in 14 days
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production", // Set true in production for HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));


// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport-local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/api/donate', bddRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

