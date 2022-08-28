import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const loggedUser = async (req,res) => {
    res.send({"user":req.user})
}

export default loggedUser;