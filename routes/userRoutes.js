import express from "express";
const router = express.Router()
import UserRegistration from "../controllers/userController.js";
import userLogin from "../controllers/loginController.js";
import changePassword from "../controllers/changePasswordController.js";
import checkUserAuth from "../middlewares/auth-middleware.js"
import loggedUser from "../controllers/loggedUser.js";
import {resetPassword,userPasswordReset} from "../controllers/resetPassword.js";

// Route level Middleware 
router.use('/changepassword',checkUserAuth);
router.get('/loggeduser', checkUserAuth)



// Public routes
router.post('/register',UserRegistration)
router.post('/login',userLogin)
router.post('/send-reset-password',resetPassword)
router.post('/reset-password/:id/:token',userPasswordReset)




// Private routes // protected routes 
router.post('/changepassword',changePassword)
router.get('/loggeduser', loggedUser)




export default router