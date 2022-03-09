
async function verificar() {

    let campoTexto = document.getElementById("numero")
    const regex = /^[0-9]*$/
    
    if( campoTexto.value !== "" && regex.test(campoTexto.value)){
      localStorage.setItem("number", JSON.stringify(campoTexto.value))
      let {countryIso, prefix} = JSON.parse(localStorage.getItem('seleccion'))
      let numero = JSON.parse(localStorage.getItem('number'))
  
      let response = await fetch('/check-info', {
      method: 'POST',
      body: JSON.stringify({prefix: prefix, numero:numero}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      })
    
      let data = await response.json()

      if( data.validate ) {
        changeButtonState( countryIso, data.normalizedNumber )
      }else {
          $('#modal').modal() 
      }
    }else{
        $('#modal').modal()
    }
}

function changeButtonState( countryIso, newNumber ) {

  const div = document.getElementById("verificar")
  let divTitulo = document.getElementById("titulo-telefono")
  let divSectionCountry = document.querySelector(".section-country")
  let divSectionSubtitle = document.querySelector("#first-subtitle")
  let h4 = document.createElement("h4")
  divTitulo.innerText = ""
  h4.textContent = "¡Número Verificado Exitosamente!"
  h4.className = "text-primary font-tertiary my-4"
  divTitulo.appendChild( h4 )
  
  localStorage.setItem("normalizedNumber", JSON.stringify(newNumber))

  let newElements = 
  `<form id="form" method="POST" action="recargar/n/${countryIso}">
    <button type="submit" class="btn btn-verify">Siguiente</button>
  </form>`
  div.innerHTML = newElements
  divSectionCountry.remove()
  divSectionSubtitle.remove()
}

