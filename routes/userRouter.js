const express=require('express')
const verifyUser = require('../middlewares/verifyUser')
const userModel=require('../models/userModel')

const router = express.Router()

router.get('/',verifyUser,(req,res)=>{
    res.render('userHome',{userName:req.session.user.name})
})

router.get('/signup',(req,res)=>{
    res.render('userSignup')
})

router.post('/signup',(req,res)=>{
    console.log(req.body)
    const {name,email,password,mobile}=req.body

    //if we declare like above we can call it like req.body.email so we can create like that
    if(name==""|| email==""|| password==""|| mobile==""){
        return res.render("userSignup",{error:true,message:"please enter all fields"})

    }

        let user=new userModel({name,email,password,mobile})

        user.save((err,data)=>{
            if(err){
                console.log(err)
                res.render('userSignup',{error:true,message:'something went wrong'})
            }else{
               res.redirect('/')
            }
        })
   


})

router.get('/login',(req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        res.render('userLogin')
    }
    
})

router.post('/login',async (req,res)=>{
    const{email,password}=req.body
    let user = await userModel.findOne({email})

    if(user){
        if(password == user.password){
            req.session.user={name:user.name,id:user._id}
            res.redirect('/')
        }else{
            res.render('userLogin',{error:true,message:"incorrect password"})
        }
    }else{
        res.render('userLogin',{error:true,message:"no user found"})
    }

})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.render('userLogin')
})


module.exports=router