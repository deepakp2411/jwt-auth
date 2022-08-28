import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changePassword = async (req, res) => {
  const { password, password_confirmation } = req.body;
  if (password && password_confirmation) {
    if (password !== password_confirmation) {
      res.send({
        status: "failed",
        message: "New Password and Confirm Password does not match",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      await UserModel.findByIdAndUpdate(req.user._id,{$set:{
        password:newHashPassword
      }})
      res.send({"status":"success","message":"Password changed successfully"})
      console.log(req.user)
    }
  } else {
    res.send({ status: "failed", message: "All fields are required" });
  }
};

export default changePassword;
