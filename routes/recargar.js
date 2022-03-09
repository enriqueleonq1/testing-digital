var express = require('express');
var router = express.Router();
const path = require("path");
const { default: axios } = require("axios");


const urlCountries = "https://api.dingconnect.com/api/V1/GetCountries"

const config = {
    headers:{
      "api_key": "DAAWEgriqEy6rBEhZ9Wprs"
    }
  };


router.get('/', async (req, res) => {
  let respuesta = await axios.get( urlCountries, config )
  res.render('recargar', {opciones: respuesta.data.Items})
});

module.exports = router;
