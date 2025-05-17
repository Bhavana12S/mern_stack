# mern_stack

# MERN Agent Task App

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows an admin to:

- Log in securely
- Create and manage agents
- Upload `.csv` or `.xlsx` files with tasks
- Distribute those tasks evenly among agents
- View assigned tasks

---

## 🚀 Features

- JWT-based Admin Authentication
- Agent Management (Name, Email, Mobile, Password)
- File Upload (`.csv`, `.xlsx`, `.xls`) with Multer
- Automatic task distribution to agents
- MongoDB storage of agents and tasks
- Frontend upload and status interface

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **File Parsing:** `csv-parser`, `xlsx`
- **Authentication:** JWT
- **File Upload:** Multer

---

## 📦 Installation & Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/mern-agent-task-app.git
cd mern-agent-task-app
