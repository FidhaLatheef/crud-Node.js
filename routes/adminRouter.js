
const express = require('express')
const adminModel = require('../models/adminModel')
const userModel=require('../models/userModel')
const verifyAdmin=require('../middlewares/verifyAdmin')

const router = express.Router()


//ADMIN HOME
router.get('/',verifyAdmin,async (req,res)=>{
    let users=await userModel.find({},{password:0}).lean()
    console.log(req.session.admin)
    if(req.session.admin){
        res.render('adminHome',{users})
    }else{
        res.redirect('/admin/login')
    }
    
})

//ADMIN LOGIN
router.get('/login',(req,res)=>{
    if(req.session.admin){
        res.redirect('/admin')
    }else{
        res.render('adminLogin')
    }
    
})

router.post('/login', async (req,res)=>{
    const {email,password}=req.body

    console.log(req.body)

    let admin=await adminModel.findOne({email})
    if(admin){
        if(password==admin.password){
            req.session.admin={name:admin.name}
            res.redirect('/admin/')
        }else{
            res.render('adminLogin',{error:true,message:'invalid email or password'})
        }
    }else{
        res.render('adminLogin',{error:true,message:'admin not found'})
    }
   
})

//CREATING USER
router.get('/create-user',(req,res)=>{
    res.render('createUser')
})
router.post('/create-user',async (req,res)=>{
    const {name,email,password,mobile}=req.body
    console.log(req.body)
    if(name=="" || email=="" || password==""|| mobile=="" ){
        return res.render("createUser",{error:true,message:"please enter all fields"})
    }
    let user=new userModel({name,email,password,mobile})

    user.save((err,data)=>{
        if(err){
            console.log(err)
            res.render('userSignup',{error:true,message:'something went wrong'})
        }else{
           res.redirect('/admin/')
        }
    })

})

//DELETING USER
router.get('/delete-user/:id',(req,res)=>{

    const _id=req.params.id

    userModel.deleteOne({_id}).then(()=>{
        console.log('deleted successfully')

        res.redirect("/admin/")

    })

    .catch((err)=>{
        console.log(err)
    })

})

//LOGOUT
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/login')
})

 //SEARCHING
 router.post('/search-user',async (req,res)=>{
 const users=await userModel.find({name:new RegExp(req.body.key)}).lean()
 res.render('adminHome',{users})
 })

 //EDIT
 router.get('/update-user/:id',async (req,res)=>{
    const user=await userModel.findOne({_id:req.params.id});
    console.log(user)
    res.render('updateUser',user)
 })
 router.post('/update-user',async (req,res)=>{
    const {name,email,mobile,_id}=req.body
    await userModel.updateOne({_id},{$set:{name,email,mobile}},{upsert:true})
    res.redirect('/admin/')
 })
router.post('/data',((req,res)=>{
    console.log(name,age)
}))


module.exports=router