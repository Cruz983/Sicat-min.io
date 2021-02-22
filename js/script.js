// Funcionamiento de la API
var SpeechRecognition = window.webkitSpeechRecognition;

var recognition = new SpeechRecognition();
recognition.continuous = true;

let saveHandle

var Textbox = $("#textarea");
var instructions = $("#instructions");

var Content = "";

recognition.onresult = function (event) {
  var current = event.resultIndex;
  var transcript = event.results[current][0].transcript;

  Content += transcript;
  Textbox.val(Content);
};

$("#start").on("click", function (e) {
  if ($(this).text() == "Detener Grabación") {
    $(this).html("Grabación Iniciada");
    $("#instructions").html("");
    recognition.stop();
  } else {
    $(this).html("Detener Grabación");
    $("#instructions").html("Reconocimiento de voz activo");
    if (Content.length) {
      Content += " ";
    }
    recognition.start();
  }
});

$("#saveas").click(function (e) {
  saveText(Content);
  // recognition.stop(); // <--- Agregada
});

async function saveText(content) {
  const opts = {
    type: "save-file",
    accepts: [
      {
        description: "Text file",
        extensions: ["txt"],
        mimeTypes: ["text/plain"],
      },
    ],
  };
  const handle = await window.chooseFileSystemEntries(opts);

  const writable = await handle.createWritable();
  // Escribe el contenido del archivo en la secuencia.
  await writable.write(content);
  // Cierra el archivo y escribe el contenido en el equipo.
  await writable.close();
}

$("#load").click(function () {
    if($(this).html() == "Modificar Cambios"){
        saveFile(saveHandle,Content)
    }else{
    $(this).html("Modificar Cambios")
  loadFile();
    }
});

async function getNewFileHandle() {
  
  const handle = await window.chooseFileSystemEntries();
  return handle;
}

async function loadFile() {

  saveHandle = await getNewFileHandle()

  if(await verifyPermission(saveHandle,true)){
 
  // Solicitar permisos, si el usuario concede los permisos, devuelve TRUE.
    const file = await saveHandle.getFile();
    const contents = await file.text();
    console.log(contents);
    Content += contents;
    $("textarea").val(contents);
  }}

  async function saveFile(saveHandle,content){
    const writable = await saveHandle.createWritable();
    // Escribe el contenido del archivo en la secuencia.
    await writable.write(content);
    // Cierra el archivo y escribe el contenido en el equipo.
    await writable.close();

    alert("Los cambios han sido Guardados")
  }

  async function verifyPermission(fileHandle, withWrite) {
    const opts = {};
    if (withWrite) {
      opts.writable = true;
    }
    // Comprueba si ya tenemos permiso, si es así, devuelve true.
    if (await fileHandle.queryPermission(opts) === 'granted') {
      return true;
    }
    // Solicitar permisos para el archivo, si el usuario concede permiso, devuelve true.
    if (await fileHandle.requestPermission(opts) === 'granted') {
      return true;
    }
    // Si el usuario no concede los permisos, devuelve false
    return false;
  }

$("#clear").click(function () {
  Textbox.val("");
  $("#load").html("Cargar Archivo")
  Content = ""
  $("#start").html("Comenzar Grabación")
});

Textbox.on("input", function () {
  Content = $(this).val();
});

// Datables

$(document).ready(function() {
  $('#tabla').DataTable( {

      "language": {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando _START_ de _TOTAL_ Entradas",
        "infoEmpty": "Mostrando 0 de 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar _MENU_ Entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar:",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
          "first": "Primero",
          "last": "Ultimo",
          "next": "Siguiente",
          "previous": "Anterior"
      }
      }

  });
});

