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
const login = {};
const lista = {};
let pesquisa = document.getElementById('search');
let idDaLista = document.getElementById('ipt_idlista');
let filme_detalhe = document.getElementById('filme-detalhado-container');
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
let nomeDaLista = document.getElementById('ipt_lista');
let descricaoDaLista = document.getElementById('ipt_descricao');
let loginButton = document.getElementById('btn-logar');
let searchButton = document.getElementById('search-button');
let btnCriarLista = document.getElementById('btn-criarlista');
let btnRemoverLista = document.getElementById('btn-removerlista');
let btnMostrarLista = document.getElementById('btn-mostrarlistas');
let searchContainer = document.getElementById('resultado-container');
if (loginButton) {
    loginButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        let username = document.getElementById('login');
        let key = document.getElementById('api-key');
        let password = document.getElementById('senha');
        login.apiKey = key.value;
        login.username = username.value;
        login.password = password.value;
        login.requestToken = yield criarRequestToken(login.apiKey);
        yield logar(login.requestToken, login.apiKey, login.username, login.password);
        login.sessionId = yield criarSessao(login.apiKey, login.requestToken);
        alert('Usuário Conectado!');
    }));
}
if (btnCriarLista) {
    btnCriarLista.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        lista.nome = nomeDaLista.value;
        lista.descricao = descricaoDaLista.value;
        if (!login.sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        if (!lista.nome && !lista.descricao)
            return;
        try {
            let result = yield criarLista(login.apiKey, login.sessionId);
            console.log(result);
            lista.listaId = String(result.list_id);
            alert(`lista criada - Id:${result.list_id}!`);
        }
        catch (error) {
            alert('Não foi possível criar lista!');
        }
    }));
}
if (btnRemoverLista) {
    btnRemoverLista.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        lista.listaId = idDaLista.value;
        if (!login.sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        if (!lista.listaId)
            return;
        try {
            let result = yield removerLista(login.apiKey, lista.listaId);
            console.log(result);
            alert(`lista removida!`);
        }
        catch (error) {
            alert('Não foi possível remover lista!');
            console.log(error);
        }
    }));
}
if (btnMostrarLista) {
    btnMostrarLista.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        lista.listaId = idDaLista.value;
        if (!login.sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        if (!lista.listaId)
            return;
        try {
            let divlista = document.getElementById("resultado-container");
            if (divlista) {
                divlista.innerHTML = "";
            }
            let resultado = yield pegarLista(login.apiKey, lista.listaId);
            console.log(resultado);
            lista.nome = resultado.name;
            lista.descricao = resultado.description;
            idDaLista.value = lista.listaId;
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
                        let votos_filme_selecionado = document.createElement('p');
                        let ano_filme_selecionado = document.createElement('p');
                        h1_filme_selecionado.appendChild(document.createTextNode(item.title));
                        txt_filme_selecionado.appendChild(document.createTextNode(`${item.overview}`));
                        var data = new Date(item.release_date);
                        ano_filme_selecionado.appendChild(document.createTextNode(`Ano: ${String(data.getFullYear())}`));
                        votos_filme_selecionado.appendChild(document.createTextNode(`Pontuação: ${item.vote_average}`));
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
                                lista.listaId = idDaLista.value;
                                let result = yield adicionarFilmeNaLista(login.apiKey, login.sessionId, btn_lista_add_filme_selecionado.value, lista.listaId);
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
                        div_txt_filme_selecionado.appendChild(ano_filme_selecionado);
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
            console.log(error);
            alert('Não foi possível mostrar lista! \n Digite o Id da Lista.');
        }
    }));
}
if (searchButton) {
    searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!login.sessionId)
            throw Error('Sessão expirada, realizar login novamente!');
        try {
            let divlista = document.getElementById("resultado-container");
            if (divlista) {
                divlista.innerHTML = "";
            }
            let query = pesquisa.value;
            let listaDeFilmes = [];
            listaDeFilmes = yield procurarFilme(login.apiKey, query);
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
                        let ano_filme_selecionado = document.createElement('p');
                        h1_filme_selecionado.appendChild(document.createTextNode(item.title));
                        txt_filme_selecionado.appendChild(document.createTextNode(`${item.overview}`));
                        var data = new Date(item.release_date);
                        ano_filme_selecionado.appendChild(document.createTextNode(`Ano: ${String(data.getFullYear())}`));
                        votos_filme_selecionado.appendChild(document.createTextNode(`Pontuação: ${item.vote_average}`));
                        btn_lista_add_filme_selecionado.appendChild(document.createTextNode('Adicionar na Lista'));
                        img_filme_selecionado.src = `${IMG_URL}${item.poster_path}`;
                        img_filme_selecionado.alt = item.title;
                        img_filme_selecionado.classList.add('img-filme-selecionado');
                        btn_lista_add_filme_selecionado.classList.add('btn_page');
                        btn_lista_add_filme_selecionado.id = "btn-addlistaselecionado";
                        btn_lista_add_filme_selecionado.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                            try {
                                lista.listaId = idDaLista.value;
                                let result = yield adicionarFilmeNaLista(login.apiKey, login.sessionId, btn_lista_add_filme_selecionado.value, lista.listaId);
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
                        div_txt_filme_selecionado.appendChild(ano_filme_selecionado);
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
            console.log(error);
        }
    }));
}
class HttpClient {
    static get({ url = '', method = '', body = '' }) {
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
function procurarFilme(apiKey, query) {
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
function adicionarFilme(apiKey, filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`,
            method: "GET"
        });
        console.log(result);
    });
}
function criarRequestToken(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        return result.request_token;
    });
}
function logar(requestToken, apiKey, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            }
        });
    });
}
function criarSessao(apiKey, requestToken) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        return result.session_id;
    });
}
function criarLista(apiKey, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: lista.nome,
                description: lista.descricao,
                language: "pt-br"
            }
        });
        return result;
    });
}
function adicionarFilmeNaLista(apiKey, sessionId, valor, listId) {
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
function pegarLista(apiKey, listId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}&language=pt-BR`,
            method: "GET"
        });
        return result;
    });
}
function removerLista(apiKey, listId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "DELETE"
        });
        return result;
    });
}
