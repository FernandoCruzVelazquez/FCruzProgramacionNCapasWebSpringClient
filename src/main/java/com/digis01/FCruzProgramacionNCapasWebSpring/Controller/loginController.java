package com.digis01.FCruzProgramacionNCapasWebSpring.Controller;

import com.digis01.FCruzProgramacionNCapasWebSpring.ML.Usuario;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@Controller
public class loginController {

    private final String URL_API = "http://192.167.0.214:8080";

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password,
                        HttpSession session) {

        RestTemplate restTemplate = new RestTemplate();

        String url = URL_API + "/auth/login";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = "{ \"username\": \"" + username + "\", \"password\": \"" + password + "\" }";

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            String token = (String) response.getBody().get("token");

            session.setAttribute("token", token);

            HttpHeaders headersUser = new HttpHeaders();
            headersUser.set("Authorization", "Bearer " + token);

            HttpEntity<String> entity = new HttpEntity<>(headersUser);

            ResponseEntity<Usuario> userResponse = restTemplate.exchange(
                    URL_API + "/Usuario/perfil",
                    HttpMethod.GET,
                    entity,
                    Usuario.class
            );

            session.setAttribute("usuario", userResponse.getBody());

            return "redirect:/Usuario";

        } catch (Exception e) {
            return "redirect:/login?error=true";
        }
    }

    
    @PostMapping("/logout") 
    public String logout(HttpSession session) {
        session.invalidate(); 
        return "redirect:/login?logout";
    }
}