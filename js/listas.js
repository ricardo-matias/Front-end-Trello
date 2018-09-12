// --------------------------------- Funcionalidades das listas ---------------------------------
var z;
function myFunction(x) {
    if (x.matches) { // If media query matches
        z = "cell";
        if (sessionStorage.getItem("resolucao") == "desktop" && sessionStorage.getItem("idBoard") != null) {
            //alert(sessionStorage.getItem("idBoard"));
            location.reload();
        }

        sessionStorage.setItem("resolucao", "cell");
    } else {
        z = "desktop";
        if (sessionStorage.getItem("resolucao") == "cell" && sessionStorage.getItem("idBoard") != null) {
            //alert(sessionStorage.getItem("idBoard"));
            location.reload();
        }
        sessionStorage.setItem("resolucao", "desktop");
    }
}

var x = window.matchMedia("(max-width: 768px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes
// Criar lista (chamado na função de recuperar listas, depois que as listas são exibidas, para ter a referencia do #formLista)

function criarLista(idQuadro) {

    formLista = document.querySelector("#formLista");

    formLista.addEventListener("submit", function (submit) {
        submit.preventDefault();
        console.log("id do board atual: " + idQuadro);

        let url = endereco + "/api/trello/lists/new";

        let objetoLista = {
            name: document.getElementById("nomeLista").value,
            token: token,
            board_id: idQuadro
        }

        let json = JSON.stringify(objetoLista);

        let xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onreadystatechange = function () {
            // location.reload();
            if (this.readyState == 4 && this.status == 200) {
                console.log("resposta criação lista: " + this.response);
                console.log("----------------------------------------");

                recuperarListas(idQuadro);
                formLista.reset();
                //location.reload();
            }
        }


        xhttp.send(json);

    })
}

// Recuperando listas do board atual;

function recuperarListas(idQuadro) { // metodo que renderiza as listas cadastradas no servidor
    recuperarQuadroEspecifico(idQuadro);

    let urlListas = endereco + "/api/trello/lists/" + token + "/board/" + idQuadro;
    let todasListas;

    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", urlListas);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let elementosLista;
            todasListas = JSON.parse(this.response);

            elementosLista = exibirListasCell(todasListas);

            let nav = elementosLista[0];
            let texto = elementosLista[1];

            document.getElementById("grupoListas").innerHTML = texto;
            document.getElementById("listasCelular").innerHTML = nav;

            todasListas.forEach(function (listaAtual) {
                if (z == "desktop") {
                    document.getElementById("demo" + listaAtual.id).setAttribute("class", "collapseCartoes");
                } else {
                    document.getElementById("demo" + listaAtual.id).setAttribute("class", "collapse collapseCartoes");
                }
            })

            // Criar nova lista

            criarLista(idQuadro);

        }
    }

    xhttp.send();
}

