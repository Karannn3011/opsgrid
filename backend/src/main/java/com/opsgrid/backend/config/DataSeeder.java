package com.opsgrid.backend.config;

import com.github.javafaker.Faker;
import com.opsgrid.backend.entity.*;
import com.opsgrid.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TruckRepository truckRepository;
    private final DriverRepository driverRepository;
    private final ShipmentRepository shipmentRepository;
    private final IssueRepository issueRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (companyRepository.count() == 0) {
            System.out.println("No companies found. Seeding initial data...");
            seedCompanies();
        } else {
            System.out.println("Data already exists. Skipping seeding.");
        }
    }

    private void seedCompanies() {
        Faker faker = new Faker(new Locale("en-US"));

        // Create 2 distinct companies
        Company company1 = createCompany(faker.company().name() + " Transport");
        Company company2 = createCompany(faker.company().name() + " Freight");

        // Seed data for the first company
        seedDataForCompany(faker, company1);

        // Seed data for the second company
        seedDataForCompany(faker, company2);
    }

    private Company createCompany(String name) {
        Company company = new Company();
        company.setName(name);
        return companyRepository.save(company);
    }

    private void seedDataForCompany(Faker faker, Company company) {
        System.out.println("Seeding data for company: " + company.getName());

        // === Get Roles ===
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
        Role managerRole = roleRepository.findByName("ROLE_MANAGER").orElseThrow();
        Role driverRole = roleRepository.findByName("ROLE_DRIVER").orElseThrow();

        // === Create Users (Admin, Manager, Drivers) ===
        String companyDomain = company.getName().toLowerCase().replaceAll("[^a-z0-9]", "") + ".com";

        // Admin
        User admin = new User();
        admin.setUsername("admin_" + company.getId());
        admin.setEmail("admin@" + companyDomain);
        admin.setPassword(passwordEncoder.encode("password"));
        admin.setEmployeeId("A001-" + company.getId());
        admin.setStatus(UserStatus.ACTIVE);
        admin.setRole(adminRole);
        admin.setCompany(company);
        userRepository.save(admin);

        // Manager
        User manager = new User();
        manager.setUsername("manager_" + company.getId());
        manager.setEmail("manager@" + companyDomain);
        manager.setPassword(passwordEncoder.encode("password"));
        manager.setEmployeeId("M001-" + company.getId());
        manager.setStatus(UserStatus.ACTIVE);
        manager.setRole(managerRole);
        manager.setCompany(company);
        userRepository.save(manager);

        // Drivers (30)
        List<User> driverUsers = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            String firstName = faker.name().firstName();
            User driverUser = new User();
            driverUser.setUsername(firstName.toLowerCase() + "_" + company.getId() + i);
            driverUser.setEmail(firstName.toLowerCase() + i + "@" + companyDomain);
            driverUser.setPassword(passwordEncoder.encode("password"));
            driverUser.setEmployeeId("D" + String.format("%03d", i + 1) + "-" + company.getId());
            driverUser.setStatus(UserStatus.ACTIVE);
            driverUser.setRole(driverRole);
            driverUser.setCompany(company);
            driverUsers.add(userRepository.save(driverUser));
        }

        // === Create Trucks (40) ===
        List<Truck> trucks = new ArrayList<>();
        for (int i = 0; i < 40; i++) {
            Truck truck = new Truck();
            truck.setLicensePlate(faker.regexify("[A-Z]{3}-[0-9]{3}"));
            truck.setMake(faker.options().option("Volvo", "Scania", "MAN", "Mercedes-Benz", "DAF", "Iveco"));
            truck.setModel(faker.options().option("FH16", "R-series", "TGX", "Actros", "XF", "S-Way"));
            truck.setYear(faker.number().numberBetween(2018, 2024));
            truck.setCapacityKg(faker.number().numberBetween(15000, 25000));
            truck.setStatus(faker.options().option(TruckStatus.WORKING, TruckStatus.IN_REPAIR, TruckStatus.WORKING, TruckStatus.WORKING)); // Skewed towards working
            truck.setCompany(company);
            trucks.add(truckRepository.save(truck));
        }

        // === Create Driver Profiles ===
        List<Driver> drivers = new ArrayList<>();
        for (int i = 0; i < driverUsers.size(); i++) {
            Driver driverProfile = new Driver();
            driverProfile.setUser(driverUsers.get(i));
            driverProfile.setFullName(driverUsers.get(i).getUsername().split("_")[0] + " " + faker.name().lastName());
            driverProfile.setLicenseNumber(faker.regexify("[A-Z]{2}[0-9]{11}"));
            driverProfile.setContactNumber(faker.phoneNumber().cellPhone());
            // Assign a truck to most, but not all drivers
            if (i < trucks.size() && faker.bool().bool()) {
                driverProfile.setAssignedTruck(trucks.get(i));
            }
            driverProfile.setCompany(company);
            drivers.add(driverRepository.save(driverProfile));
        }

        // === Create Shipments (50) and link Incomes ===
        for (int i = 0; i < 50; i++) {
            Shipment shipment = new Shipment();
            shipment.setDescription(faker.commerce().productName() + " Transport");
            shipment.setOrigin(faker.address().city());
            shipment.setDestination(faker.address().city());
            shipment.setStatus(faker.options().option(ShipmentStatus.PENDING, ShipmentStatus.IN_TRANSIT, ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED));
            shipment.setAssignedDriver(drivers.get(faker.number().numberBetween(0, drivers.size())));
            shipment.setAssignedTruck(trucks.get(faker.number().numberBetween(0, trucks.size())));
            shipment.setCreatedByManager(manager);
            shipment.setCompany(company);
            shipment.setCreatedAt(faker.date().past(60, TimeUnit.DAYS).toInstant());

            if (shipment.getStatus() == ShipmentStatus.DELIVERED) {
                shipment.setCompletedAt(faker.date().past(30, TimeUnit.DAYS).toInstant());
                Shipment savedShipment = shipmentRepository.save(shipment);

                // Create a corresponding income for the delivered shipment
                Income income = new Income();
                income.setDescription("Payment for Shipment #" + savedShipment.getId());
                income.setAmount(BigDecimal.valueOf(faker.number().randomDouble(2, 1500, 8000)));
                income.setIncomeDate(faker.date().between(java.util.Date.from(savedShipment.getCompletedAt()), new java.util.Date()).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                income.setShipment(savedShipment);
                income.setCompany(company);
                incomeRepository.save(income);
            } else {
                shipmentRepository.save(shipment);
            }
        }

        // === Create Issues (35) ===
        for (int i = 0; i < 35; i++) {
            Issue issue = new Issue();
            Driver reportingDriver = drivers.get(faker.number().numberBetween(0, drivers.size()));
            issue.setTitle(faker.options().option("Engine Overheating", "Flat Tyre", "Brake System Warning", "Refrigeration Unit Failure", "GPS Malfunction"));
            issue.setDescription(faker.lorem().sentence());
            issue.setStatus(faker.options().option(IssueStatus.OPEN, IssueStatus.RESOLVED, IssueStatus.ESCALATED));
            issue.setPriority(faker.options().option(IssuePriority.HIGH, IssuePriority.MEDIUM, IssuePriority.LOW));
            issue.setReportedByDriver(reportingDriver);
            if (reportingDriver.getAssignedTruck() != null) {
                issue.setRelatedTruck(reportingDriver.getAssignedTruck());
            } else {
                issue.setRelatedTruck(trucks.get(faker.number().numberBetween(0, trucks.size())));
            }
            issue.setAssignedToManager(manager);
            issue.setCompany(company);
            issueRepository.save(issue);
        }

        // === Create Expenses (40) ===
        for (int i = 0; i < 40; i++) {
            Expense expense = new Expense();
            ExpenseCategory category = faker.options().option(ExpenseCategory.class);
            expense.setCategory(category);
            expense.setAmount(BigDecimal.valueOf(faker.number().randomDouble(2, 50, 1000)));
            expense.setExpenseDate(faker.date().past(60, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());

            if(category == ExpenseCategory.MAINTENANCE) {
                expense.setDescription("Maintenance for Truck #" + trucks.get(faker.number().numberBetween(0, trucks.size())).getLicensePlate());
            } else if (category == ExpenseCategory.FUEL) {
                expense.setDescription("Fuel purchase");
            } else {
                expense.setDescription(faker.commerce().productName());
            }

            expense.setCompany(company);
            expenseRepository.save(expense);
        }

        System.out.println("Data seeding for " + company.getName() + " completed.");
    }
}