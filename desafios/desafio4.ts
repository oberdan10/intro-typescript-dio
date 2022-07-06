// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
interface Login{
  username:string;
  password:string;
  apiKey:string;
  sessionId:string;
  requestToken:string;
}

interface Lista{
  listaId:string;
  nome:string;
  descricao:string;
}

const login = {} as Login;
const lista = {} as Lista;

let pesquisa = document.getElementById('search') as HTMLInputElement;
let idDaLista = document.getElementById('ipt_idlista') as HTMLInputElement;
let filme_detalhe = document.getElementById('filme-detalhado-container') as HTMLDivElement;

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
let nomeDaLista = document.getElementById('ipt_lista') as HTMLInputElement;
let descricaoDaLista = document.getElementById('ipt_descricao') as HTMLInputElement;
let loginButton = document.getElementById('btn-logar') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement;
let btnCriarLista = document.getElementById('btn-criarlista') as HTMLButtonElement;
let btnRemoverLista = document.getElementById('btn-removerlista') as HTMLButtonElement;
let btnMostrarLista = document.getElementById('btn-mostrarlistas') as HTMLButtonElement;
let searchContainer = document.getElementById('resultado-container') as HTMLDivElement;

if (loginButton) {
  loginButton.addEventListener('click', async () => {

    let username = document.getElementById('login') as HTMLInputElement;
    let key = document.getElementById('api-key') as HTMLInputElement
    let password = document.getElementById('senha') as HTMLInputElement;

    login.apiKey = key.value;
    login.username = username.value;
    login.password = password.value;

    login.requestToken = await criarRequestToken(login.apiKey);
    await logar(login.requestToken,login.apiKey,login.username,login.password);
    login.sessionId = await criarSessao(login.apiKey,login.requestToken);
    alert('Usuário Conectado!');
  })
}

if (btnCriarLista) {
  btnCriarLista.addEventListener('click', async () => {
    
    lista.nome = nomeDaLista.value;
    lista.descricao = descricaoDaLista.value;

    if(!login.sessionId) throw Error('Sessão expirada, realizar login novamente!');
    if (!lista.nome && !lista.descricao) return;
    try {
      let result:any = await criarLista(login.apiKey,login.sessionId);
      console.log(result);
      lista.listaId = String(result.list_id);
      alert(`lista criada - Id:${result.list_id}!`);
    } catch (error) {
      alert('Não foi possível criar lista!');
    }
  })
}

if (btnRemoverLista) {
  btnRemoverLista.addEventListener('click', async () => {

    lista.listaId = idDaLista.value;
    if(!login.sessionId) throw Error('Sessão expirada, realizar login novamente!');
    if (!lista.listaId) return;
    try {
      let result:any = await removerLista(login.apiKey, lista.listaId);
      console.log(result);
      alert(`lista removida!`);
    } catch (error) {
      alert('Não foi possível remover lista!');
      console.log(error);
    }
  })
}

