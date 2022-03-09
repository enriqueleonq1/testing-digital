var express = require('express');
var router = express.Router();
const { default: axios } = require("axios");


const config = {
    headers:{
      "api_key": "DAAWEgriqEy6rBEhZ9Wprs"
    }
};

router.post("/", async (req, res) => {   
    
    let providerCode = req.body.providerCode
    let accountNumber = req.body.accountNumber
    let countryIso = req.body.countryIso
    let url = `https://api.dingconnect.com/api/V1/GetProducts?countryIsos=${countryIso}&providerCodes=${providerCode}&accountNumber=${accountNumber}`
    
    
    let response = await axios.get( url, config )
    let data = response.data
    
    try{
        if( data.ResultCode === 1 && data.Items.length > 0) {
            res.send({result: true, items: data.Items })
        }else{
            res.send({result: false})
        }
    }catch(err){
        res.send({result: false})
    }
    
})

module.exports = router;