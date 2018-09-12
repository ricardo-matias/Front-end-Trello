const direcoes = Object.freeze({ "direita": 1, "esquerda": -1, "todas": 0 })

// Adicionar cartão (chamada feita no arquivo 'listas.js' -> função de exibir listas -> no botão de adicionar cartão)

function criarCartao(idLista) {
    //alert("#formCard" + id);

    document.getElementById("formCard" + idLista).addEventListener("submit", function (submit) {
        submit.preventDefault();

        let objetoCartao = {
            name: document.getElementById("nomeCard" + idLista).value,
            token: token,
            list_id: idLista
        }

        let url = endereco + "/api/trello/cards/new";

        let xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //console.log(this.response);
            }
        }

        let json = JSON.stringify(objetoCartao);
        xhttp.send(json);
        //alert(json);

    })
}


// Recuperar cartões (chamada feita no arquivo 'listas.js' -> função de exibir listas -> objeto sendo usado para exibir cartões)

function recuperarCartoes(idLista) {
    let urlCardsCriados = endereco + "/api/trello/cards/" + token + "/list/" + idLista;

    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", urlCardsCriados, false);

    xhttp.send();

    let objetoCartao = JSON.parse(xhttp.responseText);
    //console.log(objetoCartao);
    return objetoCartao;
}

// Exibir cartões (chamada feita no arquivo 'listas.js' -> função de exibir listas -> retorno sendo usado para ser inserido no meio das listas)

function exibirCartoes(todosCartoes, listaAtual, idQuadro) {
    textoCartao = "";
    todosCartoes.forEach(function (cartaoAtual) {

        textoCartao += `
        <li class="list-group-item" style="border: 1px solid black; padding:1%;">
        <div style="width: 100%; margin-top:2%;">
            <div class="cartao d-flex justify-content-center" id="${cartaoAtual.id}">
                <div id="lul" title="${cartaoAtual.name}"> ${cartaoAtual.name}
                    <i id="setaEsquerda" class="fa fa-arrow-circle-o-left" onclick="criarArrayIdListas(${listaAtual.id},${cartaoAtual.id}, ${idQuadro}, ${direcoes.esquerda});"></i>
                    <i id="setaDireita" class="fa fa-arrow-circle-o-right" onclick="criarArrayIdListas(${listaAtual.id},${cartaoAtual.id}, ${idQuadro}, ${direcoes.direita});"></i>
                </div>
            </div>

            <div class="d-flex justify-content-between" style="margin-top: 5%; margin-bottom: 2%;">
                <i id="botaoModalCard" class="fa fa-align-left" style="margin-left: 5%;" 
                    onclick="prepararModalCard(${cartaoAtual.id}), mudarNomeCartao('${cartaoAtual.name}')">
                </i>
                <span id="localTags${cartaoAtual.id}" class="d-flex justify-content-center" style="width:60%;">
                    <!--<span class="etiqueta" style="background-color:red;">__</span>
                    <span class="etiqueta" style="background-color:blue;">__</span>
                    <span class="etiqueta" style="background-color:green;">__</span>-->
                </span>
                <i class="fa fa-exchange" style="float: right; margin-right: 5%; margin-top: 2%;" onclick="criarArrayIdListas(${listaAtual.id},${cartaoAtual.id}, ${idQuadro}, ${direcoes.todas});"></i>
            </div>
            </div>
         </li>`;

        recuperarTags(cartaoAtual.id);
    });


    return textoCartao;
}

// ----------------------------------- Funções para mover o cartão -------------------------------------

function pegarIdListas(arrayIdListas, idListaAtual, idx) {
    let index = idx;
    arrayIdListas[index] = idListaAtual;

    return arrayIdListas;
}

// Criar array com ids de todas as listas (chamada feita no metodo de exibir cartões -> nos botões de mover o cartão)

function criarArrayIdListas(idListaAtual, idCartao, idQuadro, direcaoEscolhida) {

    let idsListas = [];

    let urlListas = endereco + "/api/trello/lists/" + token + "/board/" + idQuadro;
    //console.log(urlListas);
    let todasListas;

    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", urlListas);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            todasListas = JSON.parse(this.response);

            todasListas.forEach(function (value, idx) {
                idsListas = pegarIdListas(todasListas, value.id, idx);
            });

            //console.log(idsListas);
            if (direcaoEscolhida == direcoes.direita) {
                moverCardDireita(idCartao, idListaAtual, idsListas);
            } else if (direcaoEscolhida == direcoes.esquerda) {
                moverCardEsquerda(idCartao, idListaAtual, idsListas);
            } else {
                moverCardGeral(idCartao, idListaAtual, idsListas);
            }

        }

    }

    xhttp.send();

}

