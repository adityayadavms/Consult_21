package com.consult.backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashfreeCustomerDetails {
    private String customerId;

    private String customerName;

    private String customerEmail;
}
