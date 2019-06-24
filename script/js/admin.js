//función que comprueba si los datos incluidos en la sesión son correctos, sirve para hacer login en el aplicativo
// como un administrador, de ser correctos comienza a realizar las operaciones necesarias para la web de administrador
 $(function() {
     if( sessionStorage.getItem('email') == null ) {
      window.location.assign('../index.html');
      }
      else if(sessionStorage.getItem('tipoUsuario') != 'A'){
      window.location.assign('../index.html');
      }
      else {
      //si el usuario logado es el correcto, procedemos a "pintar" resultados
     $(document).ready(function() {
      //recogemos los elementos donde mostraremos los datos
      var usuarios = document.getElementById('usuarios');      
      var habitaciones = document.getElementById('habitaciones');

      //recogemos las url donde buscaremos la información
     var urlUsuario = new URL('http://3.82.8.247:8090/usuarios/list');
     var urlhabitaciones = new URL('http://3.82.8.247:8090/habitaciones/list');
     //en el caso de los usuarios, mostraremos solo aquellos que sean usuarios tipo usuario, y no administradores
     urlUsuario.searchParams.append('tipoUsuario', 'U');
     //realizamos la petición de búsqueda de usuarios, por cada valor añadiremos una nueva fila a la tabla y las acciones que se pueden realizar sobre ellos
     $.get(urlUsuario, function(data){
   $.each(data, function(idx, obj) {
    
    usuarios.innerHTML += `
  <tr>
      <td>`+ obj.nombre + `</td>
      <td>` +obj.apellidos+`</td>
      <td>`+obj.email+`</td>
      <td>
      <button type="button" class="btn btn-primary usuario" data-toggle="modal" data-target="#exampleModal" id="` + obj.idUsuario + `">Eliminar</button>
<button type="button" class="btn btn-primary usuario" data-toggle="modal" data-target="#exampleModal" id="` + obj.idUsuario + `">Modificar</button>
      </td>
    </tr>
    `;

   });
      usuarios.innerHTML += `
<tr>
       <button type='button' class="btn btn-primary usuario" data-toggle="modal" data-target="#exampleModal" id="Crear">Crear nuevo usuario</button>
      </tr>
      `;
     });
//realizamos la petición de búsqueda de habitaciones, por cada valor añadiremos una nueva fila a la tabla y las acciones que se pueden realizar sobre ellos
     $.get(urlhabitaciones, function(data){
   $.each(data, function(idx, obj) {

    habitaciones.innerHTML += `
<tr>
      <td>`+ obj.numHabitacion + `</th>
      <td>` +obj.tipo+`</td>
      <td>`+obj.precio+`</td>
      <td>`+obj.ocupantes+`</td>
      <td>
     <button type="button" class="btn btn-primary habitacion" data-toggle="modal" data-target="#exampleModal" id="` + obj.idHabitaciones + `">Eliminar</button>
<button type="button" class="btn btn-primary habitacion" data-toggle="modal" data-target="#exampleModal" id="` + obj.idHabitaciones + `">Modificar</button>
      </td>
    </tr>
    `;

   });
    habitaciones.innerHTML += `
<tr>
       <button type='button' class="btn btn-primary habitacion" data-toggle="modal" data-target="#exampleModal" id="Crear">Crear nueva habitación</button>
      </tr>
      `;
     });
});
   }
   //modal que aparece cuando se presiona un botón, variará en función del botón pulsado
     $('#exampleModal').on('shown.bs.modal', function (event) {
      //recuperamos la información del botón pulsado
  var button = $(event.relatedTarget); 
  //si el botón del texto es de eliminar
  if (button.text() === "Eliminar") {
    //cambiamos el texto del encabezado del modal
 $('.modal-title').text('Eliminar');
  body.innerHTML = `<h6> ¿Esta usted seguro de que desea realizar la operación seleccionada? Esta acción es irreversible. </h6>`;
    //en función de la clase incluida en el botón, eliminará una habitación o un usuario, en este caso una habitación
    if (button.hasClass("habitacion")) {
       //una vez pulsamos el botón, realizamos la acción deseada
    $('#enviar').click( function(e){
      var urlEliminarHabitacion = new URL('http://3.82.8.247:8090/habitaciones/delete');
      //añadimos el id de la habitación a eliminar que se recoje dentro del botón
    urlEliminarHabitacion.searchParams.set('idHabitaciones', button.attr('id'));

    $.get(urlEliminarHabitacion, function (data) {
     //recargamos la página
     window.location.assign("admin.html");
    });
  });


    }
    //en este caso elimina un usuario
    else {
       $('#enviar').click( function(e){
      var urlEliminarUsuario = new URL('http://3.82.8.247:8090/usuarios/delete');

    urlEliminarUsuario.searchParams.set('idUsuario', button.attr('id'));

    $.get(urlEliminarUsuario, function (data) {
     
     window.location.assign("admin.html");
    });
  });

    }


  }
  //si el texto del botón es de modificar, realizaremos la modificación
  else if (button.text() === "Modificar"){
    $('.modal-title').text('Modificar');
    //en función de la clase incluida en el botón, modificará una habitación o un usuario, en este caso una habitación
    if (button.hasClass('habitacion')) {
      //url que nos dará la información de la habitación que deseamos modificar
      var urlHabitacion = new URL('http://3.82.8.247:8090/habitaciones/habitacion');
      //añadimos el id del botón, que es el id de la habitación a modificar
      urlHabitacion.searchParams.set('idHabitaciones', button.attr('id'));
      $.get(urlHabitacion, function(data){
        //pintamos los datos dentro de un formulario y recuperamos los valores originales de la habitación, para que el administrador pueda modificar 1 o más campos
        //sin tener que recordar todos los datos introducidos
         body.innerHTML = `<h6> Introduzca los datos a modificar en los campos que se listan a continuación: </h6>
 <table class="table ">
             <thead>
              <tr>
                <th scope="col">Número </th>
                <th scope="col">Tipo</th>
                <th scope="col">Precio al día</th>
                <th scope="col">Nº ocupantes</th>
              </tr>
            </thead>
            <tbody>
<td><input type="number" name="numHabitacion" placeholder="Número de habitación" value="`+ data.numHabitacion + `"   class="single-input" id="numHabitacion" required></td>
<td><input type="text" name="tipo" placeholder="Tipo de habitación" value="`+ data.tipo + `"   class="single-input" id="tipo" required></td>
<td><input type="number" name="precio" placeholder="Precio al día" value="`+ data.precio + `"   class="single-input" id="precio" required></td>
<td><input type="number" name="ocupantes" placeholder="Ocupantes de la habitación" value="`+ data.ocupantes + `"   class="single-input" id="ocupantes" required></td>
         </tbody>
          </table>
   
    `;


    $('#enviar').click( function(e){
      //url para modificar la habitación
      var urlModificarHabitacion = new URL('http://3.82.8.247:8090/habitaciones/modificar');
      //incluimos los datos necesarios en la habitación
    urlModificarHabitacion.searchParams.set('tipo', $('#tipo').val());
    urlModificarHabitacion.searchParams.set('numHabitacion', $('#numHabitacion').val());
    urlModificarHabitacion.searchParams.set('precio', $('#precio').val());
    urlModificarHabitacion.searchParams.set('ocupantes', $('#ocupantes').val());
    urlModificarHabitacion.searchParams.set('idHabitaciones', button.attr('id'));



    $.get(urlModificarHabitacion, function (data) {
     //recargamos la página una vez se han realizado los datos
     window.location.assign("admin.html");
    });
  });

    });
       }
       //mismo caso para un usuario
    else {
      var urlUsuario = new URL('http://3.82.8.247:8090/usuarios/usuario');
      urlUsuario.searchParams.set('idUsuario', button.attr('id'));
      $.get(urlUsuario, function(data){
         body.innerHTML = `<h6> Introduzca los datos a modificar en los campos que se listan a continuación: </h6>
 <table class="table ">
             <thead>
              <tr>
                <th scope="col">Nombre </th>
                <th scope="col">Apellidos</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
<td><input type="text" name="nombre" placeholder="Nombre" value="`+ data.nombre + `"   class="single-input" id="nombre" required></td>
<td><input type="text" name="apellidos" placeholder="Apellidos" value="`+ data.apellidos + `"   class="single-input" id="apellidos" required></td>
<td><input type="text" name="email" placeholder="Email" value="`+ data.email + `"   class="single-input" id="email" required></td>
         </tbody>
          </table>
   
    `;


    $('#enviar').click( function(e){
      var urlModificarHabitacion = new URL('http://3.82.8.247:8090/usuarios/modificar');

    urlModificarHabitacion.searchParams.set('nombre', $('#nombre').val());
    urlModificarHabitacion.searchParams.set('apellidos', $('#apellidos').val());
    urlModificarHabitacion.searchParams.set('email', $('#email').val());
    urlModificarHabitacion.searchParams.set('idUsuario', button.attr('id'));



    $.get(urlModificarHabitacion, function (data) {
     
     window.location.assign("admin.html");
    });
  });

    });

    }

   }

 //si ninguno de los anteriores casos es afirmativo, entonces mostramos el mismo modal para crear
  else{
     $('.modal-title').text('Crear');
   //en función de la clase que incluya, se realiza para una habitación o un usuario, en este caso una habitación
    if (button.hasClass('habitacion')) {
      //rellenamos el cuerpo del modal, cada input será recogido posteriormente según el valor que tenga
         body.innerHTML = `<h6> Introduzca los datos a modificar en los campos que se listan a continuación: </h6>
 <table class="table ">
             <thead>
              <tr>
                <th scope="col">Número de habitación </th>
                <th scope="col">Tipo de habitación</th>
                <th scope="col">Precio al día</th>
                <th scope="col">Ocupantes de la habitación</th>
              </tr>
            </thead>
            <tbody>
<td><input type="number" name="numHabitacion" placeholder="Número de habitación" class="single-input" id="numHabitacion" required></td>
<td><input type="text" name="tipo" placeholder="Tipo de habitación"  class="single-input" id="tipo" required></td>
<td><input type="number" name="precio" placeholder="Precio al día" class="single-input" id="precio" required></td>
<td><input type="number" name="ocupantes" placeholder="Ocupantes de la habitación" class="single-input" id="ocupantes" required></td>
         </tbody>
          </table>
   
    `;


    $('#enviar').click( function(e){
      //url con la que creamos la habitación
     var urlHabitacion = new URL('http://3.82.8.247:8090/habitaciones/create');
     //incluimos los datos para crear la habitación
    urlHabitacion.searchParams.set('numHabitacion', $('#numHabitacion').val());
    urlHabitacion.searchParams.set('tipo', $('#tipo').val());
    urlHabitacion.searchParams.set('precio', $('#precio').val());
urlHabitacion.searchParams.set('ocupantes', $('#ocupantes').val());


    $.get(urlHabitacion, function (data) {
     //recargamos la página
     window.location.assign("admin.html");
    });
  });
       
    

    }
    //en este caso para crear el usuario
    else {

         body.innerHTML = `<h6> Introduzca los datos a modificar en los campos que se listan a continuación: </h6>
 <table class="table ">
             <thead>
              <tr>
                <th scope="col">Nombre </th>
                <th scope="col">Apellidos</th>
                <th scope="col">Email</th>
                <th scope="col">Contraseña</th>
              </tr>
            </thead>
            <tbody>
<td><input type="text" name="nombre" placeholder="Nombre" class="single-input" id="nombre" required></td>
<td><input type="text" name="apellidos" placeholder="Apellidos" class="single-input" id="apellidos" required></td>
<td><input type="text" name="email" placeholder="Email" class="single-input" id="email" required></td>
<td><input type="text" name="password" placeholder="Contraseña" class="single-input" id="password" required></td>
         </tbody>
          </table>
   
    `;


    $('#enviar').click( function(e){
     var urlUsuario = new URL('http://3.82.8.247:8090/usuarios/create');

    urlUsuario.searchParams.set('nombre', $('#nombre').val());
    urlUsuario.searchParams.set('apellidos', $('#apellidos').val());
    urlUsuario.searchParams.set('email', $('#email').val());
urlUsuario.searchParams.set('password', $('#password').val());


    $.get(urlUsuario, function (data) {
     
     window.location.assign("admin.html");
    });
  });


    }

  }
      });
 });

