package com.digis01.FCruzProgramacionNCapasWebSpring.ML;

import java.util.List;

public class Estado {
    
    private Integer idEstado;
    private String nombre;
    public Pais pais;

    
    public Integer  getIdEstado(){
        return idEstado;
    }
    
    public void setIdEstado(Integer IdEstado){
        this.idEstado = IdEstado;
    }
    
    public String getNombre (){
        return nombre;
    }
    
    public void setNombre(String Nombre){
        this.nombre = Nombre;
    }

    public Pais getPais() {
        return pais;
    }

    public void setPais(Pais Pais) {
        this.pais = Pais;
    }

    

    

    
    
}
