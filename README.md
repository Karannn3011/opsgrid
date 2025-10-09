# OpsGrid

OpsGrid is a comprehensive, multi-tenant logistics management platform designed to streamline fleet, driver, shipment, and maintenance operations. It provides a centralized dashboard for managing all aspects of a logistics company, from tracking shipments to monitoring finances.

![OpsGrid Dashboard](https://i.ibb.co/S4X3FX7L/opsgridss.png) ## Key Features

* **Fleet Management:** Add, edit, and track all vehicles in your fleet, monitoring their status (working, in repair, out of service) and other details.
* **Driver Management:** Maintain a database of all drivers, assign them to trucks, and manage their profiles.
* **Shipment Tracking:** Create and manage shipments, assign drivers and trucks, and track their status from "pending" to "delivered".
* **Issue Reporting:** A system for drivers to report issues with their vehicles, which can then be tracked and managed by administrators.
* **Financial Overview:** A dedicated finance page to track company income and expenses, with the ability to add and manage financial records.
* **Maintenance Logging:** Automatically creates maintenance logs when an expense is categorized as "maintenance" and linked to a truck.
* **User Roles:** The application supports different user roles, including Admin, Manager, and Driver, each with different levels of access and functionality.
* **AI-Powered Insights:** Includes an AI-powered financial analyst to answer questions about financial data and an AI diagnostics tool for vehicle issues.

## Tech Stack

### Backend

* **Java:** The primary programming language for the backend.
* **Spring Boot:** Framework for creating the RESTful API.
* **Spring Security:** For authentication and authorization.
* **JPA (Hibernate):** For object-relational mapping and database interaction.
* **PostgreSQL:** The relational database for storing all application data.
* **Maven:** For dependency management and building the project.
* **JWT (JSON Web Tokens):** For securing the API endpoints.

### Frontend

* **React:** A JavaScript library for building the user interface.
* **Vite:** A modern, fast build tool for the frontend.
* **Tailwind CSS:** A utility-first CSS framework for styling the application.
* **Chart.js:** For creating interactive charts on the dashboard.
* **Axios:** For making HTTP requests to the backend API.

## Getting Started

### Prerequisites

* Java 17 or higher
* Maven
* Node.js and npm
* PostgreSQL

### Backend Setup

1.  Clone the repository.
2.  Navigate to the `backend` directory.
3.  Create a PostgreSQL database.
4.  Configure the database connection in `src/main/resources/application.properties`.
5.  Run the application using `./mvnw spring-boot:run`.

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Start the development server: `npm run dev`

The application will be available at `http://localhost:5173`.
