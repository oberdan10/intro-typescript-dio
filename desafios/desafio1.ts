// Como podemos rodar isso em um arquivo .ts sem causar erros? 

interface Employee {
    code: number,
    name: string
}

let employee1: Employee = {
    code: 10,
    name: "John"
}

//exemplo 2
const employee4 = {} as Employee;
employee4.code = 10;
employee4.name = "John";

//exemplo 3
let employee2: {code: number, name: string} = {
    code: 10,
    name: "John"
}

//exemplo 4
let employee3 = {
    code: 10, 
    name: "John"}

