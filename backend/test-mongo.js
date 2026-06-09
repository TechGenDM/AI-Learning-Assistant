import mongoose from 'mongoose';
const URI = "mongodb+srv://test:QLg5SteL8Yv6KruH@ailearning.i7l4lct.mongodb.net/?appName=AILearning";

const test = async () => {
  try {
    await mongoose.connect(URI);
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
};
test();
