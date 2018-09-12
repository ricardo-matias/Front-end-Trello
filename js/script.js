// Pegando o id do quadro (caso for clicado a página é atualizada e chega aqui com o "idQuadro" no sessionStorage);
// side navigation buttons
var idQuadro = window.sessionStorage.getItem("idQuadro");

var endereco = "http://www.henriquesantos.pro.br:8080";

// Recuperando o token gerado pelo login.html;

var token = window.sessionStorage.getItem("token");

console.log(token);

redirecionarParaLogin();

function redirecionarParaLogin() {
    // Tratamento caso acesse o index.html sem fazer login;

    if (token == null || token == undefined) {
        window.open("login.html", "_self");
    }

    // Fazer logout;

    let logout = document.getElementById("logout");

    logout.addEventListener("click", function () {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("idQuadro");
        location.reload();
    })

}

// ----------------------------------------------------------------------------------------------------------------------

// Alternar a visibilidade entre boards e listas caso a página seja atualizada;

verificarSessao();

function verificarSessao() {

    let inicioQuadros = document.querySelector("#inicioQuadros");
    let grupoListas = document.querySelector("#grupoListas");

    inicioQuadros.style.display = 'none';
    document.getElementById("bodyPagina").style.backgroundImage = "none";
    document.getElementById("html").style.backgroundImage = "none";
    grupoListas.style.display = "none";

    if (idQuadro == null) {
        recuperarQuadrosCriados();
        inicioQuadros.style.display = 'block';

    } else {
        recuperarListas(idQuadro);
        grupoListas.style.display = 'block';
        document.getElementById("dentroQuadro").style.backgroundImage = "none"
        document.getElementById("dentroQuadro").style.backgroundRepeat = "no-repeat"
        document.getElementById("dentroQuadro").style.backgroundSize = "cover"
        document.getElementById("bodyPagina").style.backgroundImage = "none"
        document.getElementById("bodyPagina").style.backgroundRepeat = "no-repeat"
        document.getElementById("bodyPagina").style.backgroundSize = "cover"
    }

}


// Alternar a visibilidade entre boards e listas caso o botão "quadros" seja clicado;

function voltarInicioQuadros() {
    window.sessionStorage.removeItem("idQuadro");
    window.sessionStorage.removeItem("idBoard");
    location.reload();
}

eventoVoltarInicio();

function eventoVoltarInicio() {
    let boards = document.querySelector("#boards");

    boards.addEventListener("click", function () {
        voltarInicioQuadros();
    })
}



// ----------------------------------------------------------------------------------------------------------------------

// Recuperar usuário pelo token gerado;

function recuperarUsuario() {

    let urlToken = endereco + "/api/trello/users/" + token;
    //console.log(url);

    let xhttpUsuario = new XMLHttpRequest();
    xhttpUsuario.open("GET", urlToken);
    xhttpUsuario.setRequestHeader('Content-Type', 'application/json');

    xhttpUsuario.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.response);
            let usuario = JSON.parse(this.response);
            //console.log(usuario);
            document.getElementById("nomeUsuario").innerHTML = usuario.name + " - Trello";
            window.sessionStorage.setItem("nomeUsuario", usuario.name);
        }
    }

    xhttpUsuario.send();

}

recuperarUsuario();