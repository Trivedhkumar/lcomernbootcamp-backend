const express = require("express");
const router = express.Router();

const {getCategoryById,createCategory,getCategory,getAllCategories,updateCategory,removeCategory} = require("../controllers/category");
const {isSignedIn,isAuthenticated,isAdmin } = require("../controllers/auth");
const {getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//routers

//create
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);

//get categories
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

//update categories

router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//delete categories
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router;