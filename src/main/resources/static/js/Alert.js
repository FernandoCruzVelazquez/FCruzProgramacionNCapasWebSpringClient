document.addEventListener('DOMContentLoaded', () => {

    
    const body = document.body;
    const success = body.getAttribute('data-success');
    const error = body.getAttribute('data-error');

    if (success && success.trim() !== "") {
        Swal.fire({
            title: "¡Éxito!",
            text: success,
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    } else if (error && error.trim() !== "") {
        Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
});

function confirmarEliminacionUsuario(idUsuario) {

    Swal.fire({
        title: '¿Eliminar usuario?',
        text: "Se eliminarán también sus direcciones",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {

        if (result.isConfirmed) {

            let form = document.createElement("form");
            form.method = "POST";
            form.action = "/Usuario/delete";

            let input = document.createElement("input");
            input.type = "hidden";
            input.name = "idUsuario";
            input.value = idUsuario;

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
}

function confirmarEliminacionDireccion(idDireccion) {

    Swal.fire({
        title: '¿Eliminar dirección?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {

        if (result.isConfirmed) {

            let form = document.createElement("form");
            form.method = "POST";
            form.action = "Usuario/Direccion/delete";

            let input = document.createElement("input");
            input.type = "hidden";
            input.name = "idDireccion";
            input.value = idDireccion;

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
}

