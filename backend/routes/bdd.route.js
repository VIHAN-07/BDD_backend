import express from 'express';
import { newDonor } from '../controller/bdd.controller.js';
import { getDonors } from '../controller/bdd.controller.js';
import { getNewDonors } from '../controller/bdd.controller.js';
import { approveDonors } from '../controller/bdd.controller.js';

const router = express.Router();

router.post("/", newDonor);

router.get("/", getDonors);

router.get("/admin", getNewDonors);

router.patch("/admin", approveDonors);

export default router;