console.log("JS cargado y actualizado");


function cargarUsuario(btn) {

    const idRol = btn.dataset.idrol;
    const selectRol = document.getElementById("rol");

    document.getElementById("idUsuario").value = btn.dataset.id || "";
    document.getElementById("userName").value = btn.dataset.username || "";
    document.getElementById("nombre").value = btn.dataset.nombre || "";
    document.getElementById("apellidoPaterno").value = btn.dataset.appaterno || "";
    document.getElementById("apellidoMaterno").value = btn.dataset.apmaterno || "";
    document.getElementById("email").value = btn.dataset.email || "";
    document.getElementById("telefono").value = btn.dataset.telefono || "";
    document.getElementById("celular").value = btn.dataset.celular || "";
    document.getElementById("curp").value = btn.dataset.curp || "";
    document.getElementById("fechaNacimiento").value = btn.dataset.fechanacimiento || "";
    document.getElementById("password").value = btn.dataset.password || "";

    setTimeout(() => {
        selectRol.value = idRol;
    }, 50);

    let sexo = (btn.dataset.sexo || "").trim();

    if (sexo === "M") {
        document.getElementById("sexoM").checked = true;
    } 
    else if (sexo === "F") {
        document.getElementById("sexoF").checked = true;
    }
}


function actualizarUsuario(){

    var usuario = {

        idUsuario: parseInt($("#idUsuario").val()),
        userName: $("#userName").val(),
        nombre: $("#nombre").val(),
        apellidoPaterno: $("#apellidoPaterno").val(),
        apellidosMaterno: $("#apellidoMaterno").val(),
        email: $("#email").val(),
        telefono: $("#telefono").val(),
        celular: $("#celular").val(),
        sexo: $("input[name='sexo']:checked").val(),
        fechaNacimiento: $("#fechaNacimiento").val(),

        password: $("#password").val() || "",
        curp: $("#curp").val() || "",
        status: parseInt($("#status").val() || 1),

        rol:{
            idRol: parseInt($("#rol").val())
        }

    };

    console.log(usuario);

    $.ajax({

        url: "http://localhost:8080/Api/Usuario/Update",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(usuario),

        success: function(response){

            if(response.correct){

                Swal.fire({
                    icon:"success",
                    title:"Usuario actualizado"
                }).then(()=>{
                    location.reload();
                });

            }else{

                Swal.fire({
                    icon:"error",
                    title:"Error",
                    text:response.errorMessage
                });

            }

        }

    });

}


document.addEventListener('click', async function(e) {
    const btn = e.target.closest('.btnEditarDireccion');
    if (!btn) return;

    const { id, idusuario, calle, noext, noint, cp, idpais, idestado, idmunicipio, idcolonia } = btn.dataset;

    document.getElementById('direccionId').value = id || '';
    document.getElementById('direccionIdUsuario').value = idusuario || '';
    document.getElementById('direccionCalle').value = calle || '';
    document.getElementById('direccionNoExt').value = noext || '';
    document.getElementById('direccionNoInt').value = noint || '';
    document.getElementById('direccionCP').value = cp || '';

    if (idpais) {
        document.getElementById('direccionPais').value = idpais;
        
        await cargarSelect(`http://localhost:8080/Api/Estado/Pais/${idpais}`, 'direccionEstado', 'idEstado', idestado);
        
        if (idestado) {
            await cargarSelect(`http://localhost:8080/Api/Municipio/Estado/${idestado}`, 'direccionMunicipio', 'idMunicipio', idmunicipio);
            
            if (idmunicipio) {
                await cargarSelect(`http://localhost:8080/Api/Colonia/Municipio/${idmunicipio}`, 'direccionColonia', 'idColonia', idcolonia);
            }
        }
    }
    
});

