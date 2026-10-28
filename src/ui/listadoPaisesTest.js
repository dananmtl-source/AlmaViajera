import * as llamadasApi from ("../utils/functions.js");

llamadasApi.construirHtmlConListaPaises();

document.addEventListener('DOMContentLoaded', function(event) {
  initPage();
});
