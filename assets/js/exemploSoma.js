"use strict";
const btnEnviar = document.getElementById("sbt-enviar");
const inputPrimeiro = document.getElementById('ipt-primeiro');
const inputSegundo = document.getElementById('ipt-segundo');
function SomaValores(numero1, numero2) {
    return numero1 + numero2;
}
if (btnEnviar) {
    btnEnviar.addEventListener("click", () => {
        try {
            if (!inputPrimeiro && !inputSegundo)
                throw ReferenceError("Valores Inválidos!");
            console.log(SomaValores(Number(inputPrimeiro.value), Number(inputSegundo.value)));
        }
        catch (e) {
            console.log(e.message);
        }
    });
}
