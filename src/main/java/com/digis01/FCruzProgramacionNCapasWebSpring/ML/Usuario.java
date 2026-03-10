package com.digis01.FCruzProgramacionNCapasWebSpring.ML;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;

public class Usuario {
    
    private int idUsuario;
    
    private String nombre;
    private String apellidoPaterno;
    private String apellidosMaterno;
    private String email;
    private Date fechaNacimiento;
    private String telefono;
    private String celular;
    private String userName;
    private String sexo;
    private String password;
    private String CURP;
    private String foto;
    private int status;
    public Rol rol;
    public List<Direccion> direccion;

    
    
    public Usuario() {
        this.direccion = new ArrayList<>();
    }

    public Usuario(int idUsuario, String nombre, String apellidoPaterno, String apellidosMaterno, String email, Date fechaNacimiento, String telefono, String celular, String UserName, String sexo, String password, String CURP, Rol Rol, List<Direccion> Direccion) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidosMaterno = apellidosMaterno;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.telefono = telefono;
        this.celular = celular;
        this.userName = UserName;
        this.sexo = sexo;
        this.password = password;
        this.CURP = CURP;
        this.rol = Rol;
        this.direccion = Direccion;
    }

    
    public int getIdUsuario(){
        return idUsuario;
    }
    
    public void setIdUsuario(int idUsuario){
        this.idUsuario = idUsuario;
    }
    
    public String getNombre(){
        return nombre;
    }
    
    public void setNombre(String nombre){
        this.nombre = nombre;
    }
    
    public String getApellidoPaterno(){
        return apellidoPaterno;
    }
    
    public void setApellidoPaterno(String apellidoPaterno){
        this.apellidoPaterno = apellidoPaterno;
    }
    
    public String getEmail(){
        return email;
    }
    
    public void setEmail(String email){
        this.email = email;
    }
    
    public Date getFechaNacimiento(){
        return fechaNacimiento;
    }
    
    public void setFechaNacimiento(Date fechaNacimiento){
        this.fechaNacimiento = fechaNacimiento;
    }
    
    public String getApellidosMaterno(){
        return apellidosMaterno;
    }
    
    public void setApellidosMaterno (String apellidosMaterno){
        this.apellidosMaterno = apellidosMaterno;
    }
    
    public String getUserName (){
        return userName;
    }
    
    public void setUserName (String UserName){
        this.userName = UserName;
    }
    
    public String getTelefono () {
        return telefono;
    }
    
    public void setTelefono (String telefono){
        this.telefono = telefono;
    }
    
    public String getCelular (){
        return celular;
    }
    
    public void setCelular (String celular){
        this.celular = celular;
    }
    
    public String getSexo (){
        return sexo;
    }
    
    public void setSexo (String sexo){
        this.sexo = sexo;
    }
    
    public String getPassword (){
        return password;
    }
    
    public void setPassword (String password){
        this.password = password;
    }
    
    public String getCURP (){
        return CURP;
    }
    
    public void setCURP (String CURP){
        this.CURP = CURP;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public List<Direccion> getDireccion() {
        return direccion;
    }

    public void setDireccion(List<Direccion> direccion) {
        this.direccion = direccion;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol (Rol rol) {
        this.rol = rol;
    }
    
    
}
