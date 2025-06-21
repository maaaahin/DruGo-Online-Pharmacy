import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDB Database ${con.connection.host}`.bgGreen.white)
    }
    catch(error)
    {
        console.log(`Error in MongoDB  ${error}`.bgRed.white)
    }
}

export default connectDB;