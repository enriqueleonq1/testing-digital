let globalData
let flag = false

function loadLocal() {
    let {country, countryIso} = JSON.parse(localStorage.getItem("seleccion"))
    let number = JSON.parse(localStorage.getItem("number"))
    let paisTag = document.getElementById("pais")
    let isoTag = document.getElementById("countryIso")
    let numberTag = document.getElementById("number") 
    if ( country === 'Spain' ){
        country = 'España'
    }
    paisTag.innerText = country
    isoTag.innerText = countryIso
    numberTag.innerHTML = `<strong>Número:</strong> ${number}`
}

async function updateOperatorInfo() {
    const select = document.getElementById("info")
    let valueOption = select.options[select.selectedIndex]
    let nombreOperador = valueOption.innerText
    //provider code
    let providerCode = valueOption.getAttribute("providerCode")
    let accountNumber = JSON.parse(localStorage.getItem("normalizedNumber"))
    let {countryIso} = JSON.parse(localStorage.getItem("seleccion"))

    let response = await fetch("/getProducts", {
        method: "POST",
        body: JSON.stringify({providerCode: providerCode, accountNumber: accountNumber, countryIso: countryIso}),
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    })

    globalData = await response.json()

    if( !globalData.result){
        $('#modal').modal()
    }else{
        showUpdatePage( nombreOperador )
        showProductsInformation( globalData.items )
    }
}

function showUpdatePage( nombreOperador ) {

    if( !flag ) {
        const divSelectOperator = document.getElementById("seleccion-operador")
        let divInfo = document.getElementById("sumary")
        let nameOperator = document.createElement("p")
        nameOperator.innerHTML = `<strong>Operador:</strong> ${nombreOperador}`
        nameOperator.setAttribute("style","font-size: 30px; color:#41228e; font-family:Verdana, Geneva, Tahoma, sans-serif;")
        divInfo.appendChild( nameOperator )
        divSelectOperator.remove()
        flag = true
    }
    
}

function showProductsInformation( data ){
    
    let divProducts = document.getElementById("products")
    divProducts.innerHTML = ""
    let divRow = document.createElement("div")
    divRow.className = "row d-flex justify-content-center"

    for( i = 1; i < data.length; i++ ) {
        let {ReceiveCurrencyIso, ReceiveValue, SendCurrencyIso, SendValue} = data[i].Maximum
        let divColumn = document.createElement("div")
        divColumn.className = "col-md-5"
        let divCard = document.createElement("div")
        divCard.className = "card"
        divCard.innerHTML = `<div class="card-block my-4 mx-4">
                                <h5 class="card-text">El destinatario recibe:</h5>
                                <h4 class="card-title">${ReceiveValue} ${ReceiveCurrencyIso}</h4>
                                <p class="card-text p-y-1">Total incluyendo tarifas: ${SendValue + 1} ${SendCurrencyIso}</p>
                                <button onclick='showPriceInformation(${i})'> Seleccionar </button>
                            </div>`
        divColumn.appendChild( divCard )
        divRow.appendChild( divColumn ) 
    }

    divProducts.appendChild( divRow )
}

function showPriceInformation( elementNumber ) {
   
    //Save information to send API
    let AccountNumber = JSON.parse( localStorage.getItem("normalizedNumber"))
    let SkuCode = globalData.items[elementNumber].SkuCode
    let {SendValue, SendCurrencyIso} = globalData.items[elementNumber].Maximum
    let DistributorRef =  mathRandom( AccountNumber.hashCode() ).toString()

    let objectToSend = {SkuCode: SkuCode, 
                    SendValue: SendValue, 
                    SendCurrencyIso: SendCurrencyIso, 
                    AccountNumber: AccountNumber,
                    DistributorRef: DistributorRef,
                    ValidateOnly: false}

    localStorage.setItem("transferData", JSON.stringify( objectToSend ))          
    
    //Removing div section product
    let sectiondiv = document.getElementById("section-products")
    sectiondiv.remove()

    //Adding send price selected to datos
    let {ReceiveValue, ReceiveCurrencyIso} = globalData.items[elementNumber].Maximum
    let divInfo = document.getElementById("sumary")
    let sendValueP = document.createElement("p")
    sendValueP.setAttribute("style","font-size: 30px; color:#41228e; font-family:Verdana, Geneva, Tahoma, sans-serif;")
    sendValueP.innerHTML = `<strong>El destinatario recibe:</strong> ${ReceiveValue} ${ReceiveCurrencyIso}`

    divInfo.appendChild( sendValueP )

    testPaypamentPaypal()
}

function testPaypamentPaypal() {
    const section = document.querySelector("section")
    let div = document.createElement("div")
    div.className = "container text-center"
    div.setAttribute("style","width: 60%;")
    div.innerHTML = `   <div class="titulo-section-payment">
                            <h3 class="text-white font-tertiary">Seleccionar Método Pago</h3>
                        </div>
                        <div class="formas-pago">
                            <div class="card border-effect" style="width: 45rem;" id="payment-card">
                                <div class="card-body">
                                    <img src="/images/payment/paypal-logo.jpg" style=" width:400px;" >
                                </div>
                                <div class="paypal-pay mb-3">
                                    <button class="btn btn-verify" onclick="payWithPaypal();" id="checkout-btn">Proceder Con El Pago</button>
                                </div>
                            </div>
                            
                        </div>
                        `
                        
    section.appendChild( div )
}

async function payWithPaypal() {

    let transferData = JSON.parse( localStorage.getItem("transferData") )

    let response = await fetch("/p/create-payment", {
        method: "POST",
        body: JSON.stringify({transferData: transferData}),
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    })


    let data = await response.json()
    window.location.href = data.url

}

loadLocal();