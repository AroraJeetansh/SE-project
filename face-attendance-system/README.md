# Face Recognition Attendance System

A beautiful, beginner-friendly Student Attendance System built using React, TailwindCSS, Python Flask, OpenCV, and SQLite.

## Core Features
- Role-based Access (Admin, Faculty, Student)
- Webcam Face Registration
- Real-time Face Recognition for Attendance
- Responsive, Aesthetic UI using Tailwind CSS

## Prerequisites
- **Node.js**: v16 or greater
- **Python**: 3.8 or greater (ensure pip is installed)
- **C++ Build Tools**: Because of the `face_recognition` library, you may need CMake and C++ build tools installed on your Windows machine to install `dlib`.

## Setup Instructions

### 1. Backend Setup
Open a terminal and navigate to the project directory:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python database.py
python app.py
```
The Flask API will run on `http://localhost:5000`

### 2. Frontend Setup
Open a second terminal and navigate to the project directory:
```bash
cd frontend
npm install
npm run dev
```
Access the application frontend at `http://localhost:5173`

## Deploy (Option A: Vercel + Render)

### 1) Deploy Backend on Render
- Create a new **Web Service** from this repository.
- Set the **Root Directory** to `backend`.
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- Add environment variable:
  - `CORS_ORIGIN=https://<your-vercel-domain>`

If OpenCV build fails on Render, replace `opencv-contrib-python` with `opencv-python-headless` in `backend/requirements.txt`.

### 2) Deploy Frontend on Vercel
- Import this repository into Vercel.
- Set the **Root Directory** to `frontend`.
- Vercel will use:
  - Build command: `npm run build`
  - Output directory: `dist`
- Add environment variable:
  - `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`

### 3) Local env setup
- Frontend example env is provided at `frontend/.env.example`.
- Backend example env is provided at `backend/.env.example`.
- Copy to `.env` and update values for your environment.

## Testing the Application

### Roles & Credentials
The database has been seeded with two default accounts so you can test right away:
- **Admin Login**: `admin` / `admin`
- **Faculty Login**: `faculty` / `faculty`

### Normal Flow
1. Open the UI, login as `faculty` with password `faculty`. 
2. Go to **Register Student** on the dashboard.
3. Fill in your name and a roll number (e.g., "CS123"). 
4. Proceed to the camera section and register your face. (Ensure you allow browser permissions for camera access)
5. Head back to the Faculty Dashboard and click **Start Attendance Session**.
6. Place your face in front of the camera and click to scan and mark attendance.
7. Logout and log back in using the credentials you just registered! (Username: `CS123`, Password: `CS123`) to view your own attendance.
