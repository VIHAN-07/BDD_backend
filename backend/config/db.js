import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // const conn = await mongoose.connect("mongodb://127.0.0.1:27017/Blood_Donation?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};