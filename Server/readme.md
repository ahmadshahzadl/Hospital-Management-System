# Hospital Management System - Complete API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Routes (`/api/auth`)

### 1.1 POST /api/auth/signup
Register a new user in the system.

**URL:** `/api/auth/signup`  
**Method:** `POST`  
**Auth Required:** No  

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "firstName": "John",
  "lastName": "Doe",
  
  // Additional fields for Patient role
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "phone": "1234567890",
  "address": "123 Main St, City, State",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "9876543210",
    "relation": "Wife"
  },
  
  // Additional fields for Doctor role (when role is "doctor")
  "specialization": "Cardiology",
  "qualification": "MBBS, MD",
  "experience": 5,
  "phone": "1234567890",
  "schedule": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "day": "Tuesday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b1234567890abcdef123",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**
- `400`: User already exists
- `500`: Server error

---

### 1.2 POST /api/auth/login
Authenticate user and get JWT token.

**URL:** `/api/auth/login`  
**Method:** `POST`  
**Auth Required:** No  

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b1234567890abcdef123",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `500`: Server error

---

### 1.3 GET /api/auth/profile
Get authenticated user's profile with role-specific details.

**URL:** `/api/auth/profile`  
**Method:** `GET`  
**Auth Required:** Yes  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200) - Patient:**
```json
{
  "profile": {
    "_id": "64f8b1234567890abcdef123",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "patientDetails": {
      "_id": "64f8b1234567890abcdef124",
      "userId": "64f8b1234567890abcdef123",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "phone": "1234567890",
      "address": "123 Main St, City, State",
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "9876543210",
        "relation": "Wife"
      },
      "medicalHistory": []
    }
  }
}
```

**Success Response (200) - Doctor:**
```json
{
  "profile": {
    "_id": "64f8b1234567890abcdef125",
    "username": "dr_smith",
    "email": "drsmith@example.com",
    "role": "doctor",
    "firstName": "Robert",
    "lastName": "Smith",
    "doctorDetails": {
      "_id": "64f8b1234567890abcdef126",
      "userId": "64f8b1234567890abcdef125",
      "specialization": "Cardiology",
      "qualification": "MBBS, MD",
      "experience": 5,
      "phone": "1234567890",
      "schedule": [
        {
          "day": "Monday",
          "startTime": "09:00",
          "endTime": "17:00",
          "_id": "64f8b1234567890abcdef127"
        }
      ]
    }
  }
}
```

**Error Responses:**
- `401`: Invalid token or not authenticated
- `500`: Server error

---

## 2. Doctor Routes (`/api/doctors`)

### 2.1 GET /api/doctors
Get all doctors in the system.

**URL:** `/api/doctors`  
**Method:** `GET`  
**Auth Required:** No  

