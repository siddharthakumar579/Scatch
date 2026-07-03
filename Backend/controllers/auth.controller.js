// const express = require('express')
const userModel = require('../models/user.model')
const blacklistTokenModel = require('../models/blackList.Token')
const authMiddleware = require('../middlewares/auth.middleware')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const cookie = require('cookie-parser');

async function registerUserController(req, res){
    try {
        const{username,email,password} = req.body

        if(!username||!password||!email) {
            return res.status(400).json({
                message: "All fields are required"
            })
        };

        const userAlreadyExists = await userModel.findOne({
            $or:[{email}, {username}]
        })

        if(userAlreadyExists){
            return res.status(400).json({
                message: "User with this email or username already exists"
            })
        }
        const hash = await bcrypt.hash(password, 10)
        
        const user = await userModel.create({
            username,
            email,
            password: hash,
        })

        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.status(201).json({
            message: "User created",
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
}

async function loginUserController(req, res) {

    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await userModel.findOne({email});

        if(!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.status(200).json({
            message: "User logged-in successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

    
}

async function logOutUserController(req, res) {

    try {
        const token = req.cookies.token

        if(token){
            await blacklistTokenModel.create({ token })
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.status(200).json({
            message: "User Loggedout successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

async function getMeController(req,res) {

    try {
        const user = await userModel.findById(req.user.id);
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            message: "User fetched Successfully",
            user:{
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

   
}

module.exports = {registerUserController, loginUserController, logOutUserController, getMeController}