package com.digis01.FCruzProgramacionNCapasWebSpring.ML;



public class Direccion {
    
    private int idDireccion;
    private String calle;
    private String NumeroIInteriori;
    private String numeroExterior;
    public Colonia colonia;
    public Usuario Usuario;
    private int IdUsuario;
    
    public int getIdDireccion(){
        return idDireccion;
    }
    
    public void setIdDireccion(int IdDireccion){
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
        return Usuario;
    }

    public void setUsuario(Usuario Usuario) {
        this.Usuario = Usuario;
    }
    
    public int getIdUsuario() {
        return IdUsuario;
    }

    public void setIdUsuario(int IdUsuario) {
        this.IdUsuario = IdUsuario;
    }

}
