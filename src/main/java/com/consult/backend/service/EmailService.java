package com.consult.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

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
}
