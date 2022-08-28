import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// user registration

const UserRegistration = async (req, res) => {
  const { name, email, password, password_confirmation, tc } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    res.send({ status: "failed", message: "Email already exists" });
  } else {
    if (name && password && password_confirmation && tc) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt); // hashing password
          const doc = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });

          await doc.save(); // saving data
          const saved_user = await UserModel.findOne({ email: email });
          // generate jwt token
          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          // res.cookie(String(saved_user), token, {
          //   path: "/",
          //   expires: new Date(Date.now() + 1000 * 30),
          //   httpOnly:true,
          //   sameSite:'lax'
          // });
          res.status(201).send({
            Status: "success",
            message: "Registration successfully..",
            token: token,
          }); // sending success data
        } catch (error) {
          res.send({ status: "failed", message: "Unable to Register" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Password and confirmation not matched",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  }
};

export default UserRegistration;
