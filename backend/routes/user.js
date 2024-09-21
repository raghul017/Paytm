const express = require("express");
const { model } = require("mongoose");
const { User } = require("../db");
const {JWT_SECRET} = require("../config");
const zod = require("zod");

const router = express.Router();


// Sign up route

const signupSchema = zod.object({
    username : zod.string().min(3).max(30),
    password : zod.string().min(6),
    firstName : zod.string().max(50),
    lastName : zod.string().max(50)
});


router.post("/signup",async (req, res) => {
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message : "Email already exists / Incorrect email format"
        });
        return;
    }

    const existingUser = await User.findOne({
        username : req.body.username
    });

    if(existingUser){
        res.status(409).json({
            message : "User already exists"
        });
        return;
    }

    const user = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName : req.body.lastName
    });

    const userId = user._id;

    const token = jwt.sign({userId}, JWT_SECRET);

    res.status(201).json({
        msg: "User created",
        token : token
    });

});

// Sign in route

const signinSchema = zod.object({
    username : zod.string().min(3).max(30),
    password : zod.string().min(6)
});


router.post("/signin", async (req, res) => {
    const {success} = signinSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message : "Incorrect email format"
        });
        return;
    }

    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    });

    if(user){
        const userId = user._id;
        const token = jwt.sign({userId}, JWT_SECRET);
        res.status(200).json({
            msg : "User found",
            token : token
        });
    }

    res.status(404).json({
        msg : "User not found"
    });
});


// Put user details route

const putUserDetailsSchema = zod.object({
    firstName : zod.string().max(50).optional(),
    lastName : zod.string().max(50).optional(),
    password : zod.string().min(6)
});

router.put("/", async (req, res) => {
    const {success} = putUserDetailsSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message : "IError while updating information"
        });
        return;
    }

    const user = await User.updateOne({
        _id : req.userId
    }, req.body);

    res.status(200).json({
        msg : "User updated"
    });

});


// Get user details route

router.get("/", async (req, res) => {
    const filter = req.query.filter || "";

    const users  = await User.find({
        $or : [
            {
                "$regex" : filter,
            },
            {
                "$regex" : filter,
            }
        ]
    });

    res.status(200).json({
        msg : "User found",
        user : users
    });

    res.json({
        user : users.map(user => 
        ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
});


module.exports = router;