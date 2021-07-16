var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const { signout, signup, signin,isSignedIn } = require("../controllers/auth");
router.get("/signout", signout);
router.post("/signup", [
    body('name').isLength({ min: 3 }).withMessage("Minimun three char required"),
    body('email', "valid Email is required").isEmail(),
    body("password").isLength({min:6}).withMessage("Password should be minimun six letters are required")
], signup);

router.post("/signin", [
    body('email', "valid Email is required").isEmail(),
    body("password").isLength({ min: 1 }).withMessage("Password is required")
], signin);

// router.get("/test", isSignedIn, (req, res) => {
//     res.send("Protected Route");
// })

module.exports = router;