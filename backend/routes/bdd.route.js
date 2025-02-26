import express from 'express';
import BDD from '../models/bdd.model.js';
import { newDonor } from '../controller/bdd.controller.js';
import { getDetails } from '../controller/bdd.controller.js';

const router = express.Router();

router.post("/", newDonor);

router.get("/", getDetails);

export default router;