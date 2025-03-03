import express from 'express';
import { newDonor } from '../controller/bdd.controller.js';
import { getDonors } from '../controller/bdd.controller.js';
import { getNewDonors } from '../controller/bdd.controller.js';
import { approveDonors } from '../controller/bdd.controller.js';
import { generateCertificate } from "../controller/bdd.controller.js";
import { getCertifiedDonors } from "../controller/bdd.controller.js";
import { Login,logout } from '../controller/bdd.controller.js';
import User from '../models/user.model.js';

import passport from "passport";

const router = express.Router();

router.post("/", newDonor);

router.get("/", getDonors);

router.get("/admin", getNewDonors);

router.patch("/admin", approveDonors);

router.get("/certificate/:reg_number", generateCertificate);

router.get("/certificate", getCertifiedDonors);

router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: info.message || "Invalid credentials" 
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to establish session" 
                });
            }
            
            return Login(req, res);
        });
    })(req, res, next);
});

router.get("/logout",logout);

// Temporary route to register admin
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username });
        const registeredUser = await User.register(user, password);
        res.status(201).json({ message: "User registered successfully", userId: registeredUser._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
