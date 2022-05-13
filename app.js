// libraries and local var k darmiyan spaces deden it increases code readibility 
// schema is used for security purpose || validations (like, unique)
// empty obj {} and obj returns true 

const express = require("express");/* libraries*/
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose"); /* mongodb library ||  
                                      library that creates a connection between MongoDB  
                                      and the Express web application framework. */

const UserModel = require("./schema");

const app = express(); /* local variables */
const PORT = 5000;

//Allowing body otherwise return undefined
app.use(express.json());

const DB_URI = ``;

mongoose.connect(DB_URI);
mongoose.connection.on("connected", () => console.log("connected"));
mongoose.connection.on("error", (error) => console.log("not connected"));

app.post("/api/signup", async (req, res) => {
    const { username, email, password, } = req.body;

    if (!username || !email || !password) {
        return res.json({ message: "Fields can't be empty" });
        // jaha bhi ham return use karte hain uske bad sara code raed nh hoga inside a fun 
    }

    const hashPass = await bcryptjs.hash(password, 5);

    const userObj = {
        ...req.body, // ye req.body ko le kar ayega
        password: hashPass, // ye req.body k pass ko overwrite karega hashed psw se
    };

    UserModel.findOne({ email }, (error, user) => {
        if (error) {
            res.send(error);
        } else if (user) {
            console.log(user);
            res.json({ message: "email address is already exist" });
        } else {
            UserModel.create(userObj, (err, _) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ message: "successfully registered" });
                }
            });
        }
    });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ message: "Fields can't be empty" });
    }

    UserModel.findOne({ email }, async (error, user /* user return registered user data obj*/) => {
        if (error) {
            res.send(error);
        } else if (user) {
            await bcryptjs /* compare returns promise thts y use await */
                .compare(password, user.password)
                .then((password) => {
                    if (password) {
                        res.send({ message: "login successfully " });
                    } else {
                        res.send({ message: "Invalid Credentials" });
                    }
                })
                .catch((err) => {
                    res.send(err);
                });
        } else {
            res.json({ message: "Invalid Credentials" });
        }
    });
});

app.listen(PORT, () => console.log("Server is started"));