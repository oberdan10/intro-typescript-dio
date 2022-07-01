"use strict";
var Profissao;
(function (Profissao) {
    Profissao[Profissao["Professora"] = 0] = "Professora";
    Profissao[Profissao["Atriz"] = 1] = "Atriz";
    Profissao[Profissao["Analista"] = 2] = "Analista";
})(Profissao || (Profissao = {}));
const pessoa1 = {
    nome: 'André',
    idade: 28,
    cargo: Profissao.Analista,
};
const pessoa2 = {
    nome: 'Marcos',
    idade: 20,
    cargo: Profissao.Analista,
    materias: ['Física', 'Matemática', 'Programação']
};
function listar(lista) {
    for (const item of lista) {
        console.log('- ', item);
    }
}
listar(pessoa2.materias);
