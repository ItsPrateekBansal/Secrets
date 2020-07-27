//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userDB');
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});
const User = mongoose.model('User',userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});
app.post("/register",(req,res)=>{
  // const newUser = new User({
  //   username:req.body.username,
  //   password: req.body.password
  // })
  // newUser.save();
  User.create(req.body);
  console.log("User Created Successfully");
  res.render('secrets');
});
app.post('/login',(req,res)=>{
  const usr = req.body.username;
  const pass = req.body.password;
  User.findOne({username:usr},(err,doc)=>{
    if(pass === doc.password){
      console.log(doc.password);
      res.render('secrets')
    } else{
      res.send("YOU ARE NOT AUTHENTICATED, GET LOST")
    }
  })
})




app.listen(3000, (req, res) => {
  console.log("listening...");
});
