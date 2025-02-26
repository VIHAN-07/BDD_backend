import BDD from '../models/bdd.model.js';

export const newDonor = async (req, res) => {
    try {
        const { name, bloodGroup, date } = req.body;
  
        if (!name || !bloodGroup || !date) {
            return res.status(400).json({ error: "Invalid data" });
        }

        let stats = await BDD.findOne(); 
        if (!stats) {
            stats = new BDD({
                totalDonors: 0,
                bloodGroups: {
                    "A+": 0, "A-": 0, "B+": 0, "B-": 0, "O+": 0, "O-": 0, "AB+": 0, "AB-": 0
                },
                recentDonors: []
            });
        }

        if (!stats.bloodGroups.hasOwnProperty(bloodGroup)) {
            return res.status(400).json({ error: "Invalid blood group" });
        }

        stats.totalDonors += 1;
        stats.bloodGroups[bloodGroup] += 1;
        stats.recentDonors.unshift({ name, bloodGroup, date });

        if (stats.recentDonors.length > 10) {
            stats.recentDonors.pop();
        }

        await stats.save();

        res.status(201).json({ message: "Donation recorded successfully", donor: req.body });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getDetails = async (req, res) => {
    try {
        const data = await BDD.findOne();
        if (!data) {
            return res.status(404).json({ message: "No data found" });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};