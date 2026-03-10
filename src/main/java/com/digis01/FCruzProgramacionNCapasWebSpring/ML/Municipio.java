package com.digis01.FCruzProgramacionNCapasWebSpring.ML;

public class Municipio {
    
    private Integer idMunicipio;
    private String nombre;
    public Estado estado;
    
    public Integer  getIdMunicipio(){
        return idMunicipio;
    }
    
    public void setIdMunicipio(Integer IdMunicipio){
        this.idMunicipio = IdMunicipio;
    }
    
    public String getNombre(){
        return nombre;
    }
    
    public void setNombre(String Nombre){
        this.nombre = Nombre;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado Estado) {
        this.estado = Estado;
    }

    
}
