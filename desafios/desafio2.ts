// Como podemos melhorar o esse código usando TS? 
enum Cargo {
    Atriz,
    Padeiro
}

interface Funcionario {
    nome: string;
    idade: number;
    profissao: Cargo
}

let funcionario1 = {} as Funcionario;
funcionario1.nome = "maria";
funcionario1.idade = 29;
funcionario1.profissao = Cargo.Atriz;

let funcionario2 = {}as Funcionario;
funcionario2.nome = "roberto";
funcionario2.idade = 19;
funcionario2.profissao = Cargo.Padeiro;

let funcionario3 = {
    nome: "laura",
    idade: "32",
    profissao: "Atriz"
};

let funcionario4 = {
    nome: "carlos",
    idade: 19,
    profissao: "Padeiro"
}