package com.enviro.assessment.junior.tebohothulaninyombolo.exception;

public class WithdrawalValidationException extends RuntimeException{

    public WithdrawalValidationException(String message) {
        super(message);
    }

    public WithdrawalValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
