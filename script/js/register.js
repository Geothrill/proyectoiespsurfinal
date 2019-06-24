//formulario de registro
var formulario = document.getElementById('formulario');
//texto que aparecerá en caso de que el login sea fallido
var respuesta = document.getElementById('respuesta');

//función para logarse en la web
formulario.addEventListener('submit', function(e){
    //no permitiremos el submit hasta haber corroborado que el usuario existe
    e.preventDefault();

    //campos del formulario
    var nombre = document.getElementById('nombre').value;
    var apellidos = document.getElementById('apellidos').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var Rpassword = document.getElementById('Rpassword').value;
    //acceso al endpoint
    var url = new URL('http://3.82.8.247:8090/usuarios/create');



    //verificamos que la contraseña introducida es la misma
    if (password != Rpassword) {
      respuesta.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Las contraseñas introducidas no coinciden.
                </div>
                `;
    }
    //verificamos que la longitud es de 8 o más caracteres
   else if (password.length < 8){
 respuesta.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Introduzca una contraseña de 8 o más caracteres.
                </div>
                `;
    }
     //si todo esta ok, procesamos el registro
    else{
    //añadimos los parámetros de la URL
    url.searchParams.append('nombre',nombre);
    url.searchParams.append('apellidos',apellidos);
    url.searchParams.append('email',email);
    url.searchParams.append('password',password);

    //enviamos los datos mediante GET
    fetch(url,{ headers: {
         'Content-Type': 'text/plain',
          }
            })
    //recibimos la respuesta, en este caso nos interesa el cuerpo del mensaje
    .then(function(body){
      return body.text();
    })
    //revisaremos los datos que han llegado para corroborar si ese mail esta en uso
    .then( function(data){
         //si la cabecera viene vacía, ya existe un usuario con el mismo mail
  if (data === "") {
      respuesta.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Ya existe un usuario registrado con el mismo email, use otro email.
                </div>
                ` ;
    
  } 
//en caso contrario el usuario no existirá y se registrará, para luego poder hacer login correctamente
  else {
     window.location.assign("login.html");
    }
  })
}
})

