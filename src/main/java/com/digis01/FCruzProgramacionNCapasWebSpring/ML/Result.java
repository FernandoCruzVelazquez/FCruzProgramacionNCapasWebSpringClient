package com.digis01.FCruzProgramacionNCapasWebSpring.ML;

import java.util.List;

public class Result {
    public boolean correct;
    public String errorMessage;
    public Exception ex;
    public Object object; 
    public List<Object> objects; 
    
    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }

    public List<Object> getObjects() {
        return objects;
    }

    public void setObjects(List<Object> objects) {
        this.objects = objects;
    }
    
    
}
