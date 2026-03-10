package com.digis01.FCruzProgramacionNCapasWebSpring.ML;

public class ErroresArchivo {

    int fila;
    String dato;
    String descripcion;

    public ErroresArchivo() {
    }

    public ErroresArchivo(int fila, String dato, String descripcion) {
        this.fila = fila;
        this.dato = dato;
        this.descripcion = descripcion;
    }
    
    public int getFila() {
        return fila;
    }

    public void setFila(int fila) {
        this.fila = fila;
    }

    public String getDato() {
        return dato;
    }

    public void setDato(String dato) {
        this.dato = dato;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
}
