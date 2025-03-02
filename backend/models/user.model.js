import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String }, // This field is handled by passport-local-mongoose
});

// Plugin to handle password hashing and authentication
UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);
