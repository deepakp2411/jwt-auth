import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

const resetPassword = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });

      const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`;
      console.log(link);
      // send mail
      let info = await transporter.sendMail({
        from:process.env.EMAIL_FROM,
        to:user.email,
        subject:"Deepak shop - Password link",
        html: `<a href=${link}>Click here</a>to reset your password`,

      })

      res.send({ status: "Success", message: "Password reset email sent..","info":info });
    } else {
      res.send({ status: "failed", message: "Email does not exist" });
    }
  } else {
    res.send({ status: "failed", message: "Email field is required" });
  }
};

const userPasswordReset = async (req, res) => {
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;
  const user = await UserModel.findById(id);
  const new_secret = user._id + process.env.JWT_SECRET_KEY;

  try {
    jwt.verify(token, new_secret);
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "Password and confirm password does not match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });
      res.send({ status: "success", message: "Password changed successfully..." });

      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", message: "Invalid token" });
  }
};

export  {resetPassword,userPasswordReset};