function moverCardDireita(idCartao, listaAtual, arrayIdListas) {

    let proximaLista = listaAtual;

    for (let i = 0; i < arrayIdListas.length; i++) {
        if (arrayIdListas[i] > proximaLista) {
            proximaLista = arrayIdListas[i];
            break;
        }
    }

    moverCartao(proximaLista, idCartao);

}

function moverCardEsquerda(idCartao, listaAtual, arrayIdListas) {

    let listaAnterior = listaAtual;

    for (let i = arrayIdListas.indexOf(listaAtual); i != -1; i--) {
        if (listaAnterior > arrayIdListas[i]) {
            listaAnterior = arrayIdListas[i];
            break;
        }
    }

    //console.log(anterior);

    moverCartao(listaAnterior, idCartao);

}

function moverCardGeral(idCartao, listaAtual, arrayIdListas) {
    let todasListas = [];

    for (let i = 0; i < arrayIdListas.length; i++) {
        if (arrayIdListas[i] != listaAtual) {
            todasListas[i] = arrayIdListas[i];
            //console.log(listaAtual);
        }
    }

    $("#modalMover").modal("show");
    opcoesMoverCartao(todasListas, idCartao);

}

function opcoesMoverCartao(arrayIdListas, idCartao) {

    let listaAtual;

    let textoOpcoesListas = "";
    arrayIdListas.forEach(function (idListaAtual) {
        listaAtual = recuperarListaEspecifica(idListaAtual);
        //console.log(listaAtual);
        textoOpcoesListas += `
        <div class="dropdown-item" onclick="moverCartao(${idListaAtual}, ${idCartao}); fecharModalMover();">${listaAtual.name}</div>
        `;
    })

    document.getElementById("opcoesMoverCartao").innerHTML = textoOpcoesListas;

}

function fecharModalMover() {
    $("#modalMover").modal("hide");
}

function moverCartao(idLista, idCartao) {
    let url = endereco + "/api/trello/cards/changelist";

    let xhttp = new XMLHttpRequest();
    xhttp.open("PATCH", url);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            recuperarListas(idQuadro);
        }
    }

    let objetoMoverCard = {
        token: token,
        card_id: idCartao,
        list_id: idLista
    }

    let json = JSON.stringify(objetoMoverCard);

    xhttp.send(json);
}

// ----------------------------------- Funções do modal de opções -------------------------------------

// Preparar modal com opções do cartão (chamada feita no metodo de exibir cartões -> no botão usado para abrir o modal)

function prepararModalCard(idCartao) {
    recuperarCardEspecifico(idCartao);
    recuperarComentarios(idCartao);
    pegarTagsServidor(idCartao);

    let textoData = `
    <form class="form-inline">
        Prazo:
        <input id="valorData" class="form-control" onchange="alterarData(${idCartao})" style="width: 60%; margin-left: 3%;" type="date" name="bday">
    </form>
    `

    let textoAcoes = `
    <div class="dropdown d-flex justify-content-center" style="margin-bottom: 10%;">
        <button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown">Ações<span class="caret"></span></button> 
        <ul class="dropdown-menu">  
        <li class="d-flex justify-content-center" id="deletarCard" style="margin-top: 5%; margin-bottom: 10%; cursor: pointer;" >
            <p class="acoesModalCartao" onclick="deletarCard(${idCartao})">
                <i class="fa fa-trash-o" title="Deletar cartao"></i>
                remover
            <p>
        </li>
        <li class="d-flex justify-content-center" id="renomearCard" style="margin-top: 2%; margin-bottom: 2%; cursor: pointer;">
           <p class="acoesModalCartao" onclick="passarIdRenomearCard(${idCartao})">
                <i class="fa fa-edit" title="Renomear cartao"></i>
                renomear
            </p>
        </li>
        </ul>
    </div>


    <div id="grupoTags" class="btn-group-sm d-flex justify-content-center">
        <button type="button" class="btn btn-small dropdown-toggle" data-toggle="dropdown">
            Tags
        </button>
                            
        <div id="opcoesTags" class="dropdown-menu"></div>
    </div>
    `;

    let textoFormComentarios = `<div style="/*border: 1px solid orange;*/">
    <form id="formComentariosCard">
        <textarea id="inputComentarios" class="form-control" rows="3" id="comment" name="text" placeholder="Escrever um comentário..."></textarea>
        <input class="btn btn-outline-success btn-sm" style="margin-top: 2%;" type="submit" value="Adicionar" onclick="comentarCartao(${idCartao})" />
    </form>
</div>`

    textoOpcoesTags = "";

    /* tags.forEach(function(tag) {
         textoOpcoesTags += `
             <div style="background-color: ${tag.color}; height: 20px;"></div>
         `
     });*/

    document.getElementById("formComentariosBody").innerHTML = textoFormComentarios;
    document.getElementById("menuCard").innerHTML = textoAcoes;
    document.getElementById("data").innerHTML = textoData;

    $("#modalCard").modal("show");

}

