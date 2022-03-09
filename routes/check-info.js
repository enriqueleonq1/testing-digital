var express = require('express');
var router = express.Router();
const { default: axios } = require("axios");


const config = {
    headers:{
      "api_key": "DAAWEgriqEy6rBEhZ9Wprs"
    }
};

router.get("/", (req, res) => {
    const urlLookUp = "https://api.dingconnect.com/api/V1/GetProviders?countryIsos="
    res.send("Hola")
})

router.post("/", async (req, res) => {   
    let data
    let fullNumber = req.body.prefix + req.body.numero
    const urlLookUp = `https://api.dingconnect.com/api/V1/GetAccountLookup?accountNumber=${fullNumber}`
    try{
        let respuesta = await axios.get( urlLookUp, config )
        data = respuesta.data 
        if( data.AccountNumberNormalized !== null  && data.ResultCode === 1){
            objectInfo = {validate: true, normalizedNumber: data.AccountNumberNormalized}
            res.send( objectInfo )
        }else{
            objectInfo = {validate: false}
            res.send( valiobjectInfodate )
        }
    }catch(err){
        objectInfo = {validate: false}
        res.send( objectInfo )
    }
})

module.exports = router;