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
        stats.recentDonors.unshift({ name, bloodGroup, date });

        await stats.save();

        res.status(201).json({ message: "Donation recorded successfully", donor: req.body });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getDonors = async (req, res) => {
    try {
        const data = await BDD.findOne();
        const approvedDonors = data.recentDonors.filter(donor => donor.approved);
        const responseData = { 
            ...data.toObject(),
            recentDonors: approvedDonors 
        };
        if (!responseData) {
            return res.status(404).json({ message: "No data found" });
        }
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const getNewDonors = async (req, res) => {
    try {
        const data = await BDD.findOne();
        const approvedDonors = data.recentDonors.filter(donor => !donor.approved);

        if (!approvedDonors) {
            return res.status(404).json({ message: "No data found" });
        }
        res.status(200).json(approvedDonors);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const approveDonors = async (req, res) => {
    try {
        const { donorNames } = req.body; 

        if (!donorNames || !Array.isArray(donorNames) || donorNames.length === 0) {
            return res.status(400).json({ error: "Valid donor names are required" });
        }

        let stats = await BDD.findOne();
        if (!stats) {
            return res.status(404).json({ error: "No donor data found" });
        }

        let approvedCount = 0;

        donorNames.forEach(donorName => {
            const donorIndex = stats.recentDonors.findIndex(donor => donor.name === donorName && !donor.approved);

            if (donorIndex !== -1) {
                stats.recentDonors[donorIndex].approved = true;

                stats.totalDonors += 1;
                stats.bloodGroups[stats.recentDonors[donorIndex].bloodGroup] += 1;

                approvedCount++;
            }
        });

        if (approvedCount === 0) {
            return res.status(404).json({ error: "No donors found or already approved" });
        }

        await stats.save();

        res.status(200).json({ message: `Approved ${approvedCount} donors successfully` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
