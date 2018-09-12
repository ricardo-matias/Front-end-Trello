// --------------------------------- Funcionalidades dos quadros ---------------------------------
// OBS: na linha 17 se trocar de var para let continua funcionando o resto do código lá embaixo

// Criar quadro (chamado pelo botão de criar quadros)
var idBoard;

function criarQuadro() {

    /* var novoQuadro = document.querySelector("#quadro0");
 
     novoQuadro.addEventListener("click", function () {
         $('#myModal').modal('show');
         formModalCores.style.display = "inline";
         confirmarCor.style.display = "none";
     })*/

    var formModalCores = document.getElementById("formModalCores");

    $('#myModal').modal('show');
    formModalCores.style.display = "inline";
    confirmarCor.style.display = "none";

    let formQuadro = document.querySelector("#formQuadro");

    formQuadro.addEventListener("submit", function (submit) {
        submit.preventDefault();

        let objetoQuadro = {
            name: document.getElementById("nomeQuadro").value,
            color: cor,
            token: token
        };

        formQuadro.reset();
        $("#myModal").modal("hide");

        let urlBoard = endereco + "/api/trello/boards/new";
        let xhttpBoard = new XMLHttpRequest();

        xhttpBoard.open("POST", urlBoard);
        xhttpBoard.setRequestHeader('Content-Type', 'application/json');

        xhttpBoard.onreadystatechange = function () {
            // location.reload();
            if (this.readyState == 4 && this.status == 200) {
                objetoQuadro = null;
                //alert("teste");
                console.log("resposta criação board: " + this.response);
                recuperarQuadrosCriados();
                //location.reload();
            }
        }

        let jsonBoard = JSON.stringify(objetoQuadro);
        console.log(jsonBoard);
        xhttpBoard.send(jsonBoard);

    }, {"once": true});

}


// Recuperar quadros criados;

function recuperarQuadrosCriados() {

    let urlQuadrosCriados = endereco + "/api/trello/boards/" + token;
    //console.log(urlQuadrosCriados);
    let todosQuadros;

    let xhttpCriados = new XMLHttpRequest();
    xhttpCriados.open("GET", urlQuadrosCriados);
    xhttpCriados.setRequestHeader('Content-Type', 'application/json');

    xhttpCriados.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("recuperando todos os quadros...");
            todosQuadros = JSON.parse(this.response);
            console.log(todosQuadros);

            let texto = exibirQuadros(todosQuadros);

            document.getElementById("grupoQuadros").innerHTML = texto;

            //criarQuadro();
        }
    }

    xhttpCriados.send();

}

// Exibir quadros criados;

function exibirQuadros(todosQuadros) {

    let texto = "";

    todosQuadros.forEach(function (quadroAtual) {
        //console.log(value);
        texto += `
        <div class="col-6 col-sm-4 col-md3 col-lg-3" style="padding: 1%;">    
            <div class="card" style="background-color: ${quadroAtual.color} !important;">
                <div onclick="entrarBoard(${quadroAtual.id});" id='${quadroAtual.id}' class="card-body text-center" style="cursor: pointer;">
                    <p class="card-text">${quadroAtual.name}</p>
                </div>
            
                <div class="card-footer d-flex justify-content-end">
                    <i class="repintar fa fa-paint-brush" onclick="repintar(${quadroAtual.id})" title="Trocar a cor do quadro"></i>
                    <i class="renomear fa fa-edit" onclick="passarIdRenomearQuadro
                        (${quadroAtual.id}), mudarNomeQuadro('${quadroAtual.name}');" title="Renomear quadro">
                    </i>
                    <i class="delete fa fa-trash-o" onclick="deletarQuadro(${quadroAtual.id});" title="Deletar quadro"></i> 
                </div>
            </div>
        </div>`;

    });

    texto += `
    <div class="col-6 col-sm-4 col-md3 col-lg-3" style="padding: 1%;">

         <div class="invi card">
            <div class="card-body text-center">
                <p class="card-text">Criar quadro</p>
            </div>

            <div class="card-footer d-flex justify-content-center">
                <i class="fa fa-plus"></i>
            </div>
        </div>

        <button id="quadro0" onclick="criarQuadro()" role="button" style="cursor: pointer" title="Criar um novo quadro">+</button>
    </div>`;

    return texto;
}

// Entrar em um board 

function entrarBoard(idQuadro) {
    window.sessionStorage.setItem("idBoard", idQuadro);
    inicioQuadros.style.display = 'none';
    grupoListas.style.display = 'inline';

    window.sessionStorage.setItem("idQuadro", idQuadro);

    recuperarListas(idQuadro); //metodo implementado abaixo para redenrizar as listras cadastradas
    location.reload(); // por causa da navbar

}

// Recuperar quadro especifico (chamado no arquivo 'listas.js' -> recuperarListas() -> para definir a cor de fundo da lista e colocar o noem do quadro)