**Success Response (200):**
```json
{
  "doctors": [
    {
      "_id": "64f8b1234567890abcdef126",
      "userId": {
        "_id": "64f8b1234567890abcdef125",
        "firstName": "Robert",
        "lastName": "Smith",
        "email": "drsmith@example.com"
      },
      "specialization": "Cardiology",
      "qualification": "MBBS, MD",
      "experience": 5,
      "phone": "1234567890",
      "schedule": [
        {
          "day": "Monday",
          "startTime": "09:00",
          "endTime": "17:00",
          "_id": "64f8b1234567890abcdef127"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2.2 GET /api/doctors/:id
Get a specific doctor by ID.

**URL:** `/api/doctors/64f8b1234567890abcdef126`  
**Method:** `GET`  
**Auth Required:** No  

**Success Response (200):**
```json
{
  "doctor": {
    "_id": "64f8b1234567890abcdef126",
    "userId": {
      "_id": "64f8b1234567890abcdef125",
      "firstName": "Robert",
      "lastName": "Smith",
      "email": "drsmith@example.com"
    },
    "specialization": "Cardiology",
    "qualification": "MBBS, MD",
    "experience": 5,
    "phone": "1234567890",
    "schedule": [
      {
        "day": "Monday",
        "startTime": "09:00",
        "endTime": "17:00",
        "_id": "64f8b1234567890abcdef127"
      }
    ]
  }
}
```

**Error Responses:**
- `404`: Doctor not found
- `500`: Server error

---

### 2.3 GET /api/doctors/specialization/:specialization
Get doctors by specialization.

**URL:** `/api/doctors/specialization/cardiology`  
**Method:** `GET`  
**Auth Required:** No  

**Success Response (200):**
```json
{
  "doctors": [
    {
      "_id": "64f8b1234567890abcdef126",
      "userId": {
        "_id": "64f8b1234567890abcdef125",
        "firstName": "Robert",
        "lastName": "Smith",
        "email": "drsmith@example.com"
      },
      "specialization": "Cardiology",
      "qualification": "MBBS, MD",
      "experience": 5,
      "phone": "1234567890",
      "schedule": []
    }
  ]
}
```

---

### 2.4 PUT /api/doctors/profile
Update doctor's own profile.

**URL:** `/api/doctors/profile`  
**Method:** `PUT`  
**Auth Required:** Yes (Doctor role only)  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "specialization": "Pediatric Cardiology",
  "qualification": "MBBS, MD, DM",
  "experience": 7,
  "phone": "9876543210",
  "schedule": [
    {
      "day": "Monday",
      "startTime": "08:00",
      "endTime": "16:00"
    },
    {
      "day": "Wednesday",
      "startTime": "08:00",
      "endTime": "16:00"
    },
    {
      "day": "Friday",
      "startTime": "08:00",
      "endTime": "16:00"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "message": "Doctor profile updated",
  "doctor": {
    "_id": "64f8b1234567890abcdef126",
    "userId": {
      "_id": "64f8b1234567890abcdef125",
      "firstName": "Robert",
      "lastName": "Smith",
      "email": "drsmith@example.com"
    },
    "specialization": "Pediatric Cardiology",
    "qualification": "MBBS, MD, DM",
    "experience": 7,
    "phone": "9876543210",
    "schedule": [
      {
        "day": "Monday",
        "startTime": "08:00",
        "endTime": "16:00",
        "_id": "64f8b1234567890abcdef128"
      }
    ]
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied (not a doctor)
- `404`: Doctor profile not found
- `500`: Server error

---

## 3. Patient Routes (`/api/patients`)

### 3.1 GET /api/patients
Get all patients (Admin/Doctor only).

**URL:** `/api/patients`  
**Method:** `GET`  
**Auth Required:** Yes (Admin or Doctor role)  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "patients": [
    {
      "_id": "64f8b1234567890abcdef124",
      "userId": {
        "_id": "64f8b1234567890abcdef123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "phone": "1234567890",
      "address": "123 Main St, City, State",
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "9876543210",
        "relation": "Wife"
      },
      "medicalHistory": [
        {
          "condition": "Hypertension",
          "date": "2023-12-01T00:00:00.000Z",
          "notes": "Controlled with medication",
          "_id": "64f8b1234567890abcdef129"
        }
      ]
    }
  ]
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied (insufficient permissions)
- `500`: Server error

---

### 3.2 GET /api/patients/:id
Get specific patient by ID (Admin/Doctor only).

**URL:** `/api/patients/64f8b1234567890abcdef124`  
**Method:** `GET`  
**Auth Required:** Yes (Admin or Doctor role)  

**Success Response (200):**
```json
{
  "patient": {
    "_id": "64f8b1234567890abcdef124",
    "userId": {
      "_id": "64f8b1234567890abcdef123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "phone": "1234567890",
    "address": "123 Main St, City, State",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "9876543210",
      "relation": "Wife"
    },
    "medicalHistory": []
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied
- `404`: Patient not found
- `500`: Server error

---

### 3.3 PUT /api/patients/profile
Update patient's own profile.

**URL:** `/api/patients/profile`  
**Method:** `PUT`  
**Auth Required:** Yes (Patient role only)  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "phone": "9876543210",
  "address": "456 New Address, New City, State",
  "emergencyContact": {
    "name": "John Smith",
    "phone": "1112223333",
    "relation": "Brother"
  }
}
```

**Success Response (200):**
```json
{
  "message": "Patient profile updated",
  "patient": {
    "_id": "64f8b1234567890abcdef124",
    "userId": {
      "_id": "64f8b1234567890abcdef123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "phone": "9876543210",
    "address": "456 New Address, New City, State",
    "emergencyContact": {
      "name": "John Smith",
      "phone": "1112223333",
      "relation": "Brother"
    },
    "medicalHistory": []
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied (not a patient)
- `404`: Patient profile not found
- `500`: Server error

---

### 3.4 POST /api/patients/medical-history
Add medical history entry (Patient only).

**URL:** `/api/patients/medical-history`  
**Method:** `POST`  
**Auth Required:** Yes (Patient role only)  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "condition": "Diabetes Type 2",
  "date": "2024-01-10T00:00:00.000Z",
  "notes": "Diagnosed during routine checkup. Started on Metformin 500mg twice daily."
}
```

**Success Response (200):**
```json
{
  "message": "Medical history added",
  "patient": {
    "_id": "64f8b1234567890abcdef124",
    "userId": "64f8b1234567890abcdef123",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "phone": "1234567890",
    "address": "123 Main St, City, State",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "9876543210",
      "relation": "Wife"
    },
    "medicalHistory": [
      {
        "condition": "Diabetes Type 2",
        "date": "2024-01-10T00:00:00.000Z",
        "notes": "Diagnosed during routine checkup. Started on Metformin 500mg twice daily.",
        "_id": "64f8b1234567890abcdef130"
      }
    ]
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied (not a patient)
- `404`: Patient profile not found
- `500`: Server error

---

## 4. Appointment Routes (`/api/appointments`)

### 4.1 POST /api/appointments
Create a new appointment (Patient only).

**URL:** `/api/appointments`  
**Method:** `POST`  
**Auth Required:** Yes (Patient role only)  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "doctorId": "64f8b1234567890abcdef126",
  "appointmentDate": "2024-02-15T00:00:00.000Z",
  "appointmentTime": "10:30",
  "reason": "Regular checkup and blood pressure monitoring"
}
```

**Success Response (201):**
```json
{
  "message": "Appointment created successfully",
  "appointment": {
    "_id": "64f8b1234567890abcdef131",
    "patientId": {
      "_id": "64f8b1234567890abcdef124",
      "userId": {
        "_id": "64f8b1234567890abcdef123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "phone": "1234567890"
    },
    "doctorId": {
      "_id": "64f8b1234567890abcdef126",
      "userId": {
        "_id": "64f8b1234567890abcdef125",
        "firstName": "Robert",
        "lastName": "Smith",
        "email": "drsmith@example.com"
      },
      "specialization": "Cardiology"
    },
    "appointmentDate": "2024-02-15T00:00:00.000Z",
    "appointmentTime": "10:30",
    "status": "scheduled",
    "reason": "Regular checkup and blood pressure monitoring",
    "notes": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied (not a patient)
- `404`: Patient profile not found
- `500`: Server error

---

### 4.2 GET /api/appointments
Get appointments (filtered by user role).

**URL:** `/api/appointments`  
**Method:** `GET`  
**Auth Required:** Yes  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200) - Patient View:**
```json
{
  "appointments": [
    {
      "_id": "64f8b1234567890abcdef131",
      "patientId": {
        "_id": "64f8b1234567890abcdef124",
        "userId": {
          "_id": "64f8b1234567890abcdef123",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        }
      },
      "doctorId": {
        "_id": "64f8b1234567890abcdef126",
        "userId": {
          "_id": "64f8b1234567890abcdef125",
          "firstName": "Robert",
          "lastName": "Smith",
          "email": "drsmith@example.com"
        },
        "specialization": "Cardiology"
      },
      "appointmentDate": "2024-02-15T00:00:00.000Z",
      "appointmentTime": "10:30",
      "status": "scheduled",
      "reason": "Regular checkup and blood pressure monitoring",
      "notes": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Success Response (200) - Doctor View:**
```json
{
  "appointments": [
    {
      "_id": "64f8b1234567890abcdef131",
      "patientId": {
        "_id": "64f8b1234567890abcdef124",
        "userId": {
          "_id": "64f8b1234567890abcdef123",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        }
      },
      "doctorId": {
        "_id": "64f8b1234567890abcdef126",
        "userId": {
          "_id": "64f8b1234567890abcdef125",
          "firstName": "Robert",
          "lastName": "Smith",
          "email": "drsmith@example.com"
        }
      },
      "appointmentDate": "2024-02-15T00:00:00.000Z",
      "appointmentTime": "10:30",
      "status": "scheduled",
      "reason": "Regular checkup and blood pressure monitoring",
      "notes": null
    }
  ]
}
```

**Error Responses:**
- `401`: Not authenticated
- `500`: Server error

---

### 4.3 PUT /api/appointments/:id
Update appointment status and notes (Doctor/Admin only).

**URL:** `/api/appointments/64f8b1234567890abcdef131`  
**Method:** `PUT`  
**Auth Required:** Yes (Doctor or Admin role)  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Patient's blood pressure is normal. Continue current medication. Next followup in 3 months."
}
```

**Success Response (200):**
```json
{
  "message": "Appointment updated",
  "appointment": {
    "_id": "64f8b1234567890abcdef131",
    "patientId": {
      "_id": "64f8b1234567890abcdef124",
      "userId": {
        "_id": "64f8b1234567890abcdef123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    },
    "doctorId": {
      "_id": "64f8b1234567890abcdef126",
      "userId": {
        "_id": "64f8b1234567890abcdef125",
        "firstName": "Robert",
        "lastName": "Smith",
        "email": "drsmith@example.com"
      }
    },
    "appointmentDate": "2024-02-15T00:00:00.000Z",
    "appointmentTime": "10:30",
    "status": "completed",
    "reason": "Regular checkup and blood pressure monitoring",
    "notes": "Patient's blood pressure is normal. Continue current medication. Next followup in 3 months.",
    "updatedAt": "2024-02-15T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied (insufficient permissions)
- `404`: Appointment not found
- `500`: Server error

---

### 4.4 DELETE /api/appointments/:id
Cancel/Delete an appointment.

**URL:** `/api/appointments/64f8b1234567890abcdef131`  
**Method:** `DELETE`  
**Auth Required:** Yes (Patient, Doctor, or Admin)  

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Appointment cancelled successfully"
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Access denied
- `404`: Appointment not found
- `500`: Server error

---

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

## Status Codes Used

- `200`: Success
- `201`: Created successfully
- `400`: Bad request (validation errors, user already exists)
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Internal server error

## Notes

1. All dates should be in ISO 8601 format
2. JWT tokens expire in 24 hours
3. Passwords are automatically hashed before storing
4. Role-based access is strictly enforced
5. All MongoDB ObjectIds are 24-character hexadecimal strings
6. Phone numbers are stored as strings to preserve formatting
7. Appointment times are stored as strings in "HH:MM" format