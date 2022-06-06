// .Env
require('dotenv').config()
// Express
const express = require("express");
// BodyParser
const BodyParser = require("body-parser");
// EJS
const ejs = require("ejs");
// Lodash
const _ = require("lodash");
// BodyParser
const bodyParser = require("body-parser");
// Mongoose
const mongoose = require("mongoose");
// Mongoose encryption
const encrypt =  require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});
//----------------------------------------------------------------------------
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// Level 2 - Encryption
// const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);
//----------------------------------------------------------------------------
app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {

    const newUsername = req.body.username;
    const userPassword = req.body.password;
    // Level 1 - Username and password only
    const newUser = new User ({
        email: newUsername,
        password: userPassword
    });

    newUser.save(function(err) {
        if(err){
            console.log(err);
        }
        else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser) {
        if(err) {
            console.log(err);
        }
        else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});