async function cargarSelect(url, selectId, idKey, selectedId = null) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = '<option value="">-- Seleccione --</option>';

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const lista = Array.isArray(data) ? data : (data.objects || data.result || []);

        if (lista.length === 0) {
            console.warn(`La API en ${url} devolvió una lista vacía.`);
        }

        lista.forEach(obj => {
            const option = document.createElement('option');
            
            option.value = obj[idKey]; 
            
            option.textContent = obj.Nombre || obj.nombre || 'Sin Nombre';
            
            if (selectId === 'direccionColonia' || selectId === 'nuevoColonia') {
                option.dataset.cp = obj.CodigoPostal || obj.codigoPostal;
            }

            if (selectedId && String(obj[idKey]) === String(selectedId)) {
                option.setAttribute('selected', 'selected'); 
                option.selected = true;
            }
            
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando select:", error);
    }
}

function limpiarSelect(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<option value="">-- Seleccione --</option>';
    });
}


function cargarIdUsuarioFoto(button) {
    let id = button.getAttribute("data-id");
    document.getElementById("fotoIdUsuario").value = id;
}

function previewImagen(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const img = document.getElementById("previewNuevaFoto");
        img.src = reader.result;
        img.style.display = "block";
    }
    reader.readAsDataURL(event.target.files[0]);
}


document.getElementById('modalFoto').addEventListener('hidden.bs.modal', function () {

    document.querySelector('input[name="archivoFoto"]').value = "";

    const img = document.getElementById("previewNuevaFoto");
    img.src = "";
    img.style.display = "none";

    document.getElementById("fotoIdUsuario").value = "";

});

$(document).ready(function() {
    $("#formActualizarDireccion").on("submit", function(e) {
        e.preventDefault(); 

        var direccion = {
            idDireccion: $("#direccionId").val(),
            calle: $("#direccionCalle").val(),
            numeroExterior: $("#direccionNoExt").val(),
            NumeroIInteriori: $("#direccionNoInt").val(),
            colonia: {
                idColonia: $("#direccionColonia").val()
            }
        };

        $.ajax({
            url: "http://localhost:8080/Api/Direccion",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(direccion),
            success: function(response) {
                if (response.correct) {
                    Swal.fire({
                        title: '¡Actualizado!',
                        text: 'La dirección se guardó correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.errorMessage || 'No se pudo actualizar',
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                }
            },
            error: function() {
                Swal.fire({
                    title: 'Error de Red',
                    text: 'No se pudo conectar con el servidor',
                    icon: 'warning',
                    confirmButtonText: 'Cerrar'
                });
            }
        });
    });
});


function EliminarDireccion(idDireccion) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "http://localhost:8080/Api/Direccion/" + idDireccion,
                type: "DELETE",
                success: function(response) {
                    if (response.correct) {
                        Swal.fire(
                            '¡Eliminado!',
                            'La dirección ha sido borrada.',
                            'success'
                        ).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', response.errorMessage, 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'No se pudo comunicar con el servidor', 'error');
                }
            });
        }
    });
}

