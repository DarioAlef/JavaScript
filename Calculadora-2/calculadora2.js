function insert(num) {
    var numeros = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = numeros + num
}

function limpar() {
    document.getElementById('resultado').innerHTML = "";
}

function back() {
    var resultado = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = resultado.substring(0, resultado.length - 1)
}

function igualdade() {
    var resultado = document.getElementById('resultado').innerHTML;
    if (resultado) {
        document.getElementById('resultado').innerHTML = eval(resultado);
    }
}

function quadrado(numeros) {
    var quadrado = document.getElementById('resultado').innerHTML;
    document.getElementById(quadrado).innerHTML = numeros * numeros;
}
