const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
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
        imprimirAlerta('Ambos campos son obligatorios');
        return;
    }
    //consultar API
    consultarAPI()
}

function imprimirAlerta(m){
    const existeError = document.querySelector('.error');

    if(!existeError){
        const divMensaje = document.createElement('p');
        divMensaje.classList.add('error');
        divMensaje.textContent = m;
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove()
        }, 3000)
    }
    
}

function consultarAPI(){
    const {moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner()

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacion(cotizacion){
    limpiarHtml()

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`

    const altoDia = document.createElement('p');
    altoDia.innerHTML = `El Precio más alto del día: <span>${HIGHDAY}</span>`
    
    const bajoDia = document.createElement('p');
    bajoDia.innerHTML = `El Precio más bajo del día: <span>${LOWDAY}</span>`
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación últimas Horas: <span>${CHANGEPCT24HOUR}%</span>`
    
    const actualizado = document.createElement('p');
    actualizado.innerHTML = `Última Actualización: <span>${LASTUPDATE}</span>`


    resultado.appendChild(precio);
    resultado.appendChild(altoDia);
    resultado.appendChild(bajoDia);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(actualizado);
}

function limpiarHtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHtml()
    const spinner = document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `
    resultado.appendChild(spinner)
}