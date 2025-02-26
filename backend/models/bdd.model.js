import mongoose from "mongoose";

const bddSchema = new mongoose.Schema({
    totalDonors: { type: Number, default: 0 },
    bloodGroups: {
        "A+": { type: Number, default: 0 },
        "A-": { type: Number, default: 0 },
        "B+": { type: Number, default: 0 },
        "B-": { type: Number, default: 0 },
        "O+": { type: Number, default: 0 },
        "O-": { type: Number, default: 0 },
        "AB+": { type: Number, default: 0 },
        "AB-": { type: Number, default: 0 }
    },
    recentDonors: [
        {
            name: { type: String, required: true },
            bloodGroup: {
                type: String,
                enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
                required: true
            },
            date: { type: Date, required: true }
        }
    ]
});

export default mongoose.model("BDD", bddSchema);
