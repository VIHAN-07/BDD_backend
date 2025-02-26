import mongoose from 'mongoose';

const bddSchema = mongoose.Schema({
    "type": "object",
    "properties": {
        "totalDonors": {
            "type": "integer",
            "minimum": 0,
            "description": "Total number of blood donors in the system."
        },
        "bloodGroups": {
            "type": "object",
            "properties": {
                "A+": { "type": "integer", "minimum": 0 },
                "A-": { "type": "integer", "minimum": 0 },
                "B+": { "type": "integer", "minimum": 0 },
                "B-": { "type": "integer", "minimum": 0 },
                "O+": { "type": "integer", "minimum": 0 },
                "O-": { "type": "integer", "minimum": 0 },
                "AB+": { "type": "integer", "minimum": 0 },
                "AB-": { "type": "integer", "minimum": 0 }
            },
            "additionalProperties": false,
            "description": "Breakdown of donors by blood group."
        },
        "recentDonors": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Full name of the donor."
                    },
                    "bloodGroup": {
                        "type": "string",
                        "enum": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
                        "description": "Blood group of the donor."
                    },
                    "date": {
                        "type": "string",
                        "format": "date",
                        "description": "Date of the donor's last donation."
                    }
                },
                "required": ["name", "bloodGroup", "date"],
                "additionalProperties": false
            },
            "description": "List of the most recent blood donors."
        }
    },
    "required": ["totalDonors", "bloodGroups", "recentDonors"],
    "additionalProperties": false
});

export default mongoose.model('BDD', bddSchema);