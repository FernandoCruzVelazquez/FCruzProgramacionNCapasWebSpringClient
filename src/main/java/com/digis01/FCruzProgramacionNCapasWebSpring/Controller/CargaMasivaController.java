package com.digis01.FCruzProgramacionNCapasWebSpring.Controller;

import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Result;
import jakarta.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("CargaMasiva")
public class CargaMasivaController {
    
    private static String rutaBase = "http://192.167.1.23:8080/ApiCM";
    
    @GetMapping
    public String CargaMasiva() {
        return "CargaMasiva";
    }
    
    @PostMapping("Enviar")
    public String enviarAlService(@RequestParam("archivo") MultipartFile archivo, Model model, HttpSession session) { // <-- Agregamos HttpSession aquí
        try {
            String urlService = rutaBase + "/validar"; 

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("archivo", archivo.getResource());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Result> response = restTemplate.postForEntity(urlService, requestEntity, Result.class);

            if (response.getBody() != null && response.getBody().isCorrect()) {
                model.addAttribute("exito", true);
                session.setAttribute("keyArchivo", response.getBody().getObject());
            } else {
                model.addAttribute("errores", response.getBody().getObjects());
                model.addAttribute("exito", false);
            }
        } catch (Exception e) {
            model.addAttribute("exito", false);
            model.addAttribute("mensaje", "Error al conectar con el servicio: " + e.getMessage());
        }
        return "CargaMasiva";
    }
    
    @GetMapping("/Procesar")
    public String procesarArchivo(HttpSession session, RedirectAttributes redirectAttributes) {

        try {

            String key = (String) session.getAttribute("keyArchivo");

            if (key == null) {
                redirectAttributes.addFlashAttribute("mensaje", "No hay archivo para procesar");
                redirectAttributes.addFlashAttribute("tipo", "error");
                return "redirect:/Usuario";
            }

            String keyEncoded = URLEncoder.encode(key, StandardCharsets.UTF_8);

            String urlService = rutaBase + "/procesar/" + keyEncoded;

            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Result> response =
                    restTemplate.getForEntity(urlService, Result.class);

            if (response.getBody() != null && response.getBody().isCorrect()) {

                redirectAttributes.addFlashAttribute("mensaje", "Archivo procesado correctamente");
                redirectAttributes.addFlashAttribute("tipo", "success");

                redirectAttributes.addFlashAttribute("correctos", response.getBody().getCorrectos());
                redirectAttributes.addFlashAttribute("incorrectos", response.getBody().getIncorrectos());

            } else {

                redirectAttributes.addFlashAttribute("mensaje", "Error al procesar el archivo");
                redirectAttributes.addFlashAttribute("tipo", "error");

            }

        } catch (Exception e) {

            redirectAttributes.addFlashAttribute("mensaje", e.getMessage());
            redirectAttributes.addFlashAttribute("tipo", "error");

        }

        return "redirect:/Usuario";
    }
}
