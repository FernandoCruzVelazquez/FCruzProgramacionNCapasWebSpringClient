package com.digis01.FCruzProgramacionNCapasWebSpring.ML;



public class Direccion {
    
    private Integer idDireccion;
    private String calle;
    private String NumeroIInteriori;
    private String numeroExterior;
    public Colonia colonia;
    public Usuario usuario;
    private Integer IdUsuario;
    
    public Integer getIdDireccion(){
        return idDireccion;
    }
    
    public void setIdDireccion(Integer IdDireccion){
        this.idDireccion = IdDireccion;
    }
    
    public String getCalle(){
        return calle;
    }
    
    public void setCalle(String Calle){
        this.calle = Calle;
    }
    
    public String getNumeroIInteriori (){
        return NumeroIInteriori;
    }
    
    public void setNumeroIInteriori(String NumeroIInteriori){
        this.NumeroIInteriori = NumeroIInteriori;
    }
    
    public String getNumeroExterior(){
        return numeroExterior;
    }
    
    public void setNumeroExterior(String NumeroExterior){
        this.numeroExterior = NumeroExterior;
    }

    public Colonia getColonia() {
        return colonia;
    }

    public void setColonia(Colonia Colonia) {
        this.colonia = Colonia;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public Integer getIdUsuario() {
        return IdUsuario;
    }

    public void setIdUsuario(Integer IdUsuario) {
        this.IdUsuario = IdUsuario;
    }

}
