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



