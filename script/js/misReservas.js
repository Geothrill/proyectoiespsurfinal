//función que comprueba si los datos incluidos en la sesión son correctos, sirve para hacer login en el aplicativo
// como un usuario, incluida en comprobarUsuario.js
$(function() {
      if( sessionStorage.getItem('email') == null ) {
      window.location.assign('../index.html');
      }
      else if(sessionStorage.getItem('tipoUsuario') != 'U'){
      window.location.assign('../index.html');
      }
      else {

     $(document).ready(function() {
     	//seleccionamos el modal donde mostraremos los datos en función del botón que se pulse
var body = document.getElementById('body');
//creamos la fecha del día en el que se quieren revisar los datos
var fechaActual = new Date();
var dd = String(fechaActual.getDate()).padStart(2, '0');
var mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
var yyyy = fechaActual.getFullYear();
fechaActual = yyyy + '-' + mm + '-' + dd;
//seleccionamos el campo que recogerá toda la informacion de las reservas
var inputData = document.getElementById('inputData');
//variables necesarias para mostrar datos
var contador = 0;
var listaHabitacionesReservadas;
var precioTotal;
//añadimos la fecha a sessionStorage
sessionStorage.setItem("fecha", fechaActual);
//urls necesarias para mostrar los datos
var urlHabitacionesReserva = new URL('http://3.82.8.247:8090/reservas/totalReservaCompartida');
var urlPrecioTotalReservaCompleta = new URL('http://3.82.8.247:8090/reservas/precioTotal');
var url = new URL('http://3.82.8.247:8090/reservas/usuario');
var urlReserva = new URL('http://3.82.8.247:8090/reservas/delete');
var urlOpiniones = new URL('http://3.82.8.247:8090/valoraciones/new');
var urlEliminar1Reserva = new URL('http://3.82.8.247:8090/reservas/deleteone');
var urlEliminarGrupoReserva = new URL('http://3.82.8.247:8090/reservas/deletegroup');
var urlAddValoracionReserva = new URL('http://3.82.8.247:8090/reservas/addValoracion');

//añadimos el email a las url que lo precisan
url.searchParams.append('email',sessionStorage.getItem("email"));
urlHabitacionesReserva.searchParams.append('email',sessionStorage.getItem("email"));
urlPrecioTotalReservaCompleta.searchParams.append('email',sessionStorage.getItem("email"));

$.get(url, function( data ) {
	//si el usuario no ha realizado ninguna reserva, mostraremos un mensaje de error
	if (Object.keys(data).length === 0) {
		inputData.innerHTML =`
		<div class="alert alert-danger" role="alert">
		No ha realizado ninguna reserva hasta el momento. Para mostrar los detalles de su reserva, debe realizar una reserva primero.
		</div>            
		`;
	}
	else {
		//recopilamos todas las reservas realizadas por el usuario, por cada reserva
		//iremos añadiendo la reserva compartida
		//de tal forma que podamos reconocer la reserva completa, que incluye 1 o más habitaciones
		for (var i = 0; i < data.length; i++) {
			//copiamos el array incluido en data, para evitar que a posteriori data valga siempre el último valor recogido
			var idReservaCompartida = data.slice();
			//añadimos a las url que lo precisan el idReservaCompartida actual
			urlHabitacionesReserva.searchParams.set('idReservaCompartida',data[i]);
			urlPrecioTotalReservaCompleta.searchParams.set('idReservaCompartida',data[i]);
			//recogemos el precio total por cada reserva completa
			$.get(urlPrecioTotalReservaCompleta, function(data){
				
				precioTotal = data;
			});
			//recogemos las habitaciones incluidas en una reserva concreta
			$.get(urlHabitacionesReserva, function(data){
				//pintamos los datos necesarios, siendo la longitud de los datos recibidos el total de habitaciones de una reserva
				contador++;
				var totalHabitaciones = data.length;
				inputData.innerHTML +=`
				<div class="bg-light  border border-warning rounded text-left m-5 jquery">

				<div class="table-body">
				<div class="row">
				<div class="col-lg-12 text-center">
				<h4 id="contador"> Reserva ` + contador + ` </h4>
				<p ><b>Total de habitaciones: </b> `+ totalHabitaciones + ` <b>Precio total de la reserva: </b> `+ precioTotal + `€</p>
				<!-- Botón que acciona el modal -->
				<h6><button type="button" class="btn btn-primary " data-toggle="modal" data-target="#exampleModal" id="`+ idReservaCompartida[contador-1] +`">Cancelar reserva completa</button></h6>
				</div>
				`;
				//por cada habitación incluida dentro de una reserva, pintamos los datos
				for (var j = 0; j < data.length; j++) {
					//si aún no se ha accedido a la habitación o se ha llegado a la fecha de entrada, se pintan los datos de la habitación y se da la opción de eliminar la habitación
					if(new Date(data[j].fechaEntrada).getTime() > new Date(fechaActual).getTime()){
						inputData.innerHTML +=` 
						<div class="bg-light  border border-warning rounded text-left m-5 jquery">
						<div class="table-body m-5">
						<div class="row">
						<br>
						<div class='col-lg-6 float-left'>
						<img class="rounded mx-auto d-block" src="`+ data[j].habitaciones.pathImg +  `">
						</div>
						<div class='col-lg-6 float-right'>
						<p>Fecha de entrada: `+ $.date(data[j].fechaEntrada) +  ` </p>
						<p>Fecha de salida: `+ $.date(data[j].fechaSalida) +  ` </p>
						<p>Tipo de habitación: `+ data[j].habitaciones.tipo +  `</p>
						<p>Número de la habitación: `+ data[j].habitaciones.numHabitacion +  `</p>
						<p>Tipo de pensión: `+ data[j].pensiones.tipo + `</p>
						<p>Precio: `+ data[j].precio +  `€ </p>
						<h6><button type='button' class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" id="` + data[j].idReservas + `">Cancelar reserva de habitación</button></h6>

						</div>
						

						<div class='col-lg-10 mx-auto ' > 
						<br> <br>
						<p>` + data[j].habitaciones.descripcion +  `  </p>
						</div>
						</div>
						</div>
						</div>
						</div>`;

						

					}
					
					
					//si la habitación reservada está en la fecha de salida y/o la fecha actual es posterior a la fecha de finalización de la estancia
					//además de que no se ha valorado la habitación, habilitamos un botón para que se valore la habitación
					else if(new Date(data[j].fechaSalida).getTime()<= new Date(fechaActual).getTime() && data[j].idValoraciones == null){
						inputData.innerHTML += ` 
						<div class="bg-light  border border-warning rounded text-left m-5 jquery">
						<div class="table-body m-5">
						<div class="row">
						<br>
						<div class="col-lg-6 float-left">
						<img class="rounded mx-auto d-block" src="`+ data[j].habitaciones.pathImg +  `">

						</div>
						<div class="col-lg-6 float-right">
						<p>Fecha de entrada: `+ $.date(data[j].fechaEntrada) +  ` </p>
						<p>Fecha de salida: `+ $.date(data[j].fechaSalida) +  ` </p>
						<p>Tipo de habitación: `+ data[j].habitaciones.tipo +  `</p>
						<p>Número de la habitación: `+ data[j].habitaciones.numHabitacion +  `</p>
						<p>Tipo de pensión: ` + data[j].pensiones.tipo + `</p>
						<p>Precio: `+ data[j].precio +  `€ </p>
						<h6><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" id="` + data[j].idReservas + `">Valorar</button></h6>

						</div>

						<div class="col-lg-10 mx-auto text-center " > 
						<br> <br>
						<p>`+ data[j].habitaciones.descripcion +  `  </p>
						</div>
						</div>
						</div>
						</div>
						</div>
						`;	


					}

					//si los casos anteriores no son afirmativos, entonces únicamente mostramos los datos sin dar opción a cancelar o valorar la habitación
					else {
						inputData.innerHTML += ` 

						<div class="bg-light  border border-warning rounded text-left m-5 jquery">
						<div class="table-body m-5">
						<div class="row">
						<br>
						<div class="col-lg-6 float-left">
						<img class="rounded mx-auto d-block" src="`+ data[j].habitaciones.pathImg +  `">

						</div>
						<div class="col-lg-6 float-right">
						<p>Fecha de entrada: `+ $.date(data[j].fechaEntrada) +  ` </p>
						<p>Fecha de salida: `+ $.date(data[j].fechaSalida) +  ` </p>
						<p>Tipo de habitación: `+ data[j].habitaciones.tipo +  `</p>
						<p>Número de la habitación: `+ data[j].habitaciones.numHabitacion +  `</p>
						<p>Tipo de pensión: ` + data[j].pensiones.tipo + `</p>
						<p>Precio: `+ data[j].precio +  `  €</p>

						</div>

						<div class="col-lg-10 mx-auto text-center " > 
						<br> <br>
						<p>`+ data[j].habitaciones.descripcion +  ` </p>
						</div>
						</div>
						</div>
						</div>
						</div>
						</div>
						`;
					}

				}
			});
		}
		}
	});


//función que se ejecuta cuando se va a mostrar el modal
$('#exampleModal').on('show.bs.modal', function (event) {
	//guardamos la información del botón que se pulsó
	var button = $(event.relatedTarget); 
	//si el texto del botón equivale a valorar, damos la opción a valorar la estancia
	if (button.text() == "Valorar") {
		$('.modal-title').text('Valore su estancia');
		//guardamos el id de la reserva que se valora
		sessionStorage.setItem('idReservas', button.attr('id'));

		body.innerHTML= `
		<p><h6>Introduce los datos necesarios</h6> </p>
		<p>Valore la experiencia en nuestro hotel: <select id="valor">
		<option value="0">0</option>
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="4">5</option>
		</select></p>
		<div class="md-form">
		<textarea id="comentarios" class="md-textarea form-control" rows="3"></textarea>
		<label for="comentarios">Si lo desea puede introducir comentarios adicionales:</label>
		</div>
		`;
		//en función del valor que se elija, recogemos el valor y lo asignamos
		//si ese valor no existía antes o se cambia, únicamente asignamos el valor que el usuario ha seleccionado
		$("#valor").change(function() {

			var valor = $("#valor").children(":selected").attr("value");
			

			if (sessionStorage.getItem("valor") === null) {
				sessionStorage.setItem("valor", valor);
			}
			else {
				sessionStorage.removeItem("valor");
				sessionStorage.setItem("valor", valor);
			}
			//una vez se hace clic en enviar, recogemos los valores y recargamos la página
			$('#enviar').click( function(e){
				e.preventDefault();
				//recogemos la información necesaria para hacer la valoración
				urlOpiniones.searchParams.append('fecha',sessionStorage.getItem("fecha"));
				urlOpiniones.searchParams.append('email', sessionStorage.getItem("email"));
				urlOpiniones.searchParams.append('idReserva',sessionStorage.getItem("idReservas"));
				urlOpiniones.searchParams.append('comentarios', $('#comentarios').val());
				urlOpiniones.searchParams.append('valor',sessionStorage.getItem("valor"));
				//creamos la valoración en BBDD
				$.get(urlOpiniones, function (data) {});

				//recogemos el id de la habitación reservada para asignarle a la habitación la valoración creada 
				urlAddValoracionReserva.searchParams.append('idReserva',sessionStorage.getItem("idReservas"));
				$.get(urlAddValoracionReserva, function(data){
					window.location.assign("verReservas.html");
				});
			});
		});

	}
	//si el botón tiene el valor de "Cancelar reserva completa"
	else if(button.text() === "Cancelar reserva completa"){
		
		//cambiamos el título y el contenido del modal
		$('.modal-title').text('Cancelar reserva completa');
		body.innerHTML = `<h6> ¿Esta usted seguro de que desea cancelar su reserva? Esta acción es irreversible </h6>`;
		$('#enviar').click( function(e){
			e.preventDefault();

			//recogemos el valor id del botón seleccinado para saber que reserva completa se va a eliminar
			urlEliminarGrupoReserva.searchParams.set('idReservaCompartida', button.attr('id'));
			//una vez se hace clic en enviar, recogemos los valores y recargamos la página
			$.get(urlEliminarGrupoReserva, function (data) {
				window.location.assign("verReservas.html");
			});
		});



	}
	//en caso contrario, se procede a actuar cuando el usuario quiere cancelar una reserva de una habitación
	else{
		//cambiamos el título y el contenido del modal
		$('.modal-title').text('Cancelar reserva de habitación');
		body.innerHTML = `<h6> ¿Esta usted seguro de que desea cancelar su reserva? Esta acción es irreversible </h6>`;
		$('#enviar').click( function(e){
			e.preventDefault();
			//recogemos el valor id del botón seleccinado para saber que reserva de habitación se va a eliminar
			urlEliminar1Reserva.searchParams.set('idReservas', button.attr('id'));
			//una vez se hace clic en enviar, recogemos los valores y recargamos la página
			$.get(urlEliminar1Reserva, function (data) {

				window.location.assign("verReservas.html");
			});
		});

	}

	var modal = $(this);
});	
     
      });
   }});


