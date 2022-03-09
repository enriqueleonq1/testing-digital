var express = require('express');
var router = express.Router();
const { default: axios } = require("axios");

router.post("/", (req,res) =>{
    res.send("Sumario")
})

module.exports = router;