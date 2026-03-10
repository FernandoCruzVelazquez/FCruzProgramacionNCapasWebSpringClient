package com.digis01.FCruzProgramacionNCapasWebSpring.ML;

import java.util.List;


public class Colonia {
    private Integer idColonia;
    private String nombre;
    private String codigoPostal;
    public Municipio municipio;
    
    
    public Integer  getIdColonia(){
        return idColonia;
    }
    
    public void setIdColonia(Integer IdColonia){
        this.idColonia = IdColonia;
    }
    
    public String getNombre (){
        return nombre;
    }
    
    public void setNombre(String Nombre){
        this.nombre = Nombre;
    }
    
    public String getCodigoPostal(){
        return codigoPostal;
    }
    
    public void setCodigoPostal (String CodigoPostal){
        this.codigoPostal = CodigoPostal;
    }

    public Municipio getMunicipio() {
        return municipio;
    }

    public void setMunicipio(Municipio Municipio) {
        this.municipio = Municipio;
    }

    

    
    
    
}
