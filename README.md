#  Student Management System (SMS)

<p align="center">
A full-stack Student Management System built with React, Node.js, Express, and MySQL.<br/>
Designed to streamline student, class, stream, and subject management through a modern web interface.
</p>

<hr/>

##  Overview

The Student Management System helps educational institutions manage students, classes, streams, and subjects efficiently. It provides a centralized platform for storing and retrieving academic information while maintaining a clean and user-friendly interface.

---

##  Application Preview

<p align="center">
  <img src="frontend/public/screenshot.png" alt="App Screenshot" width="800"/>
</p>

---

##  Features

* Student registration and management
* Manage classes and streams
* Assign students to classes and streams
* Manage subjects and subject allocation
* View detailed student profiles
* RESTful API architecture
* Responsive user interface
* MySQL database integration
* Structured backend error handling

---

##  Tech Stack

### Backend

* Node.js
* Express.js
* MySQL
* Sequelize ORM
* dotenv
* CORS

### Frontend

* React
* React Router DOM
* Axios
* Tailwind CSS
* Vite

---

##  Project Structure

```text
student-management-system/

backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── studentController.js
│   ├── classController.js
│   ├── streamController.js
│   └── subjectController.js
│
├── models/
│   ├── Student.js
│   ├── Class.js
│   ├── ClassStream.js
│   └── Subject.js
│
├── routes/
│   ├── studentRoutes.js
│   ├── classRoutes.js
│   ├── streamRoutes.js
│   └── subjectRoutes.js
│
├── .env
├── server.js
└── package.json

frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── vite.config.js

README.md
```

---

##  Setup

### 1. Create Database

```sql
CREATE DATABASE student_management_db;
```

### 2. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management_db
DB_DIALECT=mysql
```

---

##  Run Backend

```bash
cd backend

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

##  Run Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

##  API Endpoints

### Students

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| GET    | /api/students     | Get all students  |
| GET    | /api/students/:id | Get student by ID |
| POST   | /api/students     | Create student    |
| PUT    | /api/students/:id | Update student    |
| DELETE | /api/students/:id | Delete student    |

### Classes

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | /api/classes     | Get all classes |
| POST   | /api/classes     | Create class    |
| PUT    | /api/classes/:id | Update class    |
| DELETE | /api/classes/:id | Delete class    |

### Streams

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| GET    | /api/streams     | Get all streams    |
| GET    | /api/streams/:id | Get stream details |
| POST   | /api/streams     | Create stream      |
| PUT    | /api/streams/:id | Update stream      |
| DELETE | /api/streams/:id | Delete stream      |

### Subjects

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | /api/subjects     | Get all subjects |
| POST   | /api/subjects     | Create subject   |
| PUT    | /api/subjects/:id | Update subject   |
| DELETE | /api/subjects/:id | Delete subject   |

---

##  Future Improvements

* Authentication and Authorization (JWT)
* Student attendance management
* Examination and grading system
* Report card generation
* Parent portal
* Academic performance analytics
* Dashboard charts and reports

---

##  Author


Student Management System built for learning full-stack web development using React, Node.js, Express, MySQL, and Tailwind CSS.
