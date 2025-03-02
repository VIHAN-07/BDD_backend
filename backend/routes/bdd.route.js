import express from 'express';
import { newDonor } from '../controller/bdd.controller.js';
import { getDonors } from '../controller/bdd.controller.js';
import { getNewDonors } from '../controller/bdd.controller.js';
import { approveDonors } from '../controller/bdd.controller.js';
import { generateCertificate } from "../controller/bdd.controller.js";
import { getCertifiedDonors } from "../controller/bdd.controller.js";
import { Login,logout } from '../controller/bdd.controller.js';

import passport from "passport";

const router = express.Router();

router.post("/", newDonor);

router.get("/", getDonors);

router.get("/admin", getNewDonors);

router.patch("/admin", approveDonors);

router.get("/certificate/:reg_number", generateCertificate);

router.get("/certificate", getCertifiedDonors);

router.route("/login").post(passport.authenticate('local',{failureRedirect:'/login', failureFlash:true,}),Login);

router.get("/logout",logout);

export default router;