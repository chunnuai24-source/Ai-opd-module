// ==================== API Client ==================== 
const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
    /**
     * Make API request
     */
    static async request(endpoint, method = 'GET', data = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API Error:', error);
            return { status: 'error', message: 'Network error' };
        }
    }

    // ==================== Registration APIs ====================
    static registerVoice(audioFilePath, isEmergency = false) {
        return this.request('/registration/voice', 'POST', {
            audio_file_path: audioFilePath,
            is_emergency: isEmergency
        });
    }

    static registerText(patientData, isEmergency = false) {
        return this.request('/registration/text', 'POST', {
            ...patientData,
            is_emergency: isEmergency
        });
    }

    static registerEmergency(phoneNumber, emergencyReason) {
        return this.request('/registration/emergency', 'POST', {
            phone_number: phoneNumber,
            emergency_reason: emergencyReason
        });
    }

    static completeEmergencyRegistration(uhid, additionalData) {
        return this.request(`/registration/complete-registration/${uhid}`, 'PUT', additionalData);
    }

    static generateUHID() {
        return this.request('/registration/generate-uhid', 'GET');
    }

    static validateUHID(uhid) {
        return this.request(`/registration/validate-uhid/${uhid}`, 'GET');
    }

    // ==================== Patient APIs ====================
    static getPatient(uhid) {
        return this.request(`/patients/${uhid}`, 'GET');
    }

    static updatePatient(uhid, data) {
        return this.request(`/patients/${uhid}`, 'PUT', data);
    }

    static deletePatient(uhid) {
        return this.request(`/patients/${uhid}`, 'DELETE');
    }

    static getAllPatients(page = 1, limit = 20) {
        return this.request(`/patients?page=${page}&limit=${limit}`, 'GET');
    }

    static getPatientByPhone(phoneNumber) {
        return this.request(`/patients/phone/${phoneNumber}`, 'GET');
    }

    // ==================== Emergency APIs ====================
    static createEmergencyAlert(patientUHID, severityLevel, description) {
        return this.request('/emergency/alert', 'POST', {
            patient_uhid: patientUHID,
            severity_level: severityLevel,
            alert_description: description
        });
    }

    static assignDoctor(patientUHID, emergencyReason) {
        return this.request('/emergency/assign-doctor', 'POST', {
            patient_uhid: patientUHID,
            emergency_reason: emergencyReason
        });
    }

    static getEmergencyAlert(alertId) {
        return this.request(`/emergency/alert/${alertId}`, 'GET');
    }

    static resolveEmergency(alertId) {
        return this.request(`/emergency/alert/${alertId}/resolve`, 'PUT');
    }

    static getActiveEmergencies() {
        return this.request('/emergency/active', 'GET');
    }

    static getEmergencyHistory(patientUHID) {
        return this.request(`/emergency/history/${patientUHID}`, 'GET');
    }

    // ==================== Appointment APIs ====================
    static scheduleAppointment(patientUHID, doctorId, appointmentDate, appointmentType, reason) {
        return this.request('/appointments/schedule', 'POST', {
            patient_uhid: patientUHID,
            doctor_id: doctorId,
            appointment_date: appointmentDate,
            appointment_type: appointmentType,
            reason: reason
        });
    }

    static getAppointment(appointmentId) {
        return this.request(`/appointments/${appointmentId}`, 'GET');
    }

    static getPatientAppointments(patientUHID) {
        return this.request(`/appointments/patient/${patientUHID}`, 'GET');
    }

    static getDoctorAppointments(doctorId) {
        return this.request(`/appointments/doctor/${doctorId}`, 'GET');
    }

    static updateAppointment(appointmentId, data) {
        return this.request(`/appointments/${appointmentId}`, 'PUT', data);
    }

    static cancelAppointment(appointmentId) {
        return this.request(`/appointments/${appointmentId}/cancel`, 'PUT');
    }

    static getAvailableDoctors() {
        return this.request('/appointments/available-doctors', 'GET');
    }

    // ==================== Doctor APIs ====================
    static createDoctor(doctorData) {
        return this.request('/doctors', 'POST', doctorData);
    }

    static getDoctor(doctorId) {
        return this.request(`/doctors/${doctorId}`, 'GET');
    }

    static updateDoctor(doctorId, data) {
        return this.request(`/doctors/${doctorId}`, 'PUT', data);
    }

    // ==================== Health Check ====================
    static async healthCheck() {
        return this.request('/health', 'GET');
    }
}
