package com.digis01.FCruzProgramacionNCapasWebSpring.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("demo")
public class DemoController {

    @GetMapping("saludo")
    public String Test(@RequestParam String nombre , Model model){
        model.addAttribute("nombre", nombre);
        return "HolaMundo";
    }
    
    @GetMapping("saludo/{nombre}")
    public String Test2(@PathVariable("nombre") String nombre , Model model){
        model.addAttribute("nombre", nombre);
        return "HolaMundo";
    }
    
    
    
    
}