if (btnMostrarLista) {
  btnMostrarLista.addEventListener('click', async () => {

    lista.listaId = idDaLista.value;
    if(!login.sessionId) throw Error('Sessão expirada, realizar login novamente!');
    if (!lista.listaId) return;
    try {
      let divlista = document.getElementById("resultado-container");
    if (divlista) {
      divlista.innerHTML = "";
    }

      let resultado:any = await pegarLista(login.apiKey, lista.listaId);
      console.log(resultado);

      lista.nome = resultado.name;
      lista.descricao = resultado.description;

      idDaLista.value = lista.listaId;
      nomeDaLista.value = resultado.name;
      descricaoDaLista.value = resultado.description;


      for (const item of resultado.items) {
        let div = document.createElement('div') as HTMLDivElement;
        div.id = "card-container";
        let p = document.createElement('p');
        p.appendChild(document.createTextNode(item.title));
  
        let img = document.createElement('IMG') as HTMLImageElement;
        img.src = `${IMG_URL}${item.poster_path}`;
        img.alt = item.title;
        img.addEventListener('mouseenter', async () => {
  
          if (filme_detalhe) {
  
            let img_filme_selecionado = document.createElement('IMG') as HTMLImageElement;
            let div_txt_filme_selecionado = document.createElement('div') as HTMLDivElement;
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

            
            btn_lista_add_filme_selecionado.addEventListener('click', async () => {
               console.log('Ok');
                try {
                  lista.listaId = idDaLista.value;
                  let result:any = await adicionarFilmeNaLista(login.apiKey,login.sessionId,btn_lista_add_filme_selecionado.value, lista.listaId);
                  console.log(result);
                  alert(`Item Adicionado!`);
                } catch (error) {
                  alert('Não foi possível adicionar na lista! \n Digite o Id da Lista no campo de Id em Lista!');
                }
              })
            
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
  
        })
  
        div.appendChild(img);
        div.appendChild(p)
        if (searchContainer) {
          searchContainer.appendChild(div);
        }
      }
    } catch (error) {
      console.log(error);
      alert('Não foi possível mostrar lista! \n Digite o Id da Lista.');
    }
  })
}

if (searchButton) {
  searchButton.addEventListener('click', async () => {
    if(!login.sessionId) throw Error('Sessão expirada, realizar login novamente!');

    try {
      let divlista = document.getElementById("resultado-container");
      if (divlista) {
        divlista.innerHTML = "";
      }
      let query = pesquisa.value;
      let listaDeFilmes: any = [];
      listaDeFilmes = await procurarFilme(login.apiKey, query);
      for (const item of listaDeFilmes.results) {
        let div = document.createElement('div') as HTMLDivElement;
        div.id = "card-container";
        let p = document.createElement('p');
        p.appendChild(document.createTextNode(item.title));
  
        let img = document.createElement('IMG') as HTMLImageElement;
        img.src = `${IMG_URL}${item.poster_path}`;
        img.alt = item.title;
        img.addEventListener('mouseenter', async () => {
  
          if (filme_detalhe) {
  
            let img_filme_selecionado = document.createElement('IMG') as HTMLImageElement;
            let div_txt_filme_selecionado = document.createElement('div') as HTMLDivElement;
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
  
            btn_lista_add_filme_selecionado.addEventListener('click', async () => {
               try {
                lista.listaId = idDaLista.value;
                 let result:any = await adicionarFilmeNaLista(login.apiKey,login.sessionId,btn_lista_add_filme_selecionado.value, lista.listaId);
                 alert(`Item Adicionado!`);
               } catch (error) {
                 alert('Não foi possível adicionar na lista!');
               }
             })
  
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
  
        })
  
        div.appendChild(img);
        div.appendChild(p)
        if (searchContainer) {
          searchContainer.appendChild(div);
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  })
}

class HttpClient {
  static async get({ url = '', method = '', body = '' }) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(apiKey: string, query: string) {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${query}`,
    method: "GET"
  })
  return result
}

async function adicionarFilme(apiKey:string, filmeId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`,
    method: "GET"
  })
  console.log(result);
}

async function criarRequestToken(apiKey: string) {
  let result: any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  })

  return result.request_token;
}

async function logar(requestToken: string, apiKey: string, username: string, password: string) {

  let result: any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })

}

async function criarSessao(apiKey: string, requestToken: string) {
  let result: any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  })
  return result.session_id;
}

async function criarLista(apiKey: string, sessionId: string) {

  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: lista.nome,
      description: lista.descricao,
      language: "pt-br"
    }
  })
  return result;
}

async function adicionarFilmeNaLista(apiKey: string, sessionId: string, valor: string, listId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: valor
    }
  })
  return result;
}

async function pegarLista(apiKey: string,listId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}&language=pt-BR`,
    method: "GET"
  })
  return result;
}

async function removerLista(apiKey: string, listId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "DELETE"
  })
  return result;
}
