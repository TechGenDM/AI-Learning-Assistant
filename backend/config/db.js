import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Do not process.exit in serverless environments to allow the app to boot and return 500s on API calls
    }
};

export default connectDB;