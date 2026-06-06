package com.consult.backend.service;

import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.Invoice;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${consult21.admin-email}")
    private String adminEmail;
    /*
     =========================================
     SEND OTP EMAIL
     =========================================
    */
    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Consult21 Password Reset OTP");

        message.setText(
                "Your OTP for password reset is: " + otp +
                        "\n\nThis OTP will expire in 5 minutes." +
                        "\n\nDo not share this OTP with anyone."
        );

        mailSender.send(message);
    }

    /*
     =========================================
     ADMIN EMAIL AFTER SUCCESSFUL PAYMENT
     =========================================
    */
    public void sendPaymentSuccessNotification(ConsultationRequest consultation, Invoice invoice) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(adminEmail);

            helper.setSubject("New Paid Consultation - ID: " + consultation.getId());

            String answersText;

            if (consultation.getAnswersJson() != null) {
                // Proper Consultation
                answersText = formatAnswersForEmail(consultation.getAnswersJson());
            } else {
                // Quick Consultation
                answersText = formatQuickConsultation(consultation);
            }

            StringBuilder emailBody = new StringBuilder();

            emailBody.append("A new consultation has been successfully booked.\n\n")
                    .append("Consultation ID: ").append(consultation.getId()).append("\n")
                    .append("User Email (Account): ").append(consultation.getUser().getEmail()).append("\n");


            if (consultation.getName() != null && !consultation.getName().trim().isEmpty()){
                emailBody.append("Name: ").append(consultation.getName()).append("\n");
            }

            if (consultation.getContactInfo() != null) {
                emailBody.append("Contact Info (User Input): ")
                        .append(consultation.getContactInfo())
                        .append("\n");
            }

            emailBody.append("Category: ").append(consultation.getCategory().getName()).append("\n")
                    .append("Amount Paid: ₹").append(consultation.getPaymentOrder().getAmount()).append("\n")
                    .append("Status: ")
                    .append(
                            consultation
                                    .getPaymentOrder()
                                    .getStatus()
                    )
                    .append("\n\n")
                    .append("User Responses:\n")
                    .append("--------------------------\n")
                    .append(answersText)
                    .append("\n\nPlease review this consultation request.");

            helper.setText(emailBody.toString(), false);

            if (invoice != null && invoice.getPdfUrl() != null) {

                FileSystemResource pdf = new FileSystemResource(new File( invoice.getPdfUrl() ));

                helper.addAttachment(invoice.getInvoiceNumber() + ".pdf", pdf);
            }

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Failed to send admin payment email: " + e.getMessage());
        }
    }

    private String formatQuickConsultation(ConsultationRequest consultation) {

        return "Name : " + consultation.getName() + "\n" +
                "Contact : " + consultation.getContactInfo() + "\n" +
                "Question : " + consultation.getQuickQuestion() + "\n";
    }
    /*
     =========================================
     USER CONFIRMATION EMAIL
     =========================================
    */
    public void sendUserConsultationConfirmation(ConsultationRequest consultation, Invoice invoice) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(consultation.getUser().getEmail());

            helper.setSubject("Consult21 Consultation Confirmation");

            message.setText(
                    "Hello,\n\n" +

                            "Your consultation has been successfully booked.\n\n" +

                            "Consultation ID: " + consultation.getId() + "\n" +
                            "Category: " + consultation.getCategory().getName() + "\n" +
                            "Amount Paid: ₹" + consultation.getPaymentOrder().getAmount() + "\n\n" +
                            "\n\nInvoice Number: " + invoice.getInvoiceNumber() +
                            "Our experts will review your request and respond within 24–48 hours.\n\n" +

                            "Thank you for choosing Consult21."
            );

            if ( invoice.getPdfUrl() != null) {

                FileSystemResource pdf = new FileSystemResource(new File(invoice.getPdfUrl()));

                helper.addAttachment(invoice.getInvoiceNumber() + ".pdf", pdf);
            }

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Failed to send user confirmation email: " + e.getMessage());
        }
    }


    /*
     =========================================
     FORMAT ANSWERS JSON FOR EMAIL
     =========================================
    */
    private String formatAnswersForEmail(Map<String, Object> answers) {

        StringBuilder formatted = new StringBuilder();

        for (Map.Entry<String, Object> entry : answers.entrySet()) {

            formatted
                    .append(entry.getKey())
                    .append(" : ")
                    .append(entry.getValue())
                    .append("\n");
        }

        return formatted.toString();
    }
}
