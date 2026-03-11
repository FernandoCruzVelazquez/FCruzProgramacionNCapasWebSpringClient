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
            
            if (selectId === 'direccionColonia') {
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