import { userModel } from "../models/user.model.js";

export default class userManager {

    getAllUsers = async ()=>{
        const users = await userModel.find()
        return users;
    }


    getUsers = async (username)=>{
        const user = await userModel.findOne({username})
        return user;
    }

    getUser = async (condition)=>{
        const user = await userModel.findOne(condition)
        return user;
    }

    regUser = async (username,name, lastname,tel, password, passwords) => {
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const newUser = await userModel.create({ username,name, lastname,tel, password, passwords});
        return newUser;
    }

    logInUser = async (username, password)=> {
        const user = await userModel.findOne({ username, password })
        if(!user){
            throw new Error("Invalid credentials");
        }
        return user;
    }

    updateUser = async (id, user)=> {
        return await userModel.findByIdAndUpdate(id, user)
    }
}