
//funcionalidad recogida en la clase "comprobarUsuario.js"
$(function() {
     if( sessionStorage.getItem('email') == null ) {
      window.location.assign('../index.html');
      }
      else if(sessionStorage.getItem('tipoUsuario') != 'U'){
      window.location.assign('../index.html');
      }
      else {

     $(document).ready(function() {

      //recogemos los datos de los campos necesarios
var datosHabitacion = document.getElementById('datosHabitacion');
var pension = document.getElementById('pension');
var costeReserva = document.getElementById('costeReserva');

//recogemos el valor máximo de reserva compartida hasta la fecha
var urlMaxReservaCompartida = "http://localhost:8090/reservas/max";
$.get("http://localhost:8090/reservas/max", function(data){
//aumentamos en 1 su valor para las nuevas reservas
  var maxReservaCompartida = data +1;
  //dado que se pueden realizar múltiples reservas, damos valor 0 al precio total para evitar que se sumen los valores previos
sessionStorage.setItem('precioTotal', 0);

//comenzamos con el relleno de datos en el modal
$('#exampleModal').on('show.bs.modal', function (event) {
  //recogemos toda la información del botón que ha "invocado" al modal
  var button = $(event.relatedTarget);
  //asignamos el id recogido en el botón y lo añadimos a sessionStorage
  var idHabitaciones = button.attr('id');
   sessionStorage.setItem("idHabitaciones", idHabitaciones);
   //url que selecciona 1 sola habitación, dado que es de "@PathVariable" unicamente le damos el valor de idHabitaciones
   var habitaciones = "http://localhost:8090/habitaciones/" + sessionStorage.getItem('idHabitaciones');
   //url para acceder al listado de las pensiones
   var pensiones = "http://localhost:8090/pensiones/list";
   //parseamos a días la diferencia entre fechas
   var diferenciaFechas = Math.floor((Date.parse(fechaSalida.value)-Date.parse(fechaEntrada.value)) / 86400000);
   //declaramos los campos necesarios a mostrar
   var tipo;
    var numHabitacion;
    var precio;
    var precioTotalHabitacion;
    //realizamos la petición
  $.get(habitaciones, function(data){
    //damos valor a los campos previamente declaramos
     tipo = data.tipo;
     numHabitacion = data.numHabitacion;
     precio = data.precio;
     precioTotalHabitacion = precio * diferenciaFechas;

//pintamos los datos en el modal
      datosHabitacion.innerHTML = `

      <p><h6>Fecha de entrada</h6> `+ fechaEntrada.value +`</p>
      <p><h6>Fecha de salida </h6>`+ fechaSalida.value +`</p>
      <p><h6>Precio por dia </h6>`+ data.precio +`/€ al día</p>
      <p><h6>Precio total de la habitación </h6>`+ data.precio * diferenciaFechas +`€</p>
      `;
  })
  //función que devuelve los datos de todas las pensiones
  $.get(pensiones, function(data){
    //vaciamos el campo de pensiones para que no se acumulen las opciones
    $("#pension").empty('option');
//por cada registro de pension de la BBDD se "pinta" la opción
    $.each(data, function(idx, obj) {
      pension.innerHTML += `<option value="` + obj.precio + `" id="`+ obj.idPension + `" title="`+ obj.descripcion +`">`+ obj.tipo + `</option>" `;
      });
    });
  //cada vez que cambiamos la opción dentro del select, recogemos los datos que nos interesan
  $("#pension").change(function() {
    
  var precioPension = $(this).children(":selected").attr("value");
  var idPension = $(this).children(":selected").attr("id");

//si la pensión no esta guardada, le daremos valor, en caso contrario, eliminaremos el valor previo y asignaremos el nuevo
if (sessionStorage.getItem("idPension") === null) {
sessionStorage.setItem("idPension", idPension);
  }
  else {
sessionStorage.removeItem("idPension");
    sessionStorage.setItem("idPension", idPension);
  }
//calculamos la pensión en función de días, personas y el precio de la pensión
  var precioPensionTotal = precioPension * diferenciaFechas * sessionStorage.getItem('ocupantes');
//rellenamos los valores de los costes de las reservas
   costeReserva.innerHTML = `
  <p>Coste diario de la pensión: ` + precioPension +`€</p>
  <p>Coste total de la pensión: `+ precioPensionTotal +`€</p>
  <p>Total a pagar: `+ (precioPensionTotal + precioTotalHabitacion)  +`€</p>
 `;
 //mostramos los botones una vez se ha seleccionado una pensión
 $('#finReserva').show();
 $('#seguirReserva').show();
});
 
var modal = $(this);
  } );


//función que se activa una vez se decide reservar la última habitacion
$('#finReserva').click( function(e){
e.preventDefault();
//url a la que accedemos para guardar los datos
var reservar = new URL('http://localhost:8090/reservas/add');
//campos a incluir dentro de la url
reservar.searchParams.append('fechaEntrada',sessionStorage.getItem("fechaEntrada"));
    reservar.searchParams.append('fechaSalida',sessionStorage.getItem("fechaSalida"));
    reservar.searchParams.append('fechaReserva', sessionStorage.getItem("fechaReserva"));
    reservar.searchParams.append('ocupantes',sessionStorage.getItem("ocupantes"));
    reservar.searchParams.append('idHabitaciones',sessionStorage.getItem("idHabitaciones"));
    reservar.searchParams.append('idPension',sessionStorage.getItem("idPension"));
    reservar.searchParams.append('email',sessionStorage.getItem("email"));
     reservar.searchParams.append('idReservaCompartida',maxReservaCompartida);

//realizada la reserva, al ser la última, redirige a ver las reservas para corroborar que su reserva es efectiva
$.get(reservar, function(data){
   window.location.assign("verReservas.html");
})


});
//función que se activa cuando deseamos seguir realizando reservas
$('#seguirReserva').click( function(e){
e.preventDefault();
//url a la que accedemos para guardar los datos
var reservar = new URL('http://localhost:8090/reservas/add');
//campos a incluir dentro de la url
reservar.searchParams.append('fechaEntrada',sessionStorage.getItem("fechaEntrada"));
    reservar.searchParams.append('fechaSalida',sessionStorage.getItem("fechaSalida"));
    reservar.searchParams.append('fechaReserva', sessionStorage.getItem("fechaReserva"));
    reservar.searchParams.append('ocupantes',sessionStorage.getItem("ocupantes"));
    reservar.searchParams.append('idHabitaciones',sessionStorage.getItem("idHabitaciones"));
    reservar.searchParams.append('idPension',sessionStorage.getItem("idPension"));
    reservar.searchParams.append('email',sessionStorage.getItem("email"));
    reservar.searchParams.append('idReservaCompartida',maxReservaCompartida);

//realiza la reserva y permite seguir en la página para hacer más reservas
$.get(reservar);


});

//una vez desaparece el modal, deseleccionamos las opciones del select, eliminamos el cálculo final y escondemos los botones
$('#exampleModal').on('hide.bs.modal', function (event) {
 $('#finReserva').hide();
 $('#seguirReserva').hide();
 $("option:selected").prop("selected", false);
 costeReserva.innerHTML=``;

} );
} );
     
      });
 }
   });

