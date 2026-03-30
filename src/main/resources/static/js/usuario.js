    document.addEventListener("DOMContentLoaded", function () {

        const input = document.getElementById("archivoFoto");
        const icono = document.getElementById("iconoDefault");
        const wrapper = document.querySelector(".foto-wrapper");

        input.addEventListener("change", function () {

            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {

                    let img = document.getElementById("previewFoto");

                    if (!img) {
                        img = document.createElement("img");
                        img.id = "previewFoto";
                        img.className = "w-100 h-100";
                        img.style.objectFit = "cover";
                        wrapper.appendChild(img);
                    }

                    img.src = e.target.result;

                    if (icono) {
                        icono.remove();
                    }
                };

                reader.readAsDataURL(file);
            }

        });

    });



    function SoloLetras(input, event){
        console.log(input); 

        var valorCompleto = $(input).val() + event.key;
        console.log(valorCompleto);

        console.log("ID:", input.id);

        var regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if(regex.test(valorCompleto)){
            console.log("Paso la expresion regular");
            $("#error" + input.id).text('');
            $(input).removeClass('border border-danger');
        }else{
            console.log("NO paso la expresion regular");
            event.preventDefault();
            $(input).addClass('border border-danger');
            $("#error" + input.id).text('Solo letras').css('color','red');
        }
    }

    function SoloLetrasBlur(input){
        var regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if(regex.test($(input).val())){
            console.log("Paso la expresion regular");
            $("#error" + input.id).text('');
            $(input).removeClass('border border-danger');
            $(input).addClass('border border-success');
        }
    }

    function ValidarEmail(input) {

        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (regex.test($(input).val())) {
            $("#errorEmail").text('');
            $(input).removeClass('border border-danger');
            $(input).addClass('border border-success');
        } else {
            $("#errorEmail").text('Email inválido').css('color', 'red');
            $(input).removeClass('border border-success');
            $(input).addClass('border border-danger');
        }
    }

    function ValidarTelefono(input) {
        var regex = /^[0-9]{10}$/;

        if (regex.test($(input).val())) {
            $("#errorTelefono").text('');
            $(input).removeClass('border border-danger')
                    .addClass('border border-success');
        } else {
            $("#errorTelefono").text('Debe contener 10 dígitos')
                            .css('color', 'red');
            $(input).removeClass('border border-success')
                    .addClass('border border-danger');
        }
    }

    function ValidarCURP(input) {
        var regex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z]{2}$/;

        if (regex.test($(input).val())) {
            $("#errorCURP").text('');
            $(input).removeClass('border border-danger')
                    .addClass('border border-success');
        } else {
            $("#errorCURP").text('CURP inválida')
                        .css('color', 'red');
            $(input).removeClass('border border-success')
                    .addClass('border border-danger');
        }
    }

    function ValidarUsername(input) {
        var regex = /^[a-zA-Z0-9]{4,20}$/;

        if (regex.test($(input).val())) {
            $("#errorUserName").text('');
            $(input).removeClass('border border-danger')
                    .addClass('border border-success');
        } else {
            $("#errorUserName").text('4-20 caracteres sin espacios')
                            .css('color', 'red');
            $(input).removeClass('border border-success')
                    .addClass('border border-danger');
        }
    }

    function ValidarPassword(input) { 

        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,16}$/;

        if (regex.test($(input).val())) {
            $("#errorPassword").text('');
            $(input).removeClass('border border-danger')
                    .addClass('border border-success');
        } else {
            $("#errorPassword")
                .text('8-16 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo')
                .css('color', 'red');

            $(input).removeClass('border border-success')
                    .addClass('border border-danger');
        }
    }

    function ValidarFechaNacimiento(input) {

        let fechaIngresada = new Date($(input).val());
        let hoy = new Date();

        if (!$(input).val()) {
            $("#errorFecha").text("La fecha es obligatoria").css("color", "red");
            $(input).removeClass('border border-success')
                    .addClass('border border-danger');
            return;
        }

        let edad = hoy.getFullYear() - fechaIngresada.getFullYear();
        let mes = hoy.getMonth() - fechaIngresada.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaIngresada.getDate())) {
            edad--;
        }

        if (fechaIngresada > hoy) {
            $("#errorFecha").text("No puede seleccionar una fecha futura")
                            .css("color", "red");

            $(input).removeClass('border border-success')
                    .addClass('border border-danger');

        } else if (edad < 18) {
            $("#errorFecha").text("Debe ser mayor de 18 años")
                            .css("color", "red");

            $(input).removeClass('border border-success')
                    .addClass('border border-danger');

        } else {
            $("#errorFecha").text("");

            $(input).removeClass('border border-danger')
                    .addClass('border border-success');
        }
    }

    function ValidarSexo() {

        let seleccionado = $("input[name='sexo']:checked").val();

        if (!seleccionado) {

            $("#errorSexo")
                .text("Debe seleccionar una opción")
                .css("color", "red");

            $("input[name='sexo']")
                .addClass("is-invalid");

            return false;

        } else {

            $("#errorSexo").text("");

            $("input[name='sexo']")
                .removeClass("is-invalid");

            return true;
        }
    }




    $(document).ready(function () {

        $.ajaxSetup({
            headers: {
                'Authorization': "Bearer " + jwtToken
            }
        });

        var cargandoDesdeCP = false;

        console.log("Ya termine de cargar la página");

        $("#ddlpais").change(function () {
            console.log("Ya cambie");
            var IdPais = $("#ddlpais").val();
            if (IdPais != 0) {
                $.ajax({
                    url: "http://localhost:8080/Api/Estado/Pais/" + IdPais, 
                    type: "GET",
                    dataType: 'json',

                    headers: {
                        "Authorization": "Bearer " + jwtToken
                    },

                    success: function (data) {

                        console.log("Todo OK");
                        console.log(data);

                        $("#ddlestado").empty();
                        $("#ddlmunicipio").empty();
                        $("#ddlcolonia").empty();

                        $("#ddlestado").append("<option value='0'>Selecciona un estado</option>");
                        $("#ddlmunicipio").append("<option value='0'>Selecciona un municipio</option>");
                        $("#ddlcolonia").append("<option value='0'>Selecciona colonia</option>");

                        $("#codigoPostal").val("");

                        $.each(data, function (i, estado) {

                            console.log(estado.nombre);

                            $("#ddlestado").append(
                                "<option value='" + estado.idEstado + "'>" +
                                estado.nombre +
                                "</option>"
                            );
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("No se pudo procesar la tarea");
                    }
                });
            } else {
                $("#ddlestado").empty();
                $("#ddlestado").append("<option value=0 selected>Selecciona un estado</option>");
            }


        });

        console.log("Ya carge estado ahora municipio");

        $("#ddlestado").change(function () {

            console.log("Ya cambie a estado");

            var IdEstado = $("#ddlestado").val();

            if (IdEstado != 0) {

                $.ajax({
                    url: "http://localhost:8080/Api/Municipio/Estado/" + IdEstado,
                    type: "GET",
                    dataType: 'json',

                    headers: {
                        "Authorization": "Bearer " + jwtToken
                    },

                    success: function (data) {

                        console.log("Todo OK");
                        console.log(data);

                        $("#ddlmunicipio").empty();
                        $("#ddlmunicipio").append("<option value='0'>Selecciona un municipio</option>");

                        $("#ddlcolonia").empty();
                        $("#ddlcolonia").append("<option value='0'>Selecciona colonia</option>");

                        $("#codigoPostal").val("");

                        $.each(data, function (i, municipio) {

                            console.log(municipio.nombre);

                            $("#ddlmunicipio").append(
                                "<option value='" + municipio.idMunicipio + "'>" +
                                municipio.nombre +
                                "</option>"
                            );

                        });

                    },

                    error: function (jqXHR) {
                        console.error("Error: ", jqXHR.status);

                        if (jqXHR.status === 403) {
                            alert("No tienes permiso o la sesión expiró.");
                        } else {
                            alert("Error en la petición");
                        }
                    }

                });

            } else {

                $("#ddlmunicipio").empty();
                $("#ddlmunicipio").append("<option value='0'>Selecciona un municipio</option>");

            }

        });

        console.log("Ya carge municipio ahora colonia");

        $("#ddlmunicipio").change(function () {         


            var IdMunicipio = $("#ddlmunicipio").val();
            if (IdMunicipio != 0) {
                $.ajax({
                    url: "http://localhost:8080/Api/Colonia/Municipio/" + IdMunicipio,
                    type: "GET",
                    dataType: 'json',
                    success: function (data) {
                        $("#ddlcolonia").empty();
                        $("#ddlcolonia").append("<option value=0 selected>Selecciona una colonia</option>");

                        $("#codigoPostal").val("");

                        $.each(data, function (i, colonia) {
                            $("#ddlcolonia").append( "<option value='" + colonia.idColonia + "' data-cp='" + colonia.codigoPostal + "'>" + colonia.nombre + "</option>");
                        });
                    },
                    error: function () {
                        alert("No se pudo procesar la tarea");
                    }
                });

            }
        });

        console.log("Cargo CP y lleno direccion");

        $("#ddlcolonia").change(function () {

            var codigoPostal = $("#ddlcolonia option:selected").data("cp");

            if (codigoPostal != undefined) {
                $("#codigoPostal").val(codigoPostal);
            } else {
                $("#codigoPostal").val("");
            }

        });

        $("#codigoPostal").blur(function () {

            var cp = $(this).val();

            if (cp.length == 5) {

                cargandoDesdeCP = true; 

                $.ajax({
                    url: "/Usuario/getDireccionByCP/" + cp,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {

                        console.log(data);

                        if (data.objects.length > 0) {

                            var direccion = data.objects[0];

                            var idPais = direccion.Municipio.Estado.Pais.IdPais;
                            var idEstado = direccion.Municipio.Estado.IdEstado;
                            var idMunicipio = direccion.Municipio.IdMunicipio;

                            $("#ddlpais").val(idPais).trigger("change");

                            setTimeout(function () {

                                $("#ddlestado").val(idEstado).trigger("change");

                                setTimeout(function () {

                                    $("#ddlmunicipio").val(idMunicipio);

                                    $("#ddlcolonia").empty();
                                    $("#ddlcolonia").append("<option value='0'>Selecciona colonia</option>");

                                    $.each(data.objects, function (i, colonia) {
                                        $("#ddlcolonia").append(
                                            "<option value='" + colonia.IdColonia + "'>" + colonia.Nombre + "</option>"
                                        );
                                    });

                                    cargandoDesdeCP = false; 

                                }, 500);

                            }, 500);
                        }
                    }
                });
            }
        });
    });