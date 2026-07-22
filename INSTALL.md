# AI OPD Module - Installation & Setup Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [API Documentation](#api-documentation)
6. [Usage Guide](#usage-guide)
7. [Troubleshooting](#troubleshooting)

---

## 🖥️ System Requirements

### Backend
- **Python**: 3.8 or higher
- **pip**: Python package manager
- **SQLite**: 3.0+ (included with Python)

### Frontend
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Internet Connection** for API calls

### Optional
- **FFmpeg**: For audio file processing
- **Google Cloud credentials** (for advanced speech-to-text)

---

## 💾 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/chunnuai24-source/ai-opd-module.git
cd ai-opd-module
```

### Step 2: Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Initialize Database
```bash
python -c "from database import init_db; init_db()"
```

### Step 3: Frontend Setup
No installation required! The frontend runs directly in the browser.

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-change-in-production

# Database
DATABASE_URL=sqlite:///ai_opd.db

# API Configuration
API_HOST=127.0.0.1
API_PORT=5000
API_DEBUG=True

# Voice Configuration
AUDIO_FORMAT=wav
SAMPLE_RATE=16000
CHANNELS=1

# UHID Configuration
UHID_PREFIX=OPD
UHID_LENGTH=8

# Security
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600
```

### Frontend Configuration

Edit `frontend/js/api-client.js` and update the API base URL if needed:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

Expected output:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### Start Frontend

#### Option 1: Using Python HTTP Server
```bash
cd frontend
python -m http.server 8000
```

Then open: `http://localhost:8000`

#### Option 2: Direct File Opening
Simply open `frontend/index.html` in your web browser.

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### 1. Voice Registration
**Endpoint:** `POST /registration/voice`

**Request:**
```json
{
    "audio_file_path": "path/to/audio.wav",
    "is_emergency": false
}
```

**Response:**
```json
{
    "status": "success",
    "uhid": "OPD2A5K9M3",
    "message": "Patient registered successfully",
    "patient_data": { ... }
}
```

#### 2. Text Registration
**Endpoint:** `POST /registration/text`

**Request:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "age": 30,
    "gender": "Male",
    "phone_number": "9876543210",
    "email": "john@example.com",
    ...
}
```

#### 3. Emergency Registration
**Endpoint:** `POST /registration/emergency`

**Request:**
```json
{
    "phone_number": "9876543210",
    "emergency_reason": "Severe chest pain"
}
```

### Patient Routes

#### Get Patient Details
**Endpoint:** `GET /patients/{uhid}`

#### Update Patient
**Endpoint:** `PUT /patients/{uhid}`

#### Delete Patient
**Endpoint:** `DELETE /patients/{uhid}`

### Emergency Routes

#### Create Emergency Alert
**Endpoint:** `POST /emergency/alert`

**Request:**
```json
{
    "patient_uhid": "OPD2A5K9M3",
    "severity_level": "high",
    "alert_description": "Severe chest pain"
}
```

#### Assign Doctor
**Endpoint:** `POST /emergency/assign-doctor`

**Request:**
```json
{
    "patient_uhid": "OPD2A5K9M3",
    "emergency_reason": "Severe chest pain"
}
```

### Appointment Routes

#### Schedule Appointment
**Endpoint:** `POST /appointments/schedule`

**Request:**
```json
{
    "patient_uhid": "OPD2A5K9M3",
    "doctor_id": "DOC1234AB",
    "appointment_date": "2026-07-25 14:30",
    "appointment_type": "consultation",
    "reason": "Routine checkup"
}
```

#### Get Available Doctors
**Endpoint:** `GET /appointments/available-doctors`

---

## 📖 Usage Guide

### Patient Registration via Voice

1. **Navigate to Registration**
   - Click "Register" in the navbar
   - Select "🎤 Voice Registration" tab

2. **Start Recording**
   - Click "🎤 Start Recording"
   - Speak your details naturally
   - Example: "My name is John Doe, I'm 30 years old, male, my phone number is 9876543210"

3. **Submit Registration**
   - System will transcribe and extract information
   - Click "Submit" to register
   - You'll receive a unique UHID

### Patient Registration via Form

1. **Navigate to Registration**
   - Click "Register" in the navbar
   - Select "📝 Text Registration" tab

2. **Fill Form**
   - Enter all required information
   - Complete optional fields as needed

3. **Submit**
   - Click "Register" button
   - System generates and displays your UHID

### Emergency Registration

1. **Click "🚨 Emergency"** in navbar
2. **Provide Minimal Info**
   - Phone number
   - Emergency reason
3. **Click "🚑 Call Emergency"**
   - Doctor assigned immediately
   - Complete registration after consultation

### Schedule Appointment

1. **Navigate to Appointments**
2. **Enter Your UHID**
3. **Click "Load Doctors"**
   - View available doctors
4. **Select:**
   - Doctor
   - Date
   - Time
   - Reason for visit
5. **Click "Schedule Appointment"**

### View Patient Profile

1. **Navigate to Profile**
2. **Enter UHID**
3. **Click "Search"**
   - View complete patient information

---

## 🆔 UHID (Unique Health ID)

### Format
- **Prefix:** OPD (configurable)
- **Length:** 8 random alphanumeric characters
- **Example:** OPD2A5K9M3

### Usage
- Used to identify patients in the system
- Required for scheduling appointments
- Used in emergency situations for quick identification

---

## 🆘 Troubleshooting

### Backend Issues

#### 1. Port Already in Use
```bash
# Change port in .env
API_PORT=5001
```

#### 2. Database Error
```bash
# Reinitialize database
cd backend
python -c "from database import drop_all_tables; drop_all_tables()"
python -c "from database import init_db; init_db()"
```

#### 3. Module Not Found
```bash
pip install -r requirements.txt --upgrade
```

### Frontend Issues

#### 1. API Connection Error
- Ensure backend is running on port 5000
- Check firewall settings
- Verify API_BASE_URL in `api-client.js`

#### 2. Microphone Permission Denied
- Grant microphone permission when prompted
- Check browser privacy settings
- Try different browser if issue persists

#### 3. Voice Recognition Not Working
- Check browser compatibility (Chrome, Firefox recommended)
- Ensure microphone is working
- Allow popup permissions

### General Issues

#### CORS Error
```python
# Already handled in app.py with CORS configuration
# If still having issues, verify backend is running
```

#### Phone Number Not Recognized
- Ensure 10-digit format for Indian phone numbers
- Format: 9876543210 (without country code)

---

## 🔒 Security Considerations

1. **Microphone Access**: Only granted when explicitly needed
2. **Data Validation**: All inputs validated on frontend and backend
3. **CORS Enabled**: Only necessary origins allowed
4. **UHID**: Non-sequential, random generation prevents enumeration
5. **Database**: SQLite with no exposed credentials

---

## 📞 Support & Contact

For issues and questions:
1. Check troubleshooting section
2. Review API documentation
3. Check browser console for errors (F12)
4. Create an issue on GitHub

---

## 📝 License

MIT License - See LICENSE file for details

---

**Version:** 1.0.0  
**Last Updated:** 2026-07-22  
**Maintainer:** AI OPD Development Team
