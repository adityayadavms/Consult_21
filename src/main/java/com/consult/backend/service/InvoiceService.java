package com.consult.backend.service;

import com.consult.backend.entity.Invoice;
import com.consult.backend.repository.InvoiceRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import com.consult.backend.entity.PaymentOrder;
import com.consult.backend.entity.ConsultationRequest;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;



@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public String generateInvoiceNumber() {

        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);

        Optional<Invoice> latestInvoice = invoiceRepository.findTopByOrderByIdDesc();

        long nextSequence = 1;

        if (latestInvoice.isPresent()) {
            nextSequence = latestInvoice.get().getId() + 1;
        }

        return String.format("INV-%s-%05d", today, nextSequence);
    }


    public String generateInvoicePdf(PaymentOrder paymentOrder ,  String invoiceNumber) {

        try {

            Path directory = Paths.get("uploads", "invoices");

            try {
                Files.createDirectories(directory);
            } catch (IOException e) {
                throw new RuntimeException("Failed to create invoice directory", e);
            }


            String filePath = directory.resolve(invoiceNumber + ".pdf").toString();

            ConsultationRequest consultation = paymentOrder.getConsultationRequest();

            try (PDDocument document = new PDDocument()) {
                PDPage page = new PDPage();

                document.addPage(page);

                try (PDPageContentStream content = new PDPageContentStream(document, page)) {

                    content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

                    content.beginText();

                    content.newLineAtOffset(50, 750);

                    content.showText("CONSULT21 PAYMENT INVOICE");

                    content.newLineAtOffset(0, -30);

                    content.showText("Invoice Number: " + invoiceNumber);

                    content.newLineAtOffset(0, -20);

                    content.showText("Consultation ID: " + consultation.getId());

                    content.newLineAtOffset(0, -20);

                    content.showText("Customer: " + consultation.getUser().getName());

                    content.newLineAtOffset(0, -20);

                    content.showText("Email: " + consultation.getUser().getEmail());

                    content.newLineAtOffset(0, -20);

                    content.showText("Amount: ₹" + paymentOrder.getAmount());

                    content.newLineAtOffset(0, -20);

                    content.showText("Status: " + paymentOrder.getStatus());

                    content.endText();



                    document.save(filePath);


                }

                document.save(filePath);
            }


            return filePath;

        }
        catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }


    @Transactional
    public Invoice generateInvoice(PaymentOrder paymentOrder) {

        Optional<Invoice> existingInvoice = invoiceRepository.findByPaymentOrder(paymentOrder);

        if (existingInvoice.isPresent()) {
            return existingInvoice.get();
        }
    /*
    =========================================
    GENERATE INVOICE NUMBER
    =========================================
    */

        String invoiceNumber = generateInvoiceNumber();

    /*
    =========================================
    GENERATE PDF
    =========================================
    */

        String pdfPath = generateInvoicePdf(paymentOrder, invoiceNumber);

    /*
    =========================================
    BUILD ENTITY
    =========================================
    */

        Invoice invoice = Invoice.builder()

                        .invoiceNumber(
                                invoiceNumber
                        )

                        .paymentOrder(
                                paymentOrder
                        )

                        .pdfUrl(
                                pdfPath
                        )

                        .generatedAt(
                                LocalDateTime.now()
                        )

                        .build();

    /*
    =========================================
    SAVE
    =========================================
    */

        return invoiceRepository.save(invoice);
    }

    @Transactional(readOnly = true)
    public Invoice getInvoice(String invoiceNumber){
        return invoiceRepository
                .findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

}
