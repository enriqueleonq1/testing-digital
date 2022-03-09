const number = JSON.parse( localStorage.getItem("number") )
let title = document.createElement("h4")
title.innerHTML = `<strong>Número receptor:</strong> ${number}`

document.getElementById("number").appendChild( title )
