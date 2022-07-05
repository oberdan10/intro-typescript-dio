"use strict";
// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela
// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
var apiKey = '80ab4bdc4c3ab3975c1e48fcbaf7edec';
var apiKey = '0';
console.log(apiKey);
// let apiKey;
let requestToken;
let username = document.getElementById('login');
let key = document.getElementById('api-key');
let password = document.getElementById('senha');
let pesquisa = document.getElementById('search');
let idDaLista = document.getElementById('ipt_idlista');
let nomeDaLista = document.getElementById('ipt_lista');
let descricaoDaLista = document.getElementById('ipt_descricao');
let filme_detalhe = document.getElementById('filme-detalhado-container');
let sessionId;
let listId;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let btnCriarLista = document.getElementById('btn-criarlista');
let btnRemoverLista = document.getElementById('btn-removerlista');
let btnMostrarLista = document.getElementById('btn-mostrarlistas');
let searchContainer = document.getElementById('resultado-container');
if (loginButton) {
    loginButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        //apiKey = key.value;
        apiKey = '80ab4bdc4c3ab3975c1e48fcbaf7edec';
        yield criarRequestToken();
        yield logar();
        yield criarSessao();
        alert('Usuário Conectado!');
    }));
}
if (btnCriarLista) {
    btnCriarLista.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        if (!nomeDaLista.value && !descricaoDaLista.value)
            return;
        try {
            let result = yield criarLista();
            console.log(result);
            idDaLista.value = String(result.list_id);
            alert(`lista criada - Id:${result.list_id}!`);
        }
        catch (error) {
            alert('Não foi possível criar lista!');
        }
    }));
}
if (btnRemoverLista) {
    btnRemoverLista.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        if (!idDaLista.value)
            return;
        try {
            let result = yield removerLista();
            console.log(result);
            alert(`lista removida!`);
        }
        catch (error) {
            alert('Não foi possível remover lista!');
            console.log(error.message);
        }
    }));
}
if (btnMostrarLista) {
    btnMostrarLista.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        if (!idDaLista.value)
            return;
        try {
            let lista = document.getElementById("resultado-container");
            if (lista) {
                lista.innerHTML = "";
            }
            let resultado = yield pegarLista();
            console.log(resultado);
            nomeDaLista.value = resultado.name;
            descricaoDaLista.value = resultado.description;
            for (const item of resultado.items) {
                let div = document.createElement('div');
                div.id = "card-container";
                let p = document.createElement('p');
                p.appendChild(document.createTextNode(item.title));
                let img = document.createElement('IMG');
                img.src = `${IMG_URL}${item.poster_path}`;
                img.alt = item.title;
                img.addEventListener('mouseenter', () => __awaiter(void 0, void 0, void 0, function* () {
                    if (filme_detalhe) {
                        let img_filme_selecionado = document.createElement('IMG');
                        let div_txt_filme_selecionado = document.createElement('div');
                        let btn_lista_add_filme_selecionado = document.createElement('button');
                        let h1_filme_selecionado = document.createElement('h1');
                        let txt_filme_selecionado = document.createElement('p');
                        h1_filme_selecionado.appendChild(document.createTextNode(item.title));
                        txt_filme_selecionado.appendChild(document.createTextNode(item.overview));
                        btn_lista_add_filme_selecionado.appendChild(document.createTextNode('Adicionar na Lista'));
                        img_filme_selecionado.src = `${IMG_URL}${item.poster_path}`;
                        img_filme_selecionado.alt = item.title;
                        img_filme_selecionado.classList.add('img-filme-selecionado');
                        btn_lista_add_filme_selecionado.classList.add('btn_page');
                        btn_lista_add_filme_selecionado.style.width = '150px';
                        btn_lista_add_filme_selecionado.value = item.id;
                        btn_lista_add_filme_selecionado.id = "btn-addlistaselecionado";
                        btn_lista_add_filme_selecionado.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                            console.log('Ok');
                            try {
                                let result = yield adicionarFilmeNaLista(btn_lista_add_filme_selecionado.value);
                                console.log(result);
                                alert(`Item Adicionado!`);
                            }
                            catch (error) {
                                alert('Não foi possível adicionar na lista! \n Digite o Id da Lista no campo de Id em Lista!');
                            }
                        }));
                        filme_detalhe.innerHTML = "";
                        filme_detalhe.appendChild(img_filme_selecionado);
                        div_txt_filme_selecionado.appendChild(h1_filme_selecionado);
                        div_txt_filme_selecionado.appendChild(txt_filme_selecionado);
                        div_txt_filme_selecionado.appendChild(btn_lista_add_filme_selecionado);
                        div_txt_filme_selecionado.classList.add('div-filme-selecionado');
                        filme_detalhe.appendChild(div_txt_filme_selecionado);
                    }
                }));
                div.appendChild(img);
                div.appendChild(p);
                if (searchContainer) {
                    searchContainer.appendChild(div);
                }
            }
        }
        catch (error) {
            console.log(error.message);
            alert('Não foi possível mostrar lista! \n Digite o Id da Lista.');
        }
    }));
}
if (searchButton) {
    searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        try {
            let lista = document.getElementById("resultado-container");
            if (lista) {
                lista.innerHTML = "";
            }
            let query = pesquisa.value;
            let listaDeFilmes = [];
            listaDeFilmes = yield procurarFilme(query);
            for (const item of listaDeFilmes.results) {
                let div = document.createElement('div');
                div.id = "card-container";
                let p = document.createElement('p');
                p.appendChild(document.createTextNode(item.title));
                let img = document.createElement('IMG');
                img.src = `${IMG_URL}${item.poster_path}`;
                img.alt = item.title;
                img.addEventListener('mouseenter', () => __awaiter(void 0, void 0, void 0, function* () {
                    if (filme_detalhe) {
                        let img_filme_selecionado = document.createElement('IMG');
                        let div_txt_filme_selecionado = document.createElement('div');
                        let btn_lista_add_filme_selecionado = document.createElement('button');
                        let h1_filme_selecionado = document.createElement('h1');
                        let txt_filme_selecionado = document.createElement('p');
                        let votos_filme_selecionado = document.createElement('p');
                        h1_filme_selecionado.appendChild(document.createTextNode(item.title));
                        txt_filme_selecionado.appendChild(document.createTextNode(`${item.overview}`));
                        votos_filme_selecionado.appendChild(document.createTextNode(`Votação: ${item.vote_average}`));
                        btn_lista_add_filme_selecionado.appendChild(document.createTextNode('Adicionar na Lista'));
                        img_filme_selecionado.src = `${IMG_URL}${item.poster_path}`;
                        img_filme_selecionado.alt = item.title;
                        img_filme_selecionado.classList.add('img-filme-selecionado');
                        btn_lista_add_filme_selecionado.classList.add('btn_page');
                        btn_lista_add_filme_selecionado.id = "btn-addlistaselecionado";
                        btn_lista_add_filme_selecionado.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                            try {
                                let result = yield adicionarFilmeNaLista(btn_lista_add_filme_selecionado.value);
                                alert(`Item Adicionado!`);
                            }
                            catch (error) {
                                alert('Não foi possível adicionar na lista!');
                            }
                        }));
                        btn_lista_add_filme_selecionado.style.width = '150px';
                        btn_lista_add_filme_selecionado.value = item.id;
                        filme_detalhe.innerHTML = "";
                        filme_detalhe.appendChild(img_filme_selecionado);
                        div_txt_filme_selecionado.appendChild(h1_filme_selecionado);
                        div_txt_filme_selecionado.appendChild(txt_filme_selecionado);
                        div_txt_filme_selecionado.appendChild(votos_filme_selecionado);
                        div_txt_filme_selecionado.appendChild(btn_lista_add_filme_selecionado);
                        div_txt_filme_selecionado.classList.add('div-filme-selecionado');
                        filme_detalhe.appendChild(div_txt_filme_selecionado);
                    }
                }));
                div.appendChild(img);
                div.appendChild(p);
                if (searchContainer) {
                    searchContainer.appendChild(div);
                }
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }));
}
function preencherSenha() {
    //password = document.getElementById('senha').value;
    validateLoginButton();
}
function preencherLogin() {
    //username =  document.getElementById('login').value ;
    validateLoginButton();
}
function preencherApi() {
    //apiKey = document.getElementById('api-key').value;
    validateLoginButton();
}
function validateLoginButton() {
    if (loginButton) {
        if (password && username && apiKey) {
            loginButton.disabled = false;
        }
        else {
            loginButton.disabled = true;
        }
    }
}
class HttpClient {
    static get({ url, method, body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${query}`,
            method: "GET"
        });
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`,
            method: "GET"
        });
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username.value}`,
                password: `${password.value}`,
                request_token: `${requestToken}`
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        sessionId = result.session_id;
    });
}
function criarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: nomeDaLista.value,
                description: descricaoDaLista.value,
                language: "pt-br"
            }
        });
        return result;
    });
}
function adicionarFilmeNaLista(valor) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: valor
            }
        });
        return result;
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        listId = idDaLista.value;
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}&language=pt-BR`,
            method: "GET"
        });
        return result;
    });
}
function removerLista() {
    return __awaiter(this, void 0, void 0, function* () {
        listId = idDaLista.value;
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "DELETE"
        });
        return result;
    });
}