$(document).ready(function() {
    $("#modalFoto form").on("submit", function(e) {
        e.preventDefault();

        var idUsuario = $("#fotoIdUsuario").val();
        var formData = new FormData();
        // El nombre "imagen" debe coincidir con @RequestParam("imagen") en tu Controller
        formData.append("imagen", $("input[name='archivoFoto']")[0].files[0]);

        $.ajax({
            url: "http://localhost:8080/Api/Usuario/Foto/" + idUsuario,
            type: "POST",
            data: formData,
            processData: false,  
            contentType: false,  
            success: function(response) {
                if (response.correct) {
                    Swal.fire({
                        title: '¡Actualizado!',
                        text: 'La foto de perfil se ha actualizado.',
                        icon: 'success'
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', 'No se pudo procesar la imagen', 'error');
                }
            },
            error: function() {
                Swal.fire('Error', 'Hubo un fallo en la conexión con el servidor', 'error');
            }
        });
    });
});

function previewImagen(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var output = document.getElementById('previewNuevaFoto');
        output.src = reader.result;
        output.style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
}

function cargarIdUsuarioFoto(element) {
    var id = $(element).data('id');
    $("#fotoIdUsuario").val(id);
    $("#previewNuevaFoto").hide().attr('src', '');
}

function confirmarEliminacionUsuario(idUsuario) {
    Swal.fire({
        title: '¿Eliminar usuario?',
        text: "Esta acción borrará al usuario y toda su información relacionada.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "http://localhost:8080/Api/Usuario/" + idUsuario,
                type: "DELETE",
                success: function(response) {
                    if (response.correct) {
                        Swal.fire(
                            '¡Eliminado!',
                            'El usuario ha sido removido.',
                            'success'
                        ).then(() => {
                            window.location.href = "/Usuario"; 
                        });
                    } else {
                        Swal.fire('Error', response.errorMessage, 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
                }
            });
        }
    });
}



function insertarDireccion() {
    const idUsuario = document.getElementById('nuevoIdUsuario').value;
    const idColonia = document.getElementById('nuevoColonia').value;

    if (!idColonia) {
        Swal.fire('Error', 'Debe seleccionar una colonia', 'error');
        return;
    }

    // En INSERTAR
    const direccion = {
        idDireccion: 0,
        calle: document.getElementById('nuevoCalle').value,
        numeroExterior: document.getElementById('nuevoNoExt').value,
        NumeroIInteriori: document.getElementById('nuevoNoInt').value, // Coincide con @JsonProperty
        usuario: { idUsuario: parseInt(idUsuario) },
        colonia: { idColonia: parseInt(idColonia) }
    };

    $.ajax({
        url: "http://localhost:8080/Api/Direccion/Add",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(direccion),
        success: function(response) {
            if (response.correct) {
                Swal.fire('¡Registrado!', 'La dirección se guardó con éxito', 'success')
                    .then(() => location.reload());
            } else {
                Swal.fire('Error', response.errorMessage, 'error');
            }
        },
        error: function(e) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    });
}

function guardarDireccionAJAX() {


    // En GUARDAR (Asegúrate de agregar los parseInt aquí también)
    const direccionUpdate = {
        idDireccion: parseInt(document.getElementById('direccionId').value),
        calle: document.getElementById('direccionCalle').value,
        numeroExterior: document.getElementById('direccionNoExt').value,
        NumeroIInteriori: document.getElementById('direccionNoInt').value, // Coincide con @JsonProperty
        usuario: { idUsuario: parseInt(document.getElementById('direccionIdUsuario').value) },
        colonia: { idColonia: parseInt(document.getElementById('direccionColonia').value) }
    };

    const url = "http://localhost:8080/Api/Direccion/Add";

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(direccion),
        success: function(response) {
            if (response.correct) {
                Swal.fire('¡Éxito!', 'Dirección guardada correctamente', 'success')
                    .then(() => location.reload());
            } else {
                Swal.fire('Error', response.errorMessage, 'error');
            }
        },
        error: function() {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    });
}

function actualizarCP(selectElement) {
    // Obtenemos la opción seleccionada
    const option = selectElement.options[selectElement.selectedIndex];
    
    // Extraemos el CP del dataset (que se llena en tu función cargarSelect)
    const cp = option.dataset.cp;
    
    const inputCP = document.getElementById('nuevoCP');
    if (inputCP) {
        inputCP.value = cp || ''; // Si no hay CP, pone vacío
    }
}

$(document).ready(function() {
    // Escucha cuando el modal se cierra por completo
    $('#modalNuevaDireccion').on('hidden.bs.modal', function () {
        // 1. Resetea los campos de texto del formulario
        document.getElementById('formNuevaDireccion').reset();
        
        // 2. Limpia los selects que se llenan por AJAX (excepto País si quieres)
        limpiarSelect(['nuevoEstado', 'nuevoMunicipio', 'nuevoColonia']);
        
        // 3. Limpia el campo de CP manualmente
        document.getElementById('nuevoCP').value = '';
        
        console.log("Modal de nueva dirección limpiado.");
    });
});