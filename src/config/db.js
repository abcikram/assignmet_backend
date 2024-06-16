const mongoose = require('mongoose')

const connectDB = async () => {
    try {

        const db = process.env.MONGO_URI; 

        const conn = await mongoose.connect(`${db}`, {
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
        })
        console.log(`MongoDB conncected : ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.error(`Error :${error.message}`.red.underline.bold)
        process.exit(1)  //means end the process with some failure.
    }

}

module.exports = connectDB
