// css diego linear-gradient(141deg, #0f38ad 0%, #1f41db 51%, #2c58e8 75%)
var url = "http://www.henriquesantos.pro.br:8080/api/trello/login";
        var formulario = document.querySelector("#formulario");
        var erro = false;

        formulario.addEventListener("submit", function(submit) {
            submit.preventDefault();
                var formData = new FormData(formulario);
                var xhttp = new XMLHttpRequest();   

                xhttp.open("POST", url, true);
                xhttp.setRequestHeader('Content-Type', 'application/json');

                xhttp.onreadystatechange = function() {
                    if (this.readyState==4 && this.status==200) {
                        console.log(this.response);
                        let objeto = JSON.parse(this.response);
                        window.sessionStorage.setItem('token', objeto.token);
                        window.open("index.html", "_self");
                       // console.log(objeto.token);
                    }

                    else if (this.status==400 && this.readyState==4) {
                        var object = JSON.parse(this.responseText);
                        //alert(object.errors[0].message);
                        alert("Nome de usuário ou senha incorreto(s)")
                        formulario.reset();
                    }
                }
                
                var object = {};    
                formData.forEach(function(value, key){
                    object[key] = value;
                });
                    
                var json = JSON.stringify(object);

                //console.log(json);

                
                xhttp.send(json);

                                   

        });