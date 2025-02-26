import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());

console.log(process.env.MONGO_URI);

app.post("/donate", (req, res) => {
    const { name, bloodGroup, date } = req.body;
  
    if (!name || !bloodGroup || !date || !data.bloodGroups.hasOwnProperty(bloodGroup)) {
      return res.status(400).json({ error: "Invalid data" });
    }
  
    data.totalDonors += 1;
    data.bloodGroups[bloodGroup] += 1;
    data.recentDonors.unshift({ name, bloodGroup, date });
  
    if (data.recentDonors.length > 10) {
      data.recentDonors.pop();
    }

    res.status(201).json({ message: "Donation recorded successfully", donor: req.body });
  });

app.listen(5000, () => {           
    connectDB();
    console.log('Server started on http://localhost:5000');
});
