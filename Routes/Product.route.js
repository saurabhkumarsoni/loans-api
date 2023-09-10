const express = require("express");
const router = express.Router();
const ProductController = require('../Controller/Product.Controller')

router.get("/", ProductController.productList);

router.post("/", ProductController.addProduct);

router.get("/:id", ProductController.findProductById);

router.delete("/:id", ProductController.deleteProduct);

router.patch("/:id", ProductController.updateProduct);

module.exports = router;
