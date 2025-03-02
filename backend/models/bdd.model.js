import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reg_number: { type: String, required: true },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        required: true
    },
    mobile_number: { type: String, required: true },
    category: {
        type: String,
        enum: ["Faculty", "Student"],
        required: true
    },
    approved: { type: Boolean, default: false }
}, { timestamps: true });

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
    recentDonors: [donorSchema]
}, { timestamps: true });

export default mongoose.model("BDD", bddSchema);
