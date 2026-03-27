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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;


@Controller
@RequestMapping("Usuario")
public class UsuarioController {

    private static String rutaBase = "http://192.167.0.214:8080/Api";

    @GetMapping
    public String Index(Model model, HttpSession session) {

        String token = (String) session.getAttribute("token");
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (token == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", usuario);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<List<Usuario>> response = restTemplate.exchange(
                rutaBase + "/Usuario",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Usuario>>() {}
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            model.addAttribute("usuarios", response.getBody());
        }

        ResponseEntity<Rol[]> responseRoles = restTemplate.exchange(
                rutaBase + "/Rol",
                HttpMethod.GET,
                entity,
                Rol[].class
        );

        model.addAttribute("roles", Arrays.asList(responseRoles.getBody()));

        ResponseEntity<Pais[]> responsePaises = restTemplate.exchange(
                rutaBase + "/Pais",
                HttpMethod.GET,
                entity, 
                Pais[].class
        );

        model.addAttribute("paises", Arrays.asList(responsePaises.getBody()));

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
    
    @PostMapping("/form")
    public String Accion(@ModelAttribute("usuario") Usuario usuario,  @RequestParam("archivoFoto") MultipartFile archivoFoto, RedirectAttributes redirectAttributes) {

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders(); headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();body.add("datos", usuario); 

            if (archivoFoto != null && !archivoFoto.isEmpty()) {
                body.add("imagen", archivoFoto.getResource());
            }

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Result> response = restTemplate.postForEntity(
                    rutaBase + "/Usuario", requestEntity, Result.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Result result = response.getBody();
                if (result != null && result.isCorrect()) {
                    redirectAttributes.addFlashAttribute("success", "¡Excelente! El usuario se guardó con éxito.");
                    return "redirect:/Usuario"; 
                } else {
                    String msg = (result != null) ? result.errorMessage : "No se pudo procesar la solicitud.";
                    redirectAttributes.addFlashAttribute("error", msg);
                }
            } else {
                redirectAttributes.addFlashAttribute("error", "El servicio no está disponible en este momento.");
            }

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            redirectAttributes.addFlashAttribute("error", "Error en el servidor: Inténtelo más tarde.");
            System.err.println("Detalle técnico: " + ex.getMessage()); 
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("error", "Ocurrió un problema de conectividad.");
            System.err.println("Excepción: " + ex.toString()); 
        }

        return "redirect:/Usuario/form";
    }
    
    @GetMapping("/Detalle")
    public String detalleUsuario(@RequestParam("id") int idUsuario, Model model){

        RestTemplate restTemplate = new RestTemplate();

        Result result = restTemplate.getForObject(
                rutaBase + "/Usuario/Detalle/" + idUsuario,
                Result.class
        );

        model.addAttribute("usuario", result.object);

        ResponseEntity<Pais[]> responsePaises =
                restTemplate.getForEntity(rutaBase + "/Pais", Pais[].class);

        model.addAttribute("paises", Arrays.asList(responsePaises.getBody()));

        ResponseEntity<Rol[]> responseRoles =
                restTemplate.getForEntity(rutaBase + "/Rol", Rol[].class);

        model.addAttribute("roles", Arrays.asList(responseRoles.getBody()));

        return "UsuarioDetalle";
    }
    
    
    @PostMapping("/DetalleGuardarDireccion")
    public String DetalleGuardarDireccion(@ModelAttribute Direccion direccion,
            RedirectAttributes redirectAttributes){

        RestTemplate restTemplate = new RestTemplate();

        HttpEntity<Direccion> request = new HttpEntity<>(direccion);

        ResponseEntity<Result> response = restTemplate.exchange(
                rutaBase + "/Direccion",
                HttpMethod.PUT,
                request,
                Result.class
        );

        if(response.getBody().isCorrect()){
            redirectAttributes.addFlashAttribute("success","Dirección actualizada correctamente");
        }else{
            redirectAttributes.addFlashAttribute("error","Error al actualizar la dirección");
        }

        return "redirect:/Usuario/Detalle?id=" + direccion.getIdUsuario();
    }
    
    
    

}
