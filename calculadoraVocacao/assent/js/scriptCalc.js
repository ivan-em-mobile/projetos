
//essa função serve para adicionar cada número quando você clicar no número correspondente.
function insert(number) {
    var numero = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = numero + number
}
//essa função serve para quando você clicar no botão "C" ele apaga tudo que está escrito no Resultado.
function clean() {
    document.getElementById('resultado').innerHTML = "";
}
//essa função serve para quando você clicar no botão "<" ele apaga um número por vez.
function back() {
    var resultado = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = resultado.substring(0, resultado.length - 1)
}
//essa função serve para quando você clicar no "=" ele calcular. O "eval" serve para fazer todo tipo de calculo.
function calcular() {
    var resultado = document.getElementById('resultado').innerHTML
    if (resultado) {
        document.getElementById('resultado').innerHTML = eval(resultado);
    }
    //Caso não haja nada para calcular vai aparecer a mensagem "nada para calcular".
    else {
        document.getElementById('resultado').innerHTML = ("nada para calcular")
    }
}