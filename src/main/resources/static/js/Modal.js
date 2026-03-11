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
        url: "/Usuario/UpdateStatus",
        type: "POST",
        data: {
            idUsuario: idUsuario,
            status: status
        },
        success: function (result) {

            if (result.correct) {

                let label = $(checkbox).next('.status-label');

                if (status === 1) {
                    label.text("Activo");
                } else {
                    label.text("Inactivo");
                }

            } else {

                Swal.fire('Error', result.errorMessage, 'error');

                checkbox.checked = !checkbox.checked;
            }
        },
        error: function () {

            Swal.fire('Error', 'No se pudo actualizar el status', 'error');

            checkbox.checked = !checkbox.checked;

        }
    });
}

