const express = require('express')
const {engine} = require('express-handlebars')
const session = require('express-session')
const connectDB=require('./config/dbConnect')
const userRouter=require('./routes/userRouter')
const adminRouter=require('./routes/adminRouter')

require('dotenv').config()//npm i dot env to get enivironment variable


const app = express()

connectDB()


app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
}))

app.use((req,res,next)=>{
    res.header('Cache-Control','private, no-cache,no-store,must-revalidate')
    next()
})





app.use('/',userRouter)
app.use('/admin',adminRouter)




 app.engine('hbs',engine({extname:".hbs"}))
 app.set("view engine","hbs")

 



 app.listen(3000,()=>{console.log('http://localhost:3000')})