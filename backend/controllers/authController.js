import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req,res)=>{
    try{

        const {name,email,password,city} = req.body;

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            city
        });

        res.status(201).json({
            message:"User registered successfully",
            user
        });

    }catch(error){
        res.status(500).json({message:error.message});
    }
};