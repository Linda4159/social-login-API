const mongoose = require("mongoose")



const connectDB = async()=>{
    try {
        mongoose.set('strictQuery',false)
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log('database connection successful')
    } catch (error) {
        console.log(error, "error in databse connection")
    process.exit(1)

    }
}
module.exports = connectDB


