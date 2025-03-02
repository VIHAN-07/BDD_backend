import BDD from "../models/bdd.model.js";
import path, { join } from "path";
import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const newDonor = async (req, res) => {
    try {
        const { name, reg_number, bloodGroup, mobile_number, category } = req.body;

        if (!name || !reg_number || !bloodGroup || !mobile_number || !category) {
            return res.status(400).json({ error: "Invalid data" });
        }

        let stats = await BDD.findOne();
        if (!stats) {
            stats = new BDD({
                totalDonors: 0,
                bloodGroups: { "A+": 0, "A-": 0, "B+": 0, "B-": 0, "O+": 0, "O-": 0, "AB+": 0, "AB-": 0 },
                recentDonors: [],
            });
        }

        if (!stats.bloodGroups.hasOwnProperty(bloodGroup)) {
            return res.status(400).json({ error: "Invalid blood group" });
        }

        stats.recentDonors.unshift({ name, reg_number, bloodGroup, mobile_number, category, approved: false });
        await stats.save();

        res.status(201).json({ message: "Donation recorded successfully", donor: req.body });
    } catch (error) {
        console.error("Error in newDonor:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getDonors = async (req, res) => {
    try {
        const data = await BDD.findOne();
        if (!data) return res.status(404).json({ message: "No data found" });

        res.status(200).json({ ...data.toObject(), recentDonors: data.recentDonors.filter(donor => donor.approved) });
    } catch (error) {
        console.error("Error in getDonors:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getNewDonors = async (req, res) => {
    try {
        const data = await BDD.findOne();
        if (!data) return res.status(404).json({ message: "No data found" });

        res.status(200).json(data.recentDonors);
    } catch (error) {
        console.error("Error in getNewDonors:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const approveDonors = async (req, res) => {
    try {
        const { donorRegno } = req.body;
        if (!donorRegno || !Array.isArray(donorRegno) || donorRegno.length === 0) {
            return res.status(400).json({ error: "Valid donor registration numbers are required" });
        }

        let stats = await BDD.findOne();
        if (!stats) return res.status(404).json({ error: "No donor data found" });

        let approvedCount = 0;
        donorRegno.forEach(regno => {
            const donorIndex = stats.recentDonors.findIndex(donor => donor.reg_number === regno && !donor.approved);
            if (donorIndex !== -1) {
                stats.recentDonors[donorIndex].approved = true;
                stats.totalDonors += 1;
                stats.bloodGroups[stats.recentDonors[donorIndex].bloodGroup] += 1;
                approvedCount++;
            }
        });

        if (approvedCount === 0) return res.status(404).json({ error: "No donors found or already approved" });

        await stats.save();
        res.status(200).json({ message: `Approved ${approvedCount} donors successfully` });
    } catch (error) {
        console.error("Error in approveDonors:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const generateCertificate = async (req, res) => {
    try {
        const { reg_number } = req.params;
        console.log("Received request for certificate generation:", reg_number);

        const stats = await BDD.findOne();
        if (!stats) return res.status(404).json({ message: "No donor data found" });

        const donor = stats.recentDonors.find(d => d.reg_number === reg_number && d.approved);
        if (!donor) return res.status(403).json({ message: "Certificate not available. Approval pending." });

        console.log("Generating certificate for donor:", donor.name);

        const imagePath = join(__dirname, "certificate.png");
        if (!fs.existsSync(imagePath)) return res.status(500).json({ message: "Certificate template not found." });

        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0, image.width, image.height);
        ctx.font = "64px Arial";
        ctx.fillStyle = "black";

        // **Center the donor's name**
        const textWidth = ctx.measureText(donor.name).width;
        const centerX = (canvas.width - textWidth) / 2;
        const nameY = 700; // Adjust Y position as needed

        ctx.fillText(donor.name, centerX, nameY);

        const buffer = canvas.toBuffer("image/png");
        res.set("Content-Type", "image/png");
        res.send(buffer);
    } catch (error) {
        console.error("Error generating certificate:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const Login = (req, res) => {
    res.redirect(res.locals.redirectUrl || "/login");
};

export const logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/login");
    });
};