function recuperarQuadroEspecifico(idQuadro) {

    let urlQuadrosEspecifico = endereco + "/api/trello/boards/" + token + "/" + idQuadro;

    let xhttpEspecifico = new XMLHttpRequest();
    xhttpEspecifico.open("GET", urlQuadrosEspecifico);
    xhttpEspecifico.setRequestHeader('Content-Type', 'application/json');


    xhttpEspecifico.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let objetoQuadro = JSON.parse(this.response);

            let checkpoint = document.getElementById("checkpoint");
            checkpoint.innerHTML = "Quadro: " + objetoQuadro[0].name;

            let checkpointCell = document.getElementById("checkpointCell");
            checkpointCell.innerHTML = "Quadro: " + objetoQuadro[0].name;

            if (objetoQuadro[0].color == "white") {
                checkpoint.style.color = "black";
                checkpointCell.style.color = "black";
            } else {
                checkpoint.style.color = "white";
                checkpointCell.style.color = "white";
            }

            //document.getElementById("dentroQuadro").style.backgroundColor = objetoQuadro[0].color;
            document.getElementById("bodyPagina").style.background = objetoQuadro[0].color;
        }
    }

    xhttpEspecifico.send();

}

// Deletando um quadro

function deletarQuadro(idQuadro) {

    console.log("Mostrando id: " + idQuadro);
    let urlDelete = endereco + "/api/trello/boards/delete";
    let objetoQuadro = {
        board_id: idQuadro,
        token: token
    }
    let json = JSON.stringify(objetoQuadro);
    console.log(json);

    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", urlDelete);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("resposta delete: " + this.response);
            recuperarQuadrosCriados();
        }
    }

    if (confirm("Você realmente deseja excluir esse quadro?")) {
        xhttp.send(json);
    }
}

// --------------------------------------------------------------------------------------

// Renomeando um quadro

function mudarNomeQuadro (nomeQuadro) {
    document.getElementById("tituloRenomearQuadro").innerHTML = "Renomear: "+nomeQuadro;
    document.getElementById("inputRenomear").setAttribute("placeholder", nomeQuadro);
}

var idRenomearQuadro;

function passarIdRenomearQuadro(idQuadro) {
    //sessionStorage.removeItem("nomeQuadro");
    $("#modalRenomear").modal("show");
    idRenomearQuadro = idQuadro;
    renomearQuadro(idQuadro);
}

function renomearQuadro(idQuadro) {

    let formRenomearQuadro = document.querySelector("#formRenomearQuadro");
    formRenomearQuadro.addEventListener("submit", function (submit) {
        //alert("teste");
        submit.preventDefault();
        $("#modalRenomear").modal("hide");
        urlRenomear = endereco + "/api/trello/boards/rename";

        //console.log($("#inputRenomear").val());

        let objetoQuadro = {
            board_id: idRenomearQuadro,
            name: document.getElementById("inputRenomear").value,
            token: token
        }

        console.log("Renomeando quadro id: " + objetoQuadro.id);

        let json = JSON.stringify(objetoQuadro);

        let xhttp = new XMLHttpRequest();
        xhttp.open("PATCH", urlRenomear);

        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("resposta renomear: " + this.response);
                formRenomearQuadro.reset();
                recuperarQuadrosCriados();
            }

            else if (this.readyState == 4 && this.status == 400) {
                let objetoQuadro = JSON.parse(this.responseText);
                console.log(idQuadro);
                alert(objetoQuadro.errors[0].message);
            }
        }

        console.log(json);

        xhttp.send(json);

    }, {"once":true});

}

pegarCorEscolhida();

function pegarCorEscolhida() {

    cor = "white";

    document.getElementById("fundoAzul").addEventListener("click", function () {
        cor = "#17a2b8";
        modalCores.style.backgroundColor = "#17a2b8";
    });

    document.getElementById("fundoBranco").addEventListener("click", function () {
        cor = "white";
        modalCores.style.backgroundColor = "white";
    });

    document.getElementById("fundoVermelho").addEventListener("click", function () {
        cor = "#dc3545";
        modalCores.style.backgroundColor = "#dc3545";
    });

    document.getElementById("fundoAmarelo").addEventListener("click", function () {
        cor = "#ffc107";
        modalCores.style.backgroundColor = "#ffc107";
    });

    document.getElementById("fundoVerde").addEventListener("click", function () {
        cor = "#28a745";
        modalCores.style.backgroundColor = "#28a745";
        //alert(cor);
    });

}

function repintar(idQuadro) {
    $("#myModal").modal("show");
    formModalCores.style.display = "none";
    confirmarCor.style.display = "block";

    document.getElementById("botaoCor").addEventListener("click", function () {
        console.log("--------PintandoQuadro---------")

        let url = endereco + "/api/trello/boards/newcolor";

        let xhttp = new XMLHttpRequest();

        xhttp.open("PATCH", url);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        console.log(url);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("------RespostaServidor-------")
                console.log(this.response);
                recuperarQuadrosCriados();
                //location.reload();
            }
        }

        let objetoQuadro = {
            board_id: idQuadro,
            color: cor,
            token: token
        }

        let json = JSON.stringify(objetoQuadro);
        console.log("-----JSON enviado-----")
        console.log(json);
        xhttp.send(json);
    }, {"once": true});

}

/*$("#modalRenomear").on("hidden.bs.modal", function () {
    //Faz algo quando fechar o modal
    //document.getElementById("modalRenomearLista").reset();
    if (document.getElementById("inputRenomear").value == "") {
      //  location.reload();
    }
});*/