function recuperarCardEspecifico(idCartao) {
    //alert("teste");
    let texto = "";
    let url = endereco + "/api/trello/cards/" + token + "/" + idCartao;
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let objeto = JSON.parse(this.response);
            console.log(objeto);
            texto += `
            Opcões do cartão: <span style="text-decoration: underline">${objeto.name}</span>
            `
            document.getElementById("tituloCartao").innerHTML = texto;
        }
    }

    xhttp.send();
}

function deletarCard(idCartao) {
    let url = endereco + "/api/trello/cards/delete"

    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", url);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            $("#modalCard").modal("hide");
            recuperarListas(idQuadro);
        }
    }

    let objetoCartao = {
        card_id: idCartao,
        token: token
    }

    let json = JSON.stringify(objetoCartao);

    if (confirm("Você realmente deseja excluir esse cartão?")) {
        xhttp.send(json);
    }

}

function mudarNomeCartao (nomeCartao) {
    //alert(nomeCartao);
    document.getElementById("tituloRenomearCartao").innerHTML = "Renomear: "+nomeCartao;
    document.getElementById("inputRenomearCard").setAttribute("placeholder", nomeCartao);
}

var idRenomearCartao;

function passarIdRenomearCard(idCartao) {
    $("#modalCard").modal("hide");
    $("#modalRenomearCard").modal("show");
    idRenomearCartao = idCartao;
    renomearCard(idCartao);
}

function renomearCard(idCartao) {
    
    formRenomearCard = document.getElementById("formRenomearCard");

    formRenomearCard.addEventListener("submit", function (e) {
        e.preventDefault();

        $("#modalRenomearCard").modal("hide");
        $("#modalCard").modal("hide");

        let urlRenomearCard = endereco + "/api/trello/cards/rename"

        let xhttpRenomearCard = new XMLHttpRequest();
        xhttpRenomearCard.open("PATCH", urlRenomearCard);
        xhttpRenomearCard.setRequestHeader('Content-Type', 'application/json');

        xhttpRenomearCard.onreadystatechange = function () {
            formRenomearCard.reset();
            recuperarListas(idQuadro);
        }

        let objetoCartao = {
            token: token,
            card_id: idRenomearCartao,
            name: document.getElementById("inputRenomearCard").value
        }

        let json = JSON.stringify(objetoCartao);

        xhttpRenomearCard.send(json);

    } ,{once: true});

}

function pegarTagsServidor(idCartao) {
    let texto = "";
    let urlTags = endereco + "/api/trello/tags";
    let xhttpTags = new XMLHttpRequest();

    xhttpTags.open("GET", urlTags);
    xhttpTags.setRequestHeader('Content-Type', 'application/json');

    xhttpTags.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let object = JSON.parse(this.responseText);
            console.log(object);

            object.forEach(function (tag) {
                texto += `
                <div class="dropTags" onclick="adicionarTags(${idCartao}, ${tag.id})" style="background-color: ${tag.color}; height: 20px; width: 70%; margin-left: 15%;"></div>
                `
            });

            document.getElementById("opcoesTags").innerHTML = texto;

        }
    }

    xhttpTags.send();
}

// Adicionar tags ao cartão (chamado pelo metodo 'pegarTagsServidor()' -> por um dos botões que representam as tags disponibilizadas pelo servidor)

function adicionarTags(idCartao, idTag) {
    let urlAdicionarTags = endereco + "/api/trello/cards/addtag";
    let xhttpTags = new XMLHttpRequest();

    xhttpTags.open("POST", urlAdicionarTags);
    xhttpTags.setRequestHeader('Content-Type', 'application/json');

    xhttpTags.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            recuperarListas(idQuadro);
        } else if (this.readyState == 4 && this.status == 400) {
            document.getElementById("erroTag").style.display = "block";
            fecharErroTagTempo();
        }
    }

    let objetoTag = {
        card_id: idCartao,
        tag_id: idTag,
        token: token
    }

    let json = JSON.stringify(objetoTag);
    xhttpTags.send(json);
}

// Recuperar tags adicionadas ao cartão (chamado pela função de exibir os cartões)

