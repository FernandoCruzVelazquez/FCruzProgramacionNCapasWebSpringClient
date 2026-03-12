console.log("JS cargado correctamente");


function cargarUsuario(btn) {

    

    document.getElementById("idUsuario").value = btn.dataset.id;
    document.getElementById("userName").value = btn.dataset.username;
    document.getElementById("nombre").value = btn.dataset.nombre;
    document.getElementById("apellidoPaterno").value = btn.dataset.appaterno;
    document.getElementById("apellidoMaterno").value = btn.dataset.apmaterno;
    document.getElementById("email").value = btn.dataset.email;
    document.getElementById("telefono").value = btn.dataset.telefono;
    document.getElementById("celular").value = btn.dataset.celular;
    document.getElementById("CURP").value = btn.dataset.curp;
    document.getElementById("fechaNacimiento").value = btn.dataset.fechanacimiento;
    document.getElementById("password").value = btn.dataset.password;


    let idRol = btn.dataset.idrol;
    document.getElementById("rol").value = idRol;


    let sexo = btn.dataset.sexo.trim();

    if (sexo === "M") {
        document.getElementById("sexoM").checked = true;
    } else if (sexo === "F") {
        document.getElementById("sexoF").checked = true;
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const switchStatus = document.getElementById("editStatus");
    const hiddenStatus = document.getElementById("statusHidden");

    if (switchStatus) {
        switchStatus.addEventListener('change', function() {
            switchStatus.addEventListener("change", function () {
            hiddenStatus.value = this.checked ? 1 : 0;
            console.log("Nuevo status:", hiddenStatus.value);
        });
        });
    }

});


