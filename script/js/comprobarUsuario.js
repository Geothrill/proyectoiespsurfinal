//función que comprueba si los datos incluidos en la sesión son correctos, sirve para hacer login en el aplicativo
// como un usuario
 $(function() {
     if( sessionStorage.getItem('email') == null ) {
      window.location.assign('../index.html');
      }
      else if(sessionStorage.getItem('tipoUsuario') != 'U'){
      window.location.assign('../index.html');
      }
      });