function recuperarTags(idCartao) {
    let url = endereco + "/api/trello/cards/" + token + "/" + idCartao + "/tags";
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url);
    //alert(url);
    //console.log(url);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let objetoTag = JSON.parse(this.response);
            //console.log(objetoTag);
            exibirTags(idCartao, objetoTag);
        }
    }

    xhttp.send();

}

function exibirTags(idCartao, todasTags) {
    texto = "";
    //alert("entrou");
    todasTags.forEach(function (tagAtual) {
        texto += `
        <span class="etiqueta" style="background-color: ${tagAtual.color}; width: 15%; height: 15px; border-radius: 2px;"></span>
        `
    });

    document.getElementById("localTags" + idCartao).innerHTML = texto;
}

// Adicionar comentário

function comentarCartao(idCartao) {
    var formComentariosCard = document.getElementById("formComentariosCard");
    formComentariosCard.addEventListener("submit", function (submit) {
        submit.preventDefault();
        let urlComentarios = endereco + "/api/trello/cards/addcomment";
        let xhttpComentarios = new XMLHttpRequest();
        xhttpComentarios.open("POST", urlComentarios);
        xhttpComentarios.setRequestHeader('Content-Type', 'application/json');

        xhttpComentarios.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //console.log(this.response);
                formComentariosCard.reset();
                recuperarComentarios(idCartao);
            }
        }

        let objetoCartao = {
            card_id: idCartao,
            comment: document.getElementById("inputComentarios").value,
            token: token
        }

        formComentariosCard.reset();

        let json = JSON.stringify(objetoCartao);

        xhttpComentarios.send(json);

    }, {"once":true})
}

// Recuperar comentários criados (chamado quando o modal é aberto, e quando um novo comentário é adicionado)

function recuperarComentarios(idCartao) {
    let urlComentariosCriados = endereco + "/api/trello/cards/" + token + "/" + idCartao + "/comments";
    //alert(urlComentariosCriados);
    let xhttpComentariosCriados = new XMLHttpRequest();
    xhttpComentariosCriados.open("GET", urlComentariosCriados);
    xhttpComentariosCriados.setRequestHeader('Content-Type', 'application/json');

    xhttpComentariosCriados.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.response);
            exibirComentarios(JSON.parse(this.response));
        }
    }

    let objetoCartao = {
        card_id: idCartao,
        token: token
    }

    let json = JSON.stringify(objetoCartao);

    xhttpComentariosCriados.send(json);
}


function exibirComentarios(todosComentarios) {
    console.log(todosComentarios);
    texto = "";
    todosComentarios.forEach(function (comentarioAtual) {
        console.log(comentarioAtual.updatedAt);
        ano = comentarioAtual.updatedAt.substring(0, 4);
        mes = comentarioAtual.updatedAt.substring(5,7);
        dia = comentarioAtual.updatedAt.substring(8, 10);
        //console.log(comentarioAtual.updatedAt);
        hora = Number(comentarioAtual.updatedAt.substring(11, 13)) +21;
        if (hora > 24) {
            hora = 24 - hora;
            hora = hora * -1;
        } 

        if (hora < 10) {
            hora = "0"+hora;
        }
        min = Number(comentarioAtual.updatedAt.substring(14, 16));
        seg = Number(comentarioAtual.updatedAt.substring(17, 19));
        dataConvertida = dia+"/"+mes+"/"+ano+" - "+hora+":"+min+":"+seg;
        console.log(dataConvertida);
        texto += `
        <div>
        
            <span>${dataConvertida}</span>
                <p style="margin-top: 2%;"> 
                    ${window.sessionStorage.getItem("nomeUsuario") + ": "}
                    ${comentarioAtual.comment}
                </p>
            <div style="width: 100%; border: 0.5px solid lightgray; margin-bottom: 2%;"></div>
        </div>
        `
    })

    document.getElementById("comentariosCardBody").innerHTML = texto;
}


function alterarData(idCartao) {
    let url = endereco + "/api/trello/cards/newdata";
    let xhttp = new XMLHttpRequest();

    xhttp.open("PATCH", url);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status) {
            console.log(this.response);
        }
    }

    //alert(document.getElementById("valorData").value);

    let objeto = {
        token: token,
        card_id: idCartao,
        data: document.getElementById("valorData").value
    }

    let json = JSON.stringify(objeto);

    xhttp.send(json);
}

function fecharErroTagTempo() {
    setTimeout(function(){ document.getElementById("erroTag").style.display = "none"; }, 5000);
}

function fecharErroTag () {
    document.getElementById("fecharErroTag").addEventListener("click", function() {
        //alert("teste");
        document.getElementById("erroTag").style.display = "none";
    })
}

fecharErroTag();

