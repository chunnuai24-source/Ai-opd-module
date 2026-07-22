// ==================== Navigation & Page Management ====================

function navigateTo(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(page);
    if (selectedPage) {
        selectedPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// ==================== Registration Tab Switching ====================

function switchRegistrationTab(tab) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.registration-tab');
    tabs.forEach(t => t.classList.remove('active'));

    // Remove active from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(b => b.classList.remove('active'));

    // Show selected tab and activate button
    const selectedTab = document.getElementById(`${tab}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const activeButton = event.target;
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// ==================== Text Registration ====================

async function submitTextRegistration(event) {
    event.preventDefault();

    const patientData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        phone_number: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        marital_status: document.getElementById('maritalStatus').value,
        blood_group: document.getElementById('bloodGroup').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip_code: document.getElementById('zipCode').value,
        emergency_contact_name: document.getElementById('emergencyContactName').value,
        emergency_contact_phone: document.getElementById('emergencyContactPhone').value,
    };

    try {
        const response = await APIClient.registerText(patientData, false);
        
        if (response.status === 'success') {
            showSuccessMessage('Registration successful!', response);
            document.getElementById('textRegistrationForm').reset();
        } else {
            showErrorMessage('Registration failed', response.message);
        }
    } catch (error) {
        showErrorMessage('Error', error.message);
    }
}

// ==================== Emergency Registration ====================

async function submitEmergency(event) {
    event.preventDefault();

    const phoneNumber = document.getElementById('emergencyPhone').value;
    const emergencyReason = document.getElementById('emergencyReason').value;

    try {
        const response = await APIClient.registerEmergency(phoneNumber, emergencyReason);
        
        if (response.status === 'success') {
            displayEmergencyResult(response);
            document.getElementById('emergencyForm').reset();
        } else {
            showErrorMessage('Emergency Registration Failed', response.message);
        }
    } catch (error) {
        showErrorMessage('Error', error.message);
    }
}

function displayEmergencyResult(response) {
    const resultBox = document.getElementById('emergencyResult');
    let html = '<strong style="color: #d32f2f;">🚑 Emergency Alert Activated</strong><br><br>';
    
    if (response.doctor_assigned) {
        html += `<p><strong>Doctor Assigned:</strong> ${response.doctor_assigned}</p>`;
    }
    if (response.appointment_id) {
        html += `<p><strong>Appointment ID:</strong> ${response.appointment_id}</p>`;
    }
    if (response.uhid) {
        html += `<p><strong>UHID:</strong> ${response.uhid}</p>`;
    }
    
    html += `<p><strong>Status:</strong> ${response.message}</p>`;
    
    resultBox.innerHTML = html;
    resultBox.style.display = 'block';
}

// ==================== Appointment Scheduling ====================

async function fetchAvailableDoctors() {
    try {
        const response = await APIClient.getAvailableDoctors();
        
        if (response.status === 'success' && response.data && response.data.length > 0) {
            const doctorSelect = document.getElementById('doctorSelect');
            doctorSelect.innerHTML = '<option value="">Choose a doctor...</option>';
            
            response.data.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.doctor_id;
                option.textContent = `Dr. ${doctor.first_name} ${doctor.last_name} (${doctor.specialization})`;
                doctorSelect.appendChild(option);
            });
        } else {
            showErrorMessage('No Doctors Available', 'Please try again later');
        }
    } catch (error) {
        showErrorMessage('Error Loading Doctors', error.message);
    }
}

async function scheduleAppointment(event) {
    event.preventDefault();

    const uhid = document.getElementById('appointmentUHID').value;
    const doctorId = document.getElementById('doctorSelect').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const reason = document.getElementById('appointmentReason').value;

    if (!uhid || !doctorId || !appointmentDate || !appointmentTime || !reason) {
        showErrorMessage('Validation Error', 'Please fill all required fields');
        return;
    }

    const dateTime = `${appointmentDate} ${appointmentTime}`;

    try {
        const response = await APIClient.scheduleAppointment(uhid, doctorId, dateTime, 'consultation', reason);
        
        if (response.status === 'success') {
            displayAppointmentResult(response);
            document.getElementById('appointmentForm').reset();
        } else {
            showErrorMessage('Appointment Scheduling Failed', response.message);
        }
    } catch (error) {
        showErrorMessage('Error', error.message);
    }
}

function displayAppointmentResult(response) {
    const resultBox = document.getElementById('appointmentResult');
    let html = '<strong style="color: #4CAF50;">✓ Appointment Scheduled Successfully</strong><br><br>';
    
    if (response.appointment_id) {
        html += `<p><strong>Appointment ID:</strong> ${response.appointment_id}</p>`;
    }
    if (response.message) {
        html += `<p><strong>Status:</strong> ${response.message}</p>`;
    }
    
    resultBox.innerHTML = html;
    resultBox.style.display = 'block';
}

// Generate time slots when date is selected
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', generateTimeSlots);
    }
});

function generateTimeSlots() {
    const timeSelect = document.getElementById('appointmentTime');
    const date = document.getElementById('appointmentDate').value;
    
    if (!date) return;

    const slots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00'
    ];

    timeSelect.innerHTML = '<option value="">Select time...</option>';
    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
    });
}

// ==================== Patient Profile ====================

async function fetchPatientProfile() {
    const uhid = document.getElementById('profileUHID').value;

    if (!uhid) {
        showErrorMessage('Validation Error', 'Please enter UHID');
        return;
    }

    try {
        const response = await APIClient.getPatient(uhid);
        
        if (response.status === 'success') {
            displayPatientProfile(response.data);
        } else {
            showErrorMessage('Patient Not Found', 'No patient found with this UHID');
        }
    } catch (error) {
        showErrorMessage('Error', error.message);
    }
}

function displayPatientProfile(patient) {
    const resultBox = document.getElementById('profileResult');
    
    let html = `
        <div class="profile-info">
            <h3>Patient Information</h3>
            <div class="info-row">
                <div class="info-item">
                    <label>UHID:</label>
                    <span>${patient.uhid}</span>
                </div>
                <div class="info-item">
                    <label>Name:</label>
                    <span>${patient.first_name} ${patient.last_name || ''}</span>
                </div>
                <div class="info-item">
                    <label>Age:</label>
                    <span>${patient.age}</span>
                </div>
                <div class="info-item">
                    <label>Gender:</label>
                    <span>${patient.gender}</span>
                </div>
            </div>
            
            <div class="info-row">
                <div class="info-item">
                    <label>Phone:</label>
                    <span>${patient.phone_number}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span>${patient.email || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <label>Marital Status:</label>
                    <span>${patient.marital_status || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <label>Blood Group:</label>
                    <span>${patient.blood_group || 'N/A'}</span>
                </div>
            </div>
            
            <div class="info-row">
                <div class="info-item">
                    <label>Address:</label>
                    <span>${patient.address || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <label>City:</label>
                    <span>${patient.city || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <label>State:</label>
                    <span>${patient.state || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <label>Zip Code:</label>
                    <span>${patient.zip_code || 'N/A'}</span>
                </div>
            </div>
            
            <div class="info-row">
                <div class="info-item">
                    <label>Emergency Contact:</label>
                    <span>${patient.emergency_contact_name || 'N/A'} (${patient.emergency_contact_phone || 'N/A'})</span>
                </div>
                <div class="info-item">
                    <label>Registration Date:</label>
                    <span>${new Date(patient.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `;
    
    resultBox.innerHTML = html;
    resultBox.style.display = 'block';
}

// ==================== Message Display Functions ====================

function showSuccessMessage(title, response) {
    const resultBox = document.createElement('div');
    resultBox.className = 'result-box';
    
    let html = `<strong style="color: #4CAF50;">✓ ${title}</strong><br><br>`;
    
    if (response.uhid) {
        html += `<p><strong>Your UHID:</strong> <span style="color: #4CAF50; font-weight: bold;">${response.uhid}</span></p>`;
        html += `<p style="font-size: 0.9rem; color: #666;">Save this UHID for future appointments and records</p>`;
    }
    
    if (response.message) {
        html += `<p>${response.message}</p>`;
    }
    
    resultBox.innerHTML = html;
    resultBox.style.display = 'block';
    
    // Insert after form
    const form = event.target.closest('form');
    if (form) {
        form.parentNode.appendChild(resultBox);
    }
}

function showErrorMessage(title, message) {
    alert(`${title}: ${message}`);
}

// ==================== Initialization ====================

window.addEventListener('DOMContentLoaded', () => {
    console.log('AI OPD Module loaded successfully');
    
    // Check backend connectivity
    APIClient.healthCheck().then(response => {
        if (response.status === 'healthy') {
            console.log('✓ Backend connected');
        } else {
            console.warn('⚠️ Backend may not be running. Make sure to start the server.');
        }
    }).catch(() => {
        console.warn('⚠️ Backend server not accessible at ' + API_BASE_URL);
    });
});
