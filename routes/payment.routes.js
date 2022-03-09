var express = require('express');
var router = express.Router();
const request = require('request');
const path = require('path');
const { default: axios } = require("axios");


//CONFIGURACION API PAYPAL

/*const CLIENT = 'AQf1yfwCcZnd-kTqjeZjy2_nk0D0et9a2hZk13ejiq-awpPV56Etfwmrd1ZeuRfEZI-eBvS18f_rFBAQ';
const SECRET = 'ECfVkyIQ68vyLNYuhmpgcmVBMsuSCyGC690aLHJ3l-MiqN4c4dC6S0dePHxCuMmnXfBVo-4pAmMOb4km';*/
const CLIENT = 'AZG6gziwSS8zJZ2lBv6V6cqrsjAGgNVjBqzkkizqlrDsTUpxd1zm9YfbYsUhhqjy2ME8gYcTnAnGNEic';
const SECRET = 'EFheqwFGLe365Ssr2tMl9e7KIcP7c1fBvQUFjeg3AdV0m0RDFdyaC2Ctav_L_AEVGGsk8wtmYuMlSYfv';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

let data = {
    AccountNumber: "34000000000",
    DistributorRef: null,
    SendCurrencyIso: null,
    SendValue: null,
    SkuCode: null,
    ValidateOnly: null
}

let globalResponse
let returnUrl = path.join(__dirname, "p/execute-payment")
let cancelUrl = path.join(__dirname, "recargar")

const auth = { user: CLIENT, pass: SECRET }
//FIN CONFIGURACION API PAYPAL

const createPayment = (req, res) => {

    
    var returnUrl = req.protocol + '://' + req.headers.host  + '/p/execute-payment'
    var cancelUrl = req.protocol + '://' + req.headers.host  + '/recargar'
   

    //data.AccountNumber = req.body.transferData.AccountNumber
    data.DistributorRef = req.body.transferData.DistributorRef
    data.SendCurrencyIso = req.body.transferData.SendCurrencyIso
    data.SendValue = req.body.transferData.SendValue
    data.SkuCode = req.body.transferData.SkuCode
    data.ValidateOnly = req.body.transferData.ValidateOnly

    const body = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'EUR',
                value: `${data.SendValue + 1}`
            }
        }],
        application_context: {
            brand_name: `TuRecarga`,
            landing_page: 'NO_PREFERENCE', 
            user_action: 'PAY_NOW', 
            return_url: `${returnUrl}`, // Url despues de realizar el pago
            cancel_url: `${cancelUrl}` // Url despues de realizar el pago
        }
    }

    request.post(`${PAYPAL_API}/v2/checkout/orders`, {
        auth,
        body,
        json: true
    }, (err, response) => {
        
        
        const payment_url = response.body.links[1].href
        res.send( { url: payment_url })
    })
}

/**
 * Esta funcion captura el dinero REALMENTE
 * @param {*} req 
 * @param {*} res 
 */

const executePayment = (req, res) => {

    const token = req.query.token; //<-----------

    request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {

        let {status, id} = response.body
        if( status == "COMPLETED" && data.SendValue !== null) {

            //CONFIGURACION API DING CONNECT 
            let dataParsed = JSON.stringify( data ) 

            var config = {
                method: 'post',
                url: 'https://api.dingconnect.com/api/V1/SendTransfer',
                headers: { 
                  'Content-Type': 'application/json', 
                  'api_key': 'DAAWEgriqEy6rBEhZ9Wprs'
                },
                data : dataParsed
              };
              
              axios(config)
              .then(function (response) {
                globalResponse = response.data
                res.redirect("/p/payment-successful")
              })
              .catch(function (error) {
                //Problema con la transferencia
                console.log(error);
              });

        }else {
            //Problema con el pago
            console.log("Error")
        }
        
    })
}

const paymentSuccessful = (req, res) => {
    
    res.render('payment-sucessful', {data: globalResponse})

}

router.post(`/create-payment`, createPayment)


router.get(`/execute-payment`, executePayment)

router.get(`/payment-successful`, paymentSuccessful )


module.exports = router;