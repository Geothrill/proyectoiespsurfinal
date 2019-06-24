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
			//damos valor al campo fechaEntrada con la fecha del día en el que se realiza la búsqueda
			var fechaEntrada = document.getElementById('fechaEntrada');
			var fechaActual = new Date();
			var dd = String(fechaActual.getDate()).padStart(2, '0');
			var mm = String(fechaActual.getMonth() + 1).padStart(2, '0'); 
			var yyyy = fechaActual.getFullYear();

			fechaActual = yyyy + '-' + mm + '-' + dd;

			fechaEntrada.defaultValue = fechaActual;

			//botón que ejecuta la búsqueda de habitaciones
			var busqueda = document.getElementById('busqueda');
			//divs en los que mostraremos datos en función de la información a mostrar
			var inputData = document.getElementById('inputData');
			var mostrarError = document.getElementById('mostrarError');
				//evento realizado cuando tenemos el formulario relleno y deseamos obtener los resultados de la búsqueda
				busqueda.addEventListener('submit', function(e){
					e.preventDefault();
					//variables que incluyen los valores del formulario
					var precio1 = document.getElementById('precio1').value;
					var precio2 = document.getElementById('precio2').value;
					var ocupantes = document.getElementById('ocupantes').value;
					var fechaEntrada = document.getElementById('fechaEntrada').value;
					var fechaSalida = document.getElementById('fechaSalida').value;
					//comprobamos si tenemos información de búsquedas anteriores, en caso negativo
					//damos los valores actuales, en caso afirmativo eliminamos los anteriores
					//y damos los actuales
					if (sessionStorage.getItem("ocupantes") === null) {
						sessionStorage.setItem("ocupantes", ocupantes);
					}
					else {
						sessionStorage.removeItem("ocupantes");
						sessionStorage.setItem("ocupantes", ocupantes);
					}

					if (sessionStorage.getItem("fechaEntrada") === null) {
						sessionStorage.setItem("fechaEntrada", fechaEntrada);
					}
					else {
						sessionStorage.removeItem("fechaEntrada");
						sessionStorage.setItem("fechaEntrada", fechaEntrada);
					}

					if (sessionStorage.getItem("fechaSalida") === null) {
						sessionStorage.setItem("fechaSalida", fechaSalida);
					}
					else {
						sessionStorage.removeItem("fechaSalida");
						sessionStorage.setItem("fechaSalida", fechaSalida);
					}
					if (sessionStorage.getItem("fechaReserva") === null) {
						sessionStorage.setItem("fechaReserva", fechaActual);
					}
					else {
						sessionStorage.removeItem("fechaReserva");
						sessionStorage.setItem("fechaReserva", fechaActual);
					}
					//comprobamos que la fecha de entrada es la correcta, si es menor a la actual
					//o es mayor que la de salida se notificará
					//también eliminamos el valor de los campos anteriores para que no se acumulen
					if (fechaEntrada < fechaActual || fechaEntrada >= fechaSalida) {
						$('.jquery').remove();
						$('#error').remove();
						mostrarError.innerHTML = `
						<div id="error">
						<div class="alert alert-danger" role="alert">
						Las fechas introducidas no son válidas para la búsqueda, revise las fechas introducidas.
						</div> 
						</div>           
						`;

					}
					//comprobamos que el precio máximo no es menor al precio mínimo, en caso positivo se notificará un error
					//también eliminamos el valor de los campos anteriores para que no se acumulen
					else if(precio2 < precio1){
						$('.jquery').remove();
						$('#error').remove();
						mostrarError.innerHTML = `
						<div id="error">
						<div class="alert alert-danger" role="alert">
						Los precios introducidos no son válidos, revise los precios introducidos.
						</div>     
						</div>        
						`;
					}

					//en caso negativo a las condiciones anteriores la búsqueda es correcta
					//también eliminamos el valor de los campos anteriores para que no se acumulen
					else {

						$('.jquery').remove();
						$('#error').remove();
						//url a la que accedemos para ver el listado de habitaciones
						var url = new URL('http://3.82.8.247:8090/habitaciones/reservar');
						//añadimos los parámetros a la url
						url.searchParams.append('fechaEntrada',fechaEntrada);
						url.searchParams.append('fechaSalida',fechaSalida);
						url.searchParams.append('ocupantes', ocupantes);
						url.searchParams.append('precio1',precio1);
						url.searchParams.append('precio2',precio2);

							$.get(url, function( data ) {
								//si la respuesta que nos llega es de longitud 0 significa que no tenemos resultados
								//también eliminamos el valor de los campos anteriores para que no se acumulen
								if (Object.keys(data).length === 0) {
									$('#error').remove();
									$('.jquery').remove();
									mostrarError.innerHTML = `
									<div id="error">
									<div class="alert alert-danger" role="alert">
									Lo sentimos, no hay tenemos habitaciones con esas características. 
									</div>  
									</div>           
									`;

								}
								//procedemos a mostrar al usuario cada habitación
								//también eliminamos el valor de los campos anteriores para que no se acumulen
								else{
									$('.jquery').remove();
									$('#error').remove();
									//por cada habitación se muestran datos
									$.each(data, function(idx, obj) {

										inputData.innerHTML += ` 
										<div class="jquery">
										
										<div class="bg-light  border border-warning rounded text-left m-5">
										
										
										<div class="table-body">
										<div class="row">
										<div class="col-lg-6 float-left">
										<img class="rounded mx-auto d-block" src="`+ obj.pathImg +  `">

										</div>
										<div class="col-lg-6 float-right">
										<p>Tipo de habitación: `+ obj.tipo +  `</p>
										<p>Número de la habitación: `+ obj.numHabitacion +  `</p>
										<p>Precio: `+ obj.precio +  ` €/ al día</p>
										<!-- botón que muestra el modal para realizar la reserva -->
										<h6><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" id="` + obj.idHabitaciones + `">RESERVAR</button></h6>

										</div>
										

										<div class="col-lg-10 mx-auto" > 
										<br> 
										<p>`+ obj.descripcion +  `  </p>
										</div>
										</div>
										</div>
										</div>
										</div>
										</div>

										`;
										

									})
			}
		});
	}



});


});
}
});

