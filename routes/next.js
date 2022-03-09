var express = require('express');
var router = express.Router();
const { default: axios } = require("axios");


const config = {
    headers:{
      "api_key": "DAAWEgriqEy6rBEhZ9Wprs"
    }
};

router.get('/', (req, res) => {
    const urlOperatos = "https://api.dingconnect.com/api/V1/GetProviders?countryIsos="
    res.render('next')
});
  
router.post('/:isoCountry', async (req, res) => {
    let iso = req.params.isoCountry
    const urlOperators = `https://api.dingconnect.com/api/V1/GetProviders?countryIsos=${iso}`
    let respuesta = await axios.get( urlOperators, config )
    res.render('next', {operadores: respuesta.data.Items})
  })

module.exports = router;