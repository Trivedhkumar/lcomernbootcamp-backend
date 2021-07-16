const formidable = require("formidable");
const Product = require("../models/product");
const fs = require("fs");
const _ = require("lodash");

//get product by Id --> param
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to find product in DB",
        });
      }
      req.product = product;
      next();
    });
};

//create product
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.json({
        error: "Please include all fields",
      });
    }
    //TODO restrictions on fields
    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.json({
          error: "File size is too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving product in DB failed!",
        });
      }
      res.json(product);
    });
  });
};

//get product
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  res.json(req.product);
};

//get photo of product
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-type", res.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//delete product
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to delete the product",
      });
    }
    res.json({
      message: "deleted sucessfully",
      deletedProduct,
    });
  });
};

//update product
exports.updateProduct = (req, res) => {
  console.log("req", req);
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);
    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.json({
          error: "File size is too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "updating product in DB failed!",
        });
      }
      res.json(product);
    });
  });
};

//get all products
exports.getAllproducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.json({
          error: "NO products in DB",
        });
      }
      res.json(products);
    });
};

//get all unique categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

// update stock
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bluk operation failed",
      });
    }
  });
  next();
};
