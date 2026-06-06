package com.consult.backend.Controller;


import com.consult.backend.entity.Invoice;
import com.consult.backend.service.InvoiceService;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;


    @GetMapping("/{invoiceNumber}")
    public ResponseEntity<Resource> downloadInvoice(@PathVariable String invoiceNumber) {
        String email = SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        Invoice invoice = invoiceService.getInvoice(invoiceNumber);

        String ownerEmail = invoice.getPaymentOrder()
                        .getConsultationRequest()
                        .getUser()
                        .getEmail();

        if (!ownerEmail.equals(email)) {

            throw new RuntimeException(
                    "Unauthorized invoice access"
            );
        }

        Path path = Paths.get(invoice.getPdfUrl());

        if (!Files.exists(path)) {
            throw new RuntimeException("Invoice file not found");
        }

        Resource resource;

        try {

            resource = new UrlResource(path.toUri());

        }
        catch (Exception e) {
            throw new RuntimeException("Failed to load invoice file", e);
        }

        if (!resource.exists()) {
            throw new RuntimeException("Invoice file not found");
        }


        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)

                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + invoice.getInvoiceNumber()
                                + ".pdf\""
                )

                .body(resource);
    }
}