async function cargarSelect(url, selectId, idKey, selectedId = null) {
    const select = document.getElementById(selectId);
    if (!select) return; 
    
    select.innerHTML = '<option value="">-- Seleccione --</option>';

    try {
        const response = await fetch(url);
        const data = await response.json();

        const lista = data.objects || data; 
        if (!Array.isArray(lista)) return;

        lista.forEach(obj => {
            const option = document.createElement('option');
            
            const value = obj[idKey] || obj[idKey.charAt(0).toLowerCase() + idKey.slice(1)];
            const texto = obj.nombre || obj.Nombre;

            option.value = value;
            option.textContent = texto;

            if (selectId === 'direccionColonia') {
                option.dataset.cp = obj.codigoPostal || obj.CodigoPostal;
            }

            if (String(value) === String(selectedId)) {
                option.selected = true;
                if (selectId === 'direccionColonia') {
                    document.getElementById('direccionCP').value = option.dataset.cp;
                }
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando select:", error);
    }
}

document.getElementById('direccionColonia')
    .addEventListener('change', function () {

        const selectedOption = this.options[this.selectedIndex];

        if (selectedOption.dataset.cp) {
            document.getElementById('direccionCP').value =
                selectedOption.dataset.cp;
        } else {
            document.getElementById('direccionCP').value = '';
        }
});

document.querySelectorAll('.btnEditarDireccion').forEach(button => {
    button.addEventListener('click', async () => {

        const { idpais, idestado, idmunicipio, idcolonia } = button.dataset;

        document.getElementById('direccionId').value    = button.dataset.id;
        document.getElementById('direccionCalle').value = button.dataset.calle;
        document.getElementById('direccionNoExt').value = button.dataset.noext;
        document.getElementById('direccionNoInt').value = button.dataset.noint;
        document.getElementById('direccionCP').value    = button.dataset.cp;

        document.getElementById('direccionPais').value = idpais;

        if (idpais) {
            await cargarSelect(
                `http://localhost:8080/Api/Estado/Pais/${idpais}`,
                'direccionEstado',
                'idEstado',
                idestado
            );

            if (idestado) {
                await cargarSelect(
                    `http://localhost:8080/Api/Municipio/Estado/${idestado}`,
                    'direccionMunicipio',
                    'idMunicipio',
                    idmunicipio
                );

                if (idmunicipio) {
                    await cargarSelect(
                        `http://localhost:8080/Api/Colonia/Municipio/${idmunicipio}`,
                        'direccionColonia',
                        'idColonia',
                        idcolonia
                    );
                }
            }
        }
    });
});



document.getElementById('direccionPais').addEventListener('change', e => {
    limpiarSelect('direccionEstado');
    limpiarSelect('direccionMunicipio');
    limpiarSelect('direccionColonia');

    if (e.target.value) {
        cargarSelect(
            `http://localhost:8080/Api/Estado/Pais/${e.target.value}`,
            'direccionEstado',
            'idEstado'
        );
    }
});

document.getElementById('direccionEstado').addEventListener('change', e => {
    limpiarSelect('direccionMunicipio');
    limpiarSelect('direccionColonia');

    if (e.target.value) {
        cargarSelect(
            `http://localhost:8080/Api/Municipio/Estado/${e.target.value}`,
            'direccionMunicipio',
            'idMunicipio'
        );
    }
});

document.getElementById('direccionMunicipio').addEventListener('change', e => {
    limpiarSelect('direccionColonia');

    if (e.target.value) {
        cargarSelect(
            `http://localhost:8080/Api/Colonia/Municipio/${e.target.value}`,
            'direccionColonia',
            'idColonia'
        );
    }
});

function limpiarSelect(id) {
    document.getElementById(id).innerHTML =
        '<option value="">-- Seleccione --</option>';
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

function ejecutarBusqueda() {

    let id = $('#txtIdBuscar').val();

    if (id === "") {
        Swal.fire('Atención', 'Ingresa un ID', 'warning');
        return;
    }

    $.ajax({
        url: "http://localhost:8080/Api/Usuario/GetById/" + id,
        type: "GET",
        dataType: "json",
        success: function(u) {

            if (u) {

                $('#cardResultado').fadeIn();

                let nombreCompleto = u.nombre + " " + u.apellidoPaterno + " " + (u.apellidosMaterno || "");
                $('#resNombre').text(nombreCompleto);

                $('#resEmail').text(u.email);
                $('#resTelefono').text(u.telefono || "N/A");
                $('#resCelular').text(u.celular || "N/A");

                $('#lnkDetalle').attr('href', '/Usuario/Detalle?id=' + u.idUsuario);

            } else {
                Swal.fire('Error', 'No se encontró el usuario', 'error');
            }
        },
        error: function(xhr) {
            console.error(xhr.responseText);
            Swal.fire('Error', 'Ocurrió un error en el servidor', 'error');
        }
    });
}

function cambiarStatus(idUsuario, checkbox) {
    let status = checkbox.checked ? 1 : 0;

    $.ajax({
        url: "http://localhost:8080/Api/Usuario/UpdateStatus/" + idUsuario + "/" + status,
        type: "PUT", 
        success: function (result) {
            if (result.correct) {
                let label = $(checkbox).next('.status-label');
                
                if (status === 1) {
                    label.text("Activo");
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    Toast.fire({ icon: 'success', title: 'Usuario activado' });
                } else {
                    label.text("Inactivo");
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    Toast.fire({ icon: 'warning', title: 'Usuario desactivado' });
                }
            } else {
                Swal.fire('Error', result.errorMessage, 'error');
                checkbox.checked = !checkbox.checked; 
            }
        },
        error: function () {
            Swal.fire('Error', 'No se pudo conectar con el servicio de status', 'error');
            checkbox.checked = !checkbox.checked; 
        }
    });
}



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
        text: "Esta acción borrará al usuario y toda su información relacionada (direcciones, etc.)",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar permanentemente',
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
                            'El usuario ha sido removido del sistema.',
                            'success'
                        ).then(() => {
                            location.reload(); 
                        });
                    } else {
                        Swal.fire('Error', response.errorMessage, 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'No se pudo conectar con el servidor de la API', 'error');
                }
            });
        }
    });
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