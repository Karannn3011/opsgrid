package com.opsgrid.backend;


import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner tempPasswordGenerator() {
		return args -> {
			PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
			String password = "admin123";
			String hashedPassword = passwordEncoder.encode(password);
			System.out.println("====================================================");
			System.out.println("Hashed password for '" + password + "' is: " + hashedPassword);
			System.out.println("====================================================");
		};
	}
}
