/*
enum Profissao {
    Professora,
    Atriz,
    Analista
}

interface Funcionario {
    nome:string;
    idade:number;
    cargo?: Profissao;
}

interface Estudante extends Funcionario {
    materias: string[];
}

const pessoa1: Funcionario = {
    nome: 'André',
    idade: 28,
    cargo: Profissao.Analista,
}

const pessoa2: Estudante = {
    nome: 'Marcos',
    idade: 20,
    cargo: Profissao.Analista,
    materias: ['Física', 'Matemática', 'Programação']
}

function listar(lista: string[]){
    for (const item of lista){
        console.log('- ',item)
    }
}

listar(pessoa2.materias);*/