//Listener formulario
const form = document.getElementById('form');

function saveCountryInformation(){
  const select = document.getElementById("countries")
  let valueOption = select.options[select.selectedIndex]
  let valueSelect = valueOption.innerText
  let valueCountry = valueOption.value
  let prefix = valueOption.getAttribute("prefix")
  if( valueSelect === "España" ){
    valueSelect = "Spain"
  }
  let dataToSave = { country: valueSelect, countryIso: valueCountry, prefix: prefix}
  localStorage.setItem('seleccion', JSON.stringify(dataToSave ))
}


function check(e) {
  tecla = (document.all) ? e.keyCode : e.which;

  //Tecla de retroceso para borrar, siempre la permite
  if (tecla == 8) {
      return true;
  }

  // Patron de entrada, se aceptan solo numeros
  patron = /[0-9]/;
  tecla_final = String.fromCharCode(tecla);
  return patron.test(tecla_final);
}

function saveNumber() {
  const dataInput = document.getElementById("numero")
  localStorage.setItem('number', JSON.stringify(dataInput.value))
}
