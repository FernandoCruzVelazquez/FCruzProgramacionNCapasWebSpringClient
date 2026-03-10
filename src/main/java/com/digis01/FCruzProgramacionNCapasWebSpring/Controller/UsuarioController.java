package com.digis01.FCruzProgramacionNCapasWebSpring.Controller;

import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Colonia;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Direccion;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.ErroresArchivo;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Estado;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Municipio;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Pais;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Result;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Rol;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Usuario;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;


@Controller
@RequestMapping("Usuario")
public class UsuarioController {

    private static String rutaBase = "http://localhost:8080/Api";

    @GetMapping
    public String Index(Model model) {

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<List<Usuario>> response =
                restTemplate.exchange(
                        rutaBase + "/Usuario/200",
                        HttpMethod.GET,
                        HttpEntity.EMPTY,
                        new ParameterizedTypeReference<List<Usuario>>() {}
                );

        if(response.getStatusCode().value() == 200){
            model.addAttribute("usuarios", response.getBody());
        }

        return "GetAll";
    }

    @GetMapping("/GetById/{id}")
    @ResponseBody
    public Result getByIdJSON(@PathVariable("id") int id) {

        RestTemplate restTemplate = new RestTemplate();

        Result result = restTemplate.getForObject(
                rutaBase + "/Usuario/GetById/" + id,
                Result.class
        );

        return result;
    }
    
    @PostMapping("/GetByFilter")
    public String getByFilter(Usuario usuario, Model model) {

        RestTemplate restTemplate = new RestTemplate();

        HttpEntity<Usuario> request = new HttpEntity<>(usuario);

        ResponseEntity<List<Usuario>> response =
                restTemplate.exchange(
                        rutaBase + "/Usuario/GetByFilter",
                        HttpMethod.POST,
                        request,
                        new ParameterizedTypeReference<List<Usuario>>() {}
                );

        if(response.getStatusCode().is2xxSuccessful()){
            model.addAttribute("usuarios", response.getBody());
        }

        return "GetAll";
    }
    
