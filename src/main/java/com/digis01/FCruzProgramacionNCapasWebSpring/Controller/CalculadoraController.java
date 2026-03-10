package com.digis01.FCruzProgramacionNCapasWebSpring.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("Calculadora")
public class CalculadoraController {

    @GetMapping("operacion")
    public String operacion(@RequestParam int n1,
                            @RequestParam int n2,
                            Model model) {

        model.addAttribute("n1", n1);
        model.addAttribute("n2", n2);

        // Factoriales
        model.addAttribute("factorialN1", factorial(n1));
        model.addAttribute("factorialN2", factorial(n2));

        return "suma";
    }

    private long factorial(int n) {
        long resultado = 1;
        for (int i = 1; i <= n; i++) {
            resultado *= i;
        }
        return resultado;
    }
}
