const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.send('Welcome to API Ordentshop. For the documentation, click <a href="https://ordentshop-api.herokuapp.com/api-docs">here</a>');
});

module.exports = router;