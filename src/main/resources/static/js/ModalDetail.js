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
    document.getElementById("CURP").value = btn.dataset.curp || "";
    document.getElementById("fechaNacimiento").value = btn.dataset.fechanacimiento || "";
    document.getElementById("password").value = btn.dataset.password || "";

    if (idRol && selectRol) {

        selectRol.value = idRol;
        
        console.log("Intentando asignar Rol ID:", idRol);
        console.log("Valores disponibles en select:", Array.from(selectRol.options).map(o => o.value));
    } else {
        console.warn("No se encontró el idRol o el select");
    }

    let sexo = (btn.dataset.sexo || "").trim();
    if (sexo === "M") {
        document.getElementById("sexoM").checked = true;
    } else if (sexo === "F") {
        document.getElementById("sexoF").checked = true;
    }


}

// --- CARGAR DIRECCIÓN ---
// Usamos delegación de eventos para asegurar que siempre detecte el click
document.addEventListener('click', async function(e) {
    const btn = e.target.closest('.btnEditarDireccion');
    if (!btn) return;

    // Extraer datos del dataset (JS los convierte a minúsculas automáticamente)
    const { id, idusuario, calle, noext, noint, cp, idpais, idestado, idmunicipio, idcolonia } = btn.dataset;

    // Llenar campos básicos
    document.getElementById('direccionId').value = id;
    document.getElementById('direccionIdUsuario').value = idusuario;
    document.getElementById('direccionCalle').value = calle;
    document.getElementById('direccionNoExt').value = noext;
    document.getElementById('direccionNoInt').value = noint;
    document.getElementById('direccionCP').value = cp;

    // Cascada de Selects
    if (idpais) {
        document.getElementById('direccionPais').value = idpais;
        
        await cargarSelect(`/Usuario/getEstadosByPais/${idpais}`, 'direccionEstado', 'IdEstado', idestado);
        
        if (idestado) {
            await cargarSelect(`/Usuario/getMunicipioByEstado/${idestado}`, 'direccionMunicipio', 'IdMunicipio', idmunicipio);
            
            if (idmunicipio) {
                await cargarSelect(`/Usuario/getColoniaByMunicipios/${idmunicipio}`, 'direccionColonia', 'IdColonia', idcolonia);
            }
        }
    }
});

// --- FUNCIONES AUXILIARES ---
async function cargarSelect(url, selectId, idKey, selectedId = null) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">-- Seleccione --</option>';

    try {
        const response = await fetch(url);
        const data = await response.json();
        const lista = data.objects || [];

        lista.forEach(obj => {
            const option = document.createElement('option');
            option.value = obj[idKey];
            option.textContent = obj.Nombre;
            
            if (selectId === 'direccionColonia') {
                option.dataset.cp = obj.CodigoPostal;
            }

            if (String(option.value) === String(selectedId)) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando select:", error);
    }
}

// Manejo de cambios manuales en los selects
document.getElementById('direccionPais').addEventListener('change', e => {
    limpiarSelect(['direccionEstado', 'direccionMunicipio', 'direccionColonia']);
    if (e.target.value) cargarSelect(`/Usuario/getEstadosByPais/${e.target.value}`, 'direccionEstado', 'IdEstado');
});

document.getElementById('direccionEstado').addEventListener('change', e => {
    limpiarSelect(['direccionMunicipio', 'direccionColonia']);
    if (e.target.value) cargarSelect(`/Usuario/getMunicipioByEstado/${e.target.value}`, 'direccionMunicipio', 'IdMunicipio');
});

document.getElementById('direccionMunicipio').addEventListener('change', e => {
    limpiarSelect(['direccionColonia']);
    if (e.target.value) cargarSelect(`/Usuario/getColoniaByMunicipios/${e.target.value}`, 'direccionColonia', 'IdColonia');
});

function limpiarSelect(ids) {
    ids.forEach(id => {
        document.getElementById(id).innerHTML = '<option value="">-- Seleccione --</option>';
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