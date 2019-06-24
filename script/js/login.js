$(document).ready(function () {
 //formulario de login
var formulario = document.getElementById('formulario');
//texto que aparecerá en caso de que el login sea fallido
var respuesta = document.getElementById('respuesta');

//función para logarse en la web

    //no permitiremos el submit hasta haber corroborado que el usuario existe

    //campos del formulario
   
    //acceso al endpoint
    var url = new URL('http://3.82.8.247:8090/usuarios/login');


formulario.addEventListener('submit', function(e){ 
  e.preventDefault();
 var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
   //añadimos los parámetros de la URL
    url.searchParams.append('email', email);
    url.searchParams.append('password', password);

    //enviamos los datos mediante GET
    $.get(url, function(data){
      //en caso de no existir devolvera longitud 0
      if (Object.keys(data).length === 0) {
         respuesta.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Los datos introducidos no son correctos.
                </div>
                ` ;
      }
      else{
        //guardamos su email y el tipo de usuario para que pueda acceder a las paginas del aplicativo que le correspondan
        //segun el rol que tenga asignado
         sessionStorage.setItem("email", data.email);
         sessionStorage.setItem("tipoUsuario", data.tipoUsuario);

         if (sessionStorage.getItem("tipoUsuario") === 'A') {
//redirigimos al usuario a la pagina principal del aplicativo de usuario
       window.location.assign("src/admin.html");
    
         }
         else{
    //redirigimos al usuario a la pagina principal del aplicativo de usuario
       window.location.assign("src/principal.html");
            
         }
    }
    });

 
});
});