function exibirListasCell(todasListas) {
    let texto = "";
    let nav = "";

    todasListas.forEach(function (value) {
        nav += ` <li> <a href="#${value.id}">${value.name}</a> </li> `

        todosCartoes = recuperarCartoes(value.id);
        let texoCartoes = exibirCartoes(todosCartoes, value, idQuadro);

        texto +=
            `<div id="${value.id}" class="listas card bg-light align-top">
            <ul id="grupoCartoes" class="list-group">
                <div class="card-header">
                    <div class="card-text">
                        <div style="float: left; font-weight: bold;">
                            ${value.name}
                        </div>

                        <div class="dropdown">
                        <i style="font-size: 20px; margin: 0%;" id="collapseLista" class="fa fa-caret-down" data-toggle="dropdown"></i>
                        <ul id="iconesListaCell${value.id}" class="dropdown-menu" style="list-style-type: none;"> 
                            <li class="d-flex justify-content-center">
                                <p onclick="deletarLista(${value.id})">
                                    <i class="fa fa-trash-o" title="Deletar lista"></i>
                                    remover
                                <p>
                            </li>
                            <li class="d-flex justify-content-center">
                                <p onclick="passarIdRenomearLista(${value.id}), mudarNomeLista('${value.name}')">
                                    <i class="fa fa-edit" title="Renomear lista"></i>
                                    renomear
                                </p>
                            </li>
                        </ul>
                        </div>

                        <div id="iconesLista" style="float: left;">
                            <i id="deleteList" class="delete fa fa-trash-o" onclick="deletarLista(${value.id})" title="Deletar lista"></i> 
                            <i id="espaco" style="visibility: hidden;">_</i>
                            <i id="editList" class="renomear fa fa-edit" 
                                onclick="passarIdRenomearLista(${value.id}), mudarNomeLista('${value.name}')" title="Renomear lista">
                            </i>
                        </div>
                    </div>
                </div>

            <div id="body-lista" class="card-body">
            <div class="d-flex justify-content-center">
                <button id="botaoColLista" data-toggle="collapse" class="btn btn-info btn-sm" data-target="#demo${value.id}" style="margin-bottom: 3%;">Mostrar cartões</button>
            </div>

            <div id="demo${value.id}" class="collapse collapseCartoes">
                ${texoCartoes}
            </div>
            
            </div>
        </ul>

        <div class="card-footer" style="max-width: 100%;">
            <form id="formCard${value.id}">
                <input required autocomplete="off" style="width:65%; margin-right: 3%;" id="nomeCard${value.id}" class="form-control float-left" name="name" type="text" placeholder="Adicionar cartao..." />
                <input onclick="criarCartao(${value.id}); recuperarListas(idQuadro);"id="botaoCard" class="btn btn-outline-success" type="submit" value="Adicionar"/>
            </form>
            </div>
    </div>
         
    `;
    })

    texto += `  <div id="criarLista" class="card" style="margin-bottom: 2%;">
                    <div class="card-body">
                    <div id="divForm">
                        <form id="formLista">
                            <input autocomplete="off" class="form-control float-left" style="width:80%; margin-right: 3%;" id="nomeLista" name="name" type="text" placeholder=" Criar lista...">
                            <input id="botaoLista" class="btn btn-outline-secondary" type="submit" value="criar">
                        </form>
                        </div>
                    </div>
                </div> 
               
                `;


    return [nav, texto];
}

// Excluindo uma lista

function deletarLista(idLista) {
    let url = endereco + "/api/trello/lists/delete";

    let xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", url);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("deletando lista " + idLista);
            console.log(this.response);

            recuperarListas(idQuadro);
        }
    }

    let objetoLista = {
        list_id: idLista,
        token: token
    }

    let json = JSON.stringify(objetoLista);
    if (confirm("Você realmente deseja excluir essa lista?")) {
        xhttp.send(json);
    }
}

// ---------------------------------------------------------------------------------------------------------

function mudarNomeLista(nomeLista) {
    //alert(nomeLista);
    document.getElementById("tituloRenomearLista").innerHTML = "Renomear: " + nomeLista;
    document.getElementById("inputRenomearLista").setAttribute("placeholder", nomeLista);
}

var idRenomearLista;

function passarIdRenomearLista(idLista) {
    $("#modalRenomearLista").modal("show");
    idRenomearLista = idLista;
    renomearLista(idLista);
}

// Renomeando uma lista

function renomearLista(idLista) {
    let formRenomearLista = document.querySelector("#formRenomearLista");
    formRenomearLista.addEventListener("submit", function (e) {
        e.preventDefault();
        //alert(idRename);
        $("#modalRenomearLista").modal("hide");
        let url = endereco + "/api/trello/lists/rename";

        let xhttp = new XMLHttpRequest();

        xhttp.open("PATCH", url);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // alert("teste");
                console.log(this.response);
                console.log(idLista);
                formRenomearLista.reset();
                recuperarListas(idQuadro);
            }
        }

        let objetoLista = {
            list_id: idRenomearLista,
            name: document.getElementById("inputRenomearLista").value,
            token: token
        }

        let json = JSON.stringify(objetoLista);
        console.log(json);
        xhttp.send(json);

    }, { once: true })

}

// Recuperar lista especifica (chamado no arquivo 'cartoes.js' -> opcoesMoverCard() -> para pegar o nome de todas as listas)

function recuperarListaEspecifica(idLista) {

    let url = "http://www.henriquesantos.pro.br:8080/api/trello/lists/" + token + "/" + idLista;
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, false);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.send();

    let objetoLista = JSON.parse(xhttp.responseText);
    return objetoLista;

}
