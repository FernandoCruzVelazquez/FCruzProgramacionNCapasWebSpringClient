function activarOpciones() {
    document.getElementById("contenedorPrincipal").classList.add("d-none");
    document.getElementById("seccionOpciones").classList.remove("d-none");
}

function mostrarFormularioEspecifico(tipo) {
    document.getElementById("seccionOpciones").classList.add("d-none");
    if (tipo === 'txt') {
        document.getElementById("formTxt").classList.remove("d-none");
        window.tipoEsperado = "txt";
    } else {
        document.getElementById("formExcel").classList.remove("d-none");
        window.tipoEsperado = "xlsx";
    }
}

function regresarOpciones() {
    document.getElementById("formTxt").classList.add("d-none");
    document.getElementById("formExcel").classList.add("d-none");
    document.getElementById("seccionOpciones").classList.remove("d-none");
}

const validarArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    const esValido = (window.tipoEsperado === "txt" && extension === "txt") || 
                        (window.tipoEsperado === "xlsx" && (extension === "xlsx" || extension === "xls"));

    if (!esValido) {
        Swal.fire({
            title: 'Archivo incorrecto',
            text: `Por favor, seleccione un archivo .${window.tipoEsperado.toUpperCase()}`,
            icon: 'error',
            background: '#1e1e1e',
            color: '#fff',
            confirmButtonColor: '#d33'
        });
        e.target.value = ""; 
    } else {
        Swal.fire({
            title: '¡Formato correcto!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#1e1e1e',
            color: '#fff'
        });
    }
};

document.getElementById("archivoTxt").addEventListener("change", validarArchivo);
document.getElementById("archivoExcel").addEventListener("change", validarArchivo);