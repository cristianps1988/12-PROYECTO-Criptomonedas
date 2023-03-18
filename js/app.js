const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// crear un promise
const obtenerCripto = cripto => new Promise(resolve => {
    resolve(cripto)
})

document.addEventListener('DOMContentLoaded', ()=> {
    consultarCripto();
    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
    formulario.addEventListener('submit', validarFormulario)
})

function consultarCripto(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCripto(resultado.Data))
        .then(cripto => selectCripto(cripto))
}

function selectCripto(criptos){
    criptos.forEach(cripto => {
        const {CoinInfo:{FullName, Name}} = cripto;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoSelect.appendChild(option)
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function validarFormulario(e){
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        imprimirAlerta('Ambos campos son obligatorios')
    }
}

function imprimirAlerta(m){
    console.log(m)
}