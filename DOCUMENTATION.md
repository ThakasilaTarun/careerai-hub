# PROJECT DOCUMENTATION: CAREERAI HUB
## Campus Placement Management System

### 1. PROJECT OVERVIEW
**Project Name:** CareerAI Hub  
**Domain:** Web Application / Database Management  
**Platform:** XAMPP (Local Server)  
**Objective:** To streamline the campus recruitment process by providing a centralized platform for students to track placements and admins to manage company interviews.

---

### 2. TECHNICAL ARCHITECTURE
The project follows a standard **Three-Tier Architecture**:

*   **Presentation Layer (Frontend):** 
    *   HTML5: Semantic structure of the web pages.
    *   CSS3: Styling, layout (Flexbox/Grid), and responsiveness.
    *   JavaScript: Client-side validation and interactive UI elements.
    *   Lucide Icons: Modern iconography for better UX.

*   **Application Layer (Backend):**
    *   PHP (Hypertext Preprocessor): Server-side scripting to handle login, session management, and database CRUD (Create, Read, Update, Delete) operations.

*   **Data Layer (Database):**
    *   MySQL: Relational Database Management System (RDBMS) used to store user profiles, student records, company data, and interview schedules.

---

### 3. DATABASE DESIGN (ER DIAGRAM LOGIC)
The database `placement_db` consists of the following key tables:

1.  **Users Table:** Stores credentials and roles (Admin/Student).
    *   Fields: `id`, `name`, `email`, `password`, `role`.
2.  **Students Table:** Stores academic data.
    *   Fields: `student_id` (FK), `roll_no`, `cgpa`, `branch`, `skills`.
3.  **Companies Table:** Details of recruiting firms.
    *   Fields: `id`, `name`, `website`, `role_offered`, `ctc`.
4.  **Interviews Table:** Mapping of students to companies.
    *   Fields: `id`, `student_id` (FK), `company_id` (FK), `batch_date`, `status`.

---

### 4. KEY MODULES
*   **Authentication Module:** Secure Login/Logout system with session tracking to prevent unauthorized access.
*   **Dashboard Module:** Displays real-time statistics (Total Students, Active Interviews).
*   **Interview Management:** Allows admins to view and manage professional scheduling.
*   **Profile Module:** Displays student academic details and technical skills.

---

### 5. HOW TO SETUP ON XAMPP (FOR VIVA)
1.  **Install XAMPP:** Ensure XAMPP is installed and running on your computer.
2.  **Move Files:** Copy all files from the `viva_php_export` folder into `C:\xampp\htdocs\placement_hub\`.
3.  **Database Setup:**
    *   Open `localhost/phpmyadmin` in your browser.
    *   Create a new database named `placement_db`.
    *   Click on **Import** and upload the `database.sql` file provided.
4.  **Run Project:** Open `localhost/placement_hub/login.php`.
5.  **Test Credentials:**
    *   **Admin:** admin@example.com / admin123
    *   **Student:** john@student.com / pass123

---

### 6. VIVA PREPARATION (Q&A)
*   **Q: Why use PHP/MySQL?**  
    *A: It is the most robust and widely used open-source stack for database-driven web applications, perfect for server-side management.*
*   **Q: What is a Foreign Key in your project?**  
    *A: The `student_id` in the `interviews` table is a Foreign Key that references the `id` in the `users` table, ensuring data integrity.*
*   **Q: How do you handle sessions?**  
    *A: We use `session_start()` in PHP to keep users logged in and protect pages (index.php) from being accessed without a valid login.*
