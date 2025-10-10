package com.opsgrid.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value; 
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    
    @Value("${opsgrid.app.frontendUrl}")
    private String frontendUrl;

    public void sendInvitationEmail(String toEmail, String token) {
        String subject = "You're Invited to Join OpsGrid!";
        
        
        String invitationUrl = frontendUrl + "/set-password?token=" + token;
        
        String body = "You have been invited to join your team's OpsGrid platform.\n\n"
                    + "Please click the link below to set your password and activate your account:\n"
                    + invitationUrl + "\n\n"
                    + "This link will expire in 24 hours.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("opsgridproject@gmail.com"); 
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        System.out.println("Invitation email sent to " + toEmail);
    }
}