package com.enviro.assessment.junior.tebohothulaninyombolo.exception;

public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s not found with id: %d", resourceName, id));
    }

    public ResourceNotFoundException(String resourceName) {
        super(String.format("%s not found", resourceName));
    }
}
