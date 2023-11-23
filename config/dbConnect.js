const mongoose = require('mongoose')

function connectDB(){
//to connect mongo db, when ever we call that function this connect method will work
//to remove the warning message

mongoose.set('strictQuery',false)

mongoose.connect(process.env.DB_CONFIG).then(result=>{ //we connect this as environment variable so no one can get this link
    console.log("Database connected")

}).catch ((err)=>{
    console.log("database error \n" +err)
})

}

module.exports=connectDB