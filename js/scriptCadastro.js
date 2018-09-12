
var url = "http://www.henriquesantos.pro.br:8080/api/trello/users/new";
var formulario = document.querySelector("#formulario");
var campoUsuario = document.querySelector("#username");
var mensagemErro = document.querySelector("#mensagemErro");
var botaoLimpar = document.querySelector("#botaoLimpar");
var sucesso = document.getElementById("sucesso");

sucesso.style.display = 'none';
mensagemErro.style.display = 'none';

formulario.addEventListener("submit", function (submit) {
    submit.preventDefault();
    var formData = new FormData(formulario);
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            formulario.reset();
            campoUsuario.style.backgroundColor = 'white';
            mensagemErro.style.display = 'none';
            sucesso.style.display = 'block';
            fecharSucesso();
        }

        else if (this.status == 400) {
            campoUsuario.style.backgroundColor = 'tomato';
            mensagemErro.style.display = 'inline';
            sucesso.style.display = 'none';
        }
    }

    /*for (var value of formData.keys()) {
        console.log(value);
    }

    console.log(formData.values().name);*/

    var object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
        console.log(key);
        console.log(value);
    });

    console.log(object);


    var json = JSON.stringify(object);

    //console.log(json);

    xhttp.send(json);


});

botaoLimpar.addEventListener("click", function () {
    sucesso.style.display = 'none';
    mensagemErro.style.display = 'none';
    campoUsuario.style.backgroundColor = 'white';
})

function fecharSucesso() {
    setTimeout(function(){ document.getElementById("sucesso").style.display = "none"; }, 5000);
}