    @GetMapping("form")
    public String Accion(Model model) {

        RestTemplate restTemplate = new RestTemplate();

        Usuario usuario = new Usuario();

        usuario.setDireccion(new ArrayList<>());
        Direccion direccion = new Direccion();

        Pais pais = new Pais();
        Estado estado = new Estado();
        estado.setPais(pais);

        Municipio municipio = new Municipio();
        municipio.setEstado(estado);

        Colonia colonia = new Colonia();
        colonia.setMunicipio(municipio);

        direccion.setColonia(colonia);

        usuario.getDireccion().add(direccion);

        model.addAttribute("usuario", usuario);

        ResponseEntity<Pais[]> responsePaises =
                restTemplate.getForEntity(rutaBase + "/Pais", Pais[].class);

        List<Pais> paises = Arrays.asList(responsePaises.getBody());
        model.addAttribute("paises", paises);

        ResponseEntity<Rol[]> responseRoles =
                restTemplate.getForEntity(rutaBase + "/Rol", Rol[].class);

        List<Rol> roles = Arrays.asList(responseRoles.getBody());
        model.addAttribute("roles", roles);

        return "formulario";
    }
    

//    
//    @PostMapping("/update")
//    public String Update(@ModelAttribute Usuario usuario, RedirectAttributes redirectAttributes) {      
//
//        Result result = usuarioDAOJPAImplementation.Update(usuario);
//
//        if (result.correct) {
//            redirectAttributes.addFlashAttribute("success", "Usuario actualizado correctamente");
//        } else {
//            redirectAttributes.addFlashAttribute("error", "Error al actualizar el usuario");
//        }
//
//        return "redirect:/Usuario";
//    }
//    
//    @PostMapping("/GuardarDireccion")
//    public String GuardarDireccion(@ModelAttribute Direccion direccion, RedirectAttributes redirectAttributes) {
//
//        Result result = direccionDAOJPAImplementation.Update(direccion);
//
//        if (result.correct) {redirectAttributes.addFlashAttribute("success","Dirección actualizada correctamente");
//        } else {
//            redirectAttributes.addFlashAttribute("error","Error al actualizar la dirección");
//        }
//
//        return "redirect:/Usuario";
//    }
//    
//    @PostMapping("/ActualizarFoto")
//    public String ActualizarFoto(@RequestParam("idUsuario") int idUsuario, @RequestParam("archivoFoto") MultipartFile foto, RedirectAttributes redirectAttributes) {
//
//        try {
//
//            if (!foto.isEmpty()) {
//
//                String tipo = foto.getContentType();
//
//                if ("image/jpeg".equals(tipo) || "image/png".equals(tipo)) {
//
//                    byte[] bytes = foto.getBytes();
//                    String base64 = Base64.getEncoder().encodeToString(bytes);
//                    String imagenFinal = "data:" + tipo + ";base64," + base64;
//
//                    Result result = usuarioDAOJPAImplementation.UpdateFoto(idUsuario, imagenFinal);
//
//                    if (result.correct) {
//                        redirectAttributes.addFlashAttribute("success", "Foto actualizada correctamente");
//                    } else {
//                        redirectAttributes.addFlashAttribute("error", "Error al actualizar la foto");
//                    }
//
//                } else {
//                    redirectAttributes.addFlashAttribute("error", "Solo JPG o PNG");
//                }
//            }
//
//        } catch (Exception e) {
//            redirectAttributes.addFlashAttribute("error", "Error al procesar la imagen");
//        }
//
//        return "redirect:/Usuario";
//    }
//    
//    @PostMapping("/delete")
//    public String eliminarUsuario(@RequestParam("idUsuario") int idUsuario, RedirectAttributes redirectAttributes) {
//
//        Result result = usuarioDAOJPAImplementation.Delete(idUsuario);
//
//        redirectAttributes.addFlashAttribute("success",
//                "Usuario eliminado correctamente");
//
//        return "redirect:/Usuario";
//    }
//    
//    @PostMapping("/Direccion/delete")
//    public String eliminarDireccion(@RequestParam("idDireccion") int idDireccion, RedirectAttributes redirectAttributes) {
//
//        Result result = direccionDAOJPAImplementation.DeleteDireccion(idDireccion);
//
//        if (result.correct) {
//            redirectAttributes.addFlashAttribute("success",
//                    "Dirección eliminada correctamente");
//        } else {
//            redirectAttributes.addFlashAttribute("error",
//                    "Error al eliminar la dirección");
//        }
//
//        return "redirect:/Usuario";
//    }
//
//    @GetMapping("/cargamasiva")
//    public String CargaMasiva() {
//        return "CargaMasiva";
//    }
//    
//    @PostMapping("/cargamasiva")
//    public String CargaMasiva(@RequestParam("archivo") MultipartFile archivo, Model model, HttpSession session) {
//
//        List<Usuario> usuarios = null;
//        List<ErroresArchivo> errores = new ArrayList<>();
//
//        try {
//
//            if (archivo != null && !archivo.isEmpty()) {
//
//                String rutaBase = System.getProperty("user.home");
//                String rutaCarpeta = "Documents" + File.separator + "archivosCM";
//                
//                String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
//                String nombreArchivo = fecha + archivo.getOriginalFilename();
//                String rutaArchivo = rutaBase + "/" + rutaCarpeta + "/" + nombreArchivo;
//
//                String extension = archivo.getOriginalFilename().split("\\.")[1];
//
//                archivo.transferTo(new File(rutaArchivo));
//
//                File file = new File(rutaArchivo);
//
//                if (extension.equalsIgnoreCase("txt")) {
//
//                    usuarios = LecturaArchivoTxt(file);
//
//                } else if (extension.equalsIgnoreCase("xlsx")) {
//
//                    usuarios = LecturaArchivoExcel(file);
//
//                } else {
//
//                    model.addAttribute("exito", false);
//                    model.addAttribute("mensaje","Extensión no válida");
//                    return "CargaMasiva";
//                }
//
//                if (usuarios != null) {
//
//                    errores = ValidarDatos(usuarios);
//
//                    if (errores.isEmpty()) {
//
//                        session.setAttribute("usuariosCM", usuarios);
//
//                        model.addAttribute("exito", true);
//
//                    } else {
//
//                        model.addAttribute("exito", false);
//
//                    }
//
//                }
//
//            }
//
//        } catch (Exception ex) {
//
//            ex.printStackTrace();
//            model.addAttribute("mensaje", "Error al procesar archivo");
//
//        }
//
//        model.addAttribute("errores", errores);
//        model.addAttribute("usuarios", usuarios);
//
//        return "CargaMasiva";
//    }
//    
//
//    public List<Usuario> LecturaArchivoTxt(File file) {
//
//        List<Usuario> usuarios = new ArrayList<>();
//
//        try (BufferedReader bufferedReader = new BufferedReader( new FileReader(file))) {
//
//            String linea;
//            int numeroLinea = 1;
//
//            while ((linea = bufferedReader.readLine()) != null) {
//
//                if (linea.trim().isEmpty()) {
//                    numeroLinea++;
//                    continue;
//                }
//
//                String[] datos = linea.split("\\|");
//
//                if (datos.length < 16) {
//                    System.out.println("Línea incompleta: " + numeroLinea);
//                    numeroLinea++;
//                    continue;
//                }
//
//                Usuario usuario = new Usuario();
//
//                usuario.setNombre(datos[0].trim());
//                usuario.setApellidoPaterno(datos[1].trim());
//                usuario.setApellidosMaterno(datos[2].trim());
//                usuario.setEmail(datos[3].trim());
//
//                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//                sdf.setLenient(false);
//                usuario.setFechaNacimiento(sdf.parse(datos[4].trim()));
//
//                usuario.setTelefono(datos[5].trim());
//                usuario.setCelular(datos[6].trim());
//                usuario.setUserName(datos[7].trim());
//                usuario.setSexo(datos[8].trim());
//                usuario.setPassword(datos[9].trim());
//                usuario.setCURP(datos[10].trim());
//
//                Rol rol = new Rol();
//                rol.setIdRol(Integer.parseInt(datos[11].trim()));
//                usuario.setRol(rol);
//
//                Direccion direccion = new Direccion();
//                direccion.setCalle(datos[12].trim());
//                direccion.setNumeroExterior(datos[13].trim());
//                direccion.setNumeroIInteriori(datos[14].trim());
//
//                Colonia colonia = new Colonia();
//                colonia.setIdColonia(Integer.parseInt(datos[15].trim()));
//                direccion.setColonia(colonia);
//
//                if (usuario.getDireccion() == null) {
//                    usuario.setDireccion(new ArrayList<>());
//                }
//
//                usuario.getDireccion().add(direccion);
//
//                usuarios.add(usuario);
//                numeroLinea++;
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return usuarios;
//    }
//    
//    public List<Usuario> LecturaArchivoExcel(File file) {
//
//        List<Usuario> usuarios = new ArrayList<>();
//
//        try (Workbook workbook = new XSSFWorkbook(file)) {
//
//            Sheet sheet = workbook.getSheetAt(0);
//
//            DataFormatter formatter = new DataFormatter();
//
//            int numeroFila = 0;
//
//            for (Row row : sheet) {
//
//                if (numeroFila == 0) {
//                    numeroFila++;
//                    continue;
//                }
//
//                Usuario usuario = new Usuario();
//
//                usuario.setNombre(formatter.formatCellValue(row.getCell(0)).trim());
//                usuario.setApellidoPaterno(formatter.formatCellValue(row.getCell(1)).trim());
//                usuario.setApellidosMaterno(formatter.formatCellValue(row.getCell(2)).trim());
//                usuario.setEmail(formatter.formatCellValue(row.getCell(3)).trim());
//
//                Cell celdaFecha = row.getCell(4);
//
//                if (celdaFecha != null) {
//
//                    if (celdaFecha.getCellType() == CellType.NUMERIC) {
//
//                        usuario.setFechaNacimiento(celdaFecha.getDateCellValue());
//
//                    } else {
//
//                        String fechaTexto = formatter.formatCellValue(celdaFecha).trim();
//
//                        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
//                        usuario.setFechaNacimiento(sdf.parse(fechaTexto));
//                    }
//                }
//
//                usuario.setTelefono(formatter.formatCellValue(row.getCell(5)).trim());
//                usuario.setCelular(formatter.formatCellValue(row.getCell(6)).trim());
//
//                usuario.setUserName(formatter.formatCellValue(row.getCell(7)).trim());
//                usuario.setSexo(formatter.formatCellValue(row.getCell(8)).trim());
//                usuario.setPassword(formatter.formatCellValue(row.getCell(9)).trim());
//                usuario.setCURP(formatter.formatCellValue(row.getCell(10)).trim());
//
//                Rol rol = new Rol();
//                rol.setIdRol(Integer.parseInt(formatter.formatCellValue(row.getCell(11))));
//                usuario.setRol(rol);
//
//                Direccion direccion = new Direccion();
//                direccion.setCalle(formatter.formatCellValue(row.getCell(12)).trim());
//                direccion.setNumeroExterior(formatter.formatCellValue(row.getCell(13)).trim());
//                direccion.setNumeroIInteriori(formatter.formatCellValue(row.getCell(14)).trim());
//
//                Colonia colonia = new Colonia();
//                colonia.setIdColonia(Integer.parseInt(formatter.formatCellValue(row.getCell(15))));
//                direccion.setColonia(colonia);
//
//                usuario.setDireccion(new ArrayList<>());
//                usuario.getDireccion().add(direccion);
//
//                usuarios.add(usuario);
//
//                numeroFila++;
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return usuarios;
//    }
//    
//    public List<ErroresArchivo> ValidarDatos(List<Usuario> usuarios) {
//
//        List<ErroresArchivo> errores = new ArrayList<>();
//
//        int numeroLinea = 1;
//
//        for (Usuario usuario : usuarios) {
//
//            Set<ConstraintViolation<Usuario>> violaciones = validator.validate(usuario);
//
//            for (ConstraintViolation<Usuario> violacion : violaciones) {
//
//                ErroresArchivo error = new ErroresArchivo();
//                error.setFila(numeroLinea);
//                error.setDato(violacion.getPropertyPath().toString());
//                error.setDescripcion(violacion.getMessage());
//
//                errores.add(error);
//            }
//
//            numeroLinea++;
//        }
//
//        return errores;
//    }
//    
//    @GetMapping("/cargamasiva/procesar")
//    public String ProcesarCargaMasiva(HttpSession session, RedirectAttributes redirectAttributes) {
//
//        List<Usuario> usuarios = (List<Usuario>) session.getAttribute("usuariosCM");
//
//        if (usuarios == null || usuarios.isEmpty()) {
//            redirectAttributes.addFlashAttribute("mensaje", "No hay archivo para procesar");
//            redirectAttributes.addFlashAttribute("tipo", "warning");
//            return "redirect:/Usuario/cargamasiva";
//        }
//
//        Result result = usuarioDAOImplementation.AddAll(usuarios);
//
//        if (result.correct) {
//            redirectAttributes.addFlashAttribute("mensaje", "Carga masiva completada exitosamente");
//            redirectAttributes.addFlashAttribute("tipo", "success");
//            redirectAttributes.addFlashAttribute("correctos", usuarios.size());
//            redirectAttributes.addFlashAttribute("incorrectos", 0);
//        } else {
//            redirectAttributes.addFlashAttribute("mensaje", "Error al procesar la carga: " + result.errorMessage);
//            redirectAttributes.addFlashAttribute("tipo", "danger");
//        }
//
//        session.removeAttribute("usuariosCM");
//        return "redirect:/Usuario";
//    }
//    
//    @GetMapping("form")
//    public String Accion(Model model) {
//        
//
//        Usuario usuario = new Usuario();
//
//        usuario.setDireccion(new ArrayList<>());
//        Direccion direccion = new Direccion();
//
//        Pais pais = new Pais();
//        Estado estado = new Estado();
//        estado.setPais(pais);
//        Municipio municipio = new Municipio();
//        municipio.setEstado(estado);
//        Colonia colonia = new Colonia();
//        colonia.setMunicipio(municipio);
//
//        direccion.setColonia(colonia);
//
//        usuario.getDireccion().add(direccion);
//
//        model.addAttribute("usuario", usuario);
//
//        Result resultPaises = paisDAOImplementation.GetAll();
//        model.addAttribute("paises", resultPaises.objects);
//
//        Result resultRoles = rolDAOImplementation.GetAll();
//        model.addAttribute("roles", resultRoles.objects);
//
//        return "formulario"; 
//    }
//    
//   @PostMapping("form")
//    public String Accion(@Valid @ModelAttribute("usuario") Usuario usuario, BindingResult bindingResult, @RequestParam(value = "archivoFoto", required = false) MultipartFile foto, Model model) {
//
//
//        if (foto != null && !foto.isEmpty()) {
//            String tipo = foto.getContentType();
//
//            if ("image/jpeg".equals(tipo) || "image/png".equals(tipo)) {
//                try {
//                    byte[] bytes = foto.getBytes();
//                    String base64 = Base64.getEncoder().encodeToString(bytes);
//                    String imagenFinal = "data:" + tipo + ";base64," + base64;
//                    usuario.setFoto(imagenFinal);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                    bindingResult.rejectValue("foto", "error.usuario", "Error al procesar la imagen");
//                }
//            } else {
//                bindingResult.rejectValue("foto", "error.usuario", "Solo se permiten imágenes JPG o PNG");
//            }
//        }
//
//        if (bindingResult.hasErrors()) {
//
//            model.addAttribute("paises", paisDAOImplementation.GetAll().objects);
//            model.addAttribute("roles", rolDAOImplementation.GetAll().objects);
//
//
//            model.addAttribute("abrirModalUsuario", true); 
//            model.addAttribute("error", "Corrige los errores del formulario");
//
//
//            if (usuario.getDireccion() == null || usuario.getDireccion().isEmpty()) {
//                Direccion direccion = new Direccion();
//                Colonia colonia = new Colonia();
//                Municipio municipio = new Municipio();
//                Estado estado = new Estado();
//                Pais pais = new Pais();
//                estado.setPais(pais);
//                municipio.setEstado(estado);
//                colonia.setMunicipio(municipio);
//                direccion.setColonia(colonia);
//                usuario.setDireccion(new ArrayList<>());
//                usuario.getDireccion().add(direccion);
//            }
//
//            model.addAttribute("usuario", usuario); 
//            return "formulario";
//        }
//
//        Result result = usuarioDAOJPAImplementation.Add(usuario);
//
//        if (result.correct) {
//            model.addAttribute("success", "Usuario agregado correctamente");
//            return "redirect:/Usuario";
//        } else {
//
//            model.addAttribute("error", "Error al agregar el usuario");
//
//            model.addAttribute("paises", paisDAOImplementation.GetAll().objects);
//            model.addAttribute("roles", rolDAOImplementation.GetAll().objects);
//            model.addAttribute("usuario", usuario);
//            return "formulario";    
//        }
//
//    }
//    
//    @GetMapping("/Detalle")
//    public String detalleUsuario(@RequestParam("id") int idUsuario, Model model) {
//
//        Usuario usuario = new Usuario();
//        
//        model.addAttribute("paises", paisDAOImplementation.GetAll().objects);
//        model.addAttribute("roles", rolDAOImplementation.GetAll().objects);
//
//
//        Result result = usuarioDAOJPAImplementation.GetAll();
//
//        if (result.objects != null) {
//            for (Object obj : result.objects) {
//                Usuario u = (Usuario) obj;
//                if (u.getIdUsuario() == idUsuario) {
//                    usuario = u;
//                    break;
//                }
//            }
//        }
//
//        model.addAttribute("usuario", usuario);
//
//        return "UsuarioDetalle";
//    }
//
//    @PostMapping("/DetalleUpdate")
//    public String DetalleUpdate(@ModelAttribute Usuario usuario, RedirectAttributes redirectAttributes) {      
//
//        Result result = usuarioDAOJPAImplementation.Update(usuario);
//
//        if (result.correct) {
//            redirectAttributes.addFlashAttribute("success", "Usuario actualizado correctamente");
//        } else {
//            redirectAttributes.addFlashAttribute("error", "Error al actualizar el usuario");
//        }
//
//        return "redirect:/Usuario/Detalle?id=" + usuario.getIdUsuario();
//    }
//    
//    @PostMapping("/DetalleGuardarDireccion")
//    public String DetalleGuardarDireccion(@ModelAttribute Direccion direccion, RedirectAttributes redirectAttributes) {
//
//        Result result = direccionDAOJPAImplementation.Update(direccion);
//
//        if (result.correct) {redirectAttributes.addFlashAttribute("success","Dirección actualizada correctamente");
//        } else {
//            redirectAttributes.addFlashAttribute("error","Error al actualizar la dirección");
//        }
//
//        return "redirect:/Usuario/Detalle?id=" + direccion.getIdUsuario();
//    }
//    
//    @PostMapping("/DetalleActualizarFoto")
//    public String DetalleActualizarFoto(@RequestParam("idUsuario") int idUsuario, @RequestParam("archivoFoto") MultipartFile foto, RedirectAttributes redirectAttributes) {
//
//        try {
//
//            if (!foto.isEmpty()) {
//
//                String tipo = foto.getContentType();
//
//                if ("image/jpeg".equals(tipo) || "image/png".equals(tipo)) {
//
//                    byte[] bytes = foto.getBytes();
//                    String base64 = Base64.getEncoder().encodeToString(bytes);
//                    String imagenFinal = "data:" + tipo + ";base64," + base64;
//
//                    Result result = usuarioDAOJPAImplementation.UpdateFoto(idUsuario, imagenFinal);
//
//                    if (result.correct) {
//                        redirectAttributes.addFlashAttribute("success", "Foto actualizada correctamente");
//                    } else {
//                        redirectAttributes.addFlashAttribute("error", "Error al actualizar la foto");
//                    }
//
//                } else {
//                    redirectAttributes.addFlashAttribute("error", "Solo JPG o PNG");
//                }
//            }
//
//        } catch (Exception e) {
//            redirectAttributes.addFlashAttribute("error", "Error al procesar la imagen");
//        }
//
//        return "redirect:/Usuario/Detalle?id=" + idUsuario;
//    }
//
//
//    @GetMapping("Formulario")
//    public String formUsuaFormulariorio(
//            @RequestParam(required = false) Integer id,
//            Model model) {
//        
//        Usuario usuario = new Usuario();
//
//        model.addAttribute("paises", paisDAOImplementation.GetAll().objects);
//        model.addAttribute("roles", rolDAOImplementation.GetAll().objects);
//
//        if (id != null) {
//            Result result = usuarioDAOImplementation.GetAll();
//            if (result.objects != null) {
//                for (Object obj : result.objects) {
//                    Usuario u = (Usuario) obj;
//                    if (u.getIdUsuario() == id) {
//                        usuario = u;
//                        break;
//                    }
//                }
//            }
//        }
//
//        model.addAttribute("usuario", usuario);
//        return "formulario";
//    }
//
//    
//    @GetMapping("getEstadosByPais/{IdPais}")
//    @ResponseBody
//    public Result getEstadosByPais(@PathVariable("IdPais") int IdPais){
//        
//        Result result = estadoDAOImplementation.getEstadosByPais(IdPais);
//                
//        return result;
//    }
//    
//    @GetMapping("getMunicipioByEstado/{IdEstado}")
//    @ResponseBody 
//    public Result getMunicipioByEstado(@PathVariable("IdEstado") int IdEstado){
//        
//        Result result = municipioDAOImplementation.getMunicipioByEstado(IdEstado);
//
//        return result;
//    }
//    
//    @GetMapping("getColoniaByMunicipios/{IdMunicipio}")
//    @ResponseBody 
//    public Result getColoniaByMunicipios(@PathVariable("IdMunicipio") int IdMunicipio){
//        
//        Result result = coloniaDAOImplementation.getColoniaByMunicipios(IdMunicipio);
//
//        return result;
//    }
//    
//    @GetMapping("getDireccionByCP/{CodigoPostal}")
//    @ResponseBody
//    public Result getDireccionByCP(@PathVariable String CodigoPostal) {
//        
//        Result result = coloniaDAOImplementation.getDireccionByCP(CodigoPostal);
//        
//        return result;
//    }
//    
//    @PostMapping("/Usuario/UpdateStatus")
//    @ResponseBody
//    public Result UpdateStatus(@RequestParam int idUsuario, @RequestParam int status) {
//
//        Result result = usuarioDAOImplementation.UpdateStatus(idUsuario, status);
//
//        return result;
//    }
//
}
