package com.consult.backend.service;

import com.consult.backend.entity.ConsultationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
    public void sendPaymentSuccessNotification(ConsultationRequest consultation) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(adminEmail);
            message.setSubject("New Paid Consultation - ID: " + consultation.getId());

            String answersText = formatAnswersForEmail(consultation.getAnswersJson());

            message.setText(
                    "A new consultation has been successfully booked.\n\n" +

                            "Consultation ID: " + consultation.getId() + "\n" +
                            "User Email: " + consultation.getUser().getEmail() + "\n" +
                            "Category: " + consultation.getCategory().getName() + "\n" +
                            "Amount Paid: ₹" + consultation.getAmount() + "\n" +
                            "Payment ID: " + consultation.getRazorpayPaymentId() + "\n" +
                            "Status: PAID\n\n" +

                            "User Responses:\n" +
                            "--------------------------\n" +
                            answersText +
                            "\n\nPlease review this consultation request."
            );

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Failed to send admin payment email: " + e.getMessage());
        }
    }

    /*
     =========================================
     USER CONFIRMATION EMAIL
     =========================================
    */
    public void sendUserConsultationConfirmation(ConsultationRequest consultation) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(consultation.getUser().getEmail());
            message.setSubject("Consult21 Consultation Confirmation");

            message.setText(
                    "Hello,\n\n" +

                            "Your consultation has been successfully booked.\n\n" +

                            "Consultation ID: " + consultation.getId() + "\n" +
                            "Category: " + consultation.getCategory().getName() + "\n" +
                            "Amount Paid: ₹" + consultation.getAmount() + "\n\n" +

                            "Our experts will review your request and respond within 24–48 hours.\n\n" +

                            "Thank you for choosing Consult21."
            );

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
