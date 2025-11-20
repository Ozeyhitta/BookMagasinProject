package com.bookmagasin.config;

import com.bookmagasin.enums.EStatusPayment;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class PaymentStatusConverter implements AttributeConverter<EStatusPayment, String> {

    @Override
    public String convertToDatabaseColumn(EStatusPayment attribute) {
        if (attribute == null) {
            return null;
        }
        return switch (attribute) {
            case UNPAID -> "U";
            case PENDING -> "P";
            case SUCCESS -> "S";
            case FAILED -> "F";
        };
    }

    @Override
    public EStatusPayment convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        String normalized = dbData.trim().toUpperCase();
        return switch (normalized) {
            case "U", "UNPAID" -> EStatusPayment.UNPAID;
            case "P", "PENDING" -> EStatusPayment.PENDING;
            case "S", "SUCCESS" -> EStatusPayment.SUCCESS;
            case "F", "FAILED" -> EStatusPayment.FAILED;
            default -> throw new IllegalArgumentException("Unknown payment status code: " + dbData);
        };
    }
}

