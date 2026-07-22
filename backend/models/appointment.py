import uuid
import sqlite3
from datetime import datetime
from database import get_connection

class Appointment:
    """Appointment model for database operations"""
    
    def __init__(self):
        self.conn = get_connection()
    
    def create_appointment(self, appointment_data):
        """Create a new appointment"""
        try:
            appointment_id = f"APT{uuid.uuid4().hex[:8].upper()}"
            cursor = self.conn.cursor()
            
            cursor.execute('''
                INSERT INTO appointments (
                    appointment_id, patient_uhid, doctor_id, appointment_date,
                    appointment_type, reason, status, notes, is_emergency
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                appointment_id,
                appointment_data.get('patient_uhid'),
                appointment_data.get('doctor_id'),
                appointment_data.get('appointment_date'),
                appointment_data.get('appointment_type', 'consultation'),
                appointment_data.get('reason'),
                appointment_data.get('status', 'scheduled'),
                appointment_data.get('notes'),
                appointment_data.get('is_emergency', False)
            ))
            
            self.conn.commit()
            return {
                'status': 'success',
                'appointment_id': appointment_id,
                'message': 'Appointment created successfully'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_appointment_by_id(self, appointment_id):
        """Get appointment details"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM appointments WHERE appointment_id = ?', (appointment_id,))
            row = cursor.fetchone()
            
            if row:
                return {
                    'status': 'success',
                    'data': dict(row)
                }
            else:
                return {
                    'status': 'error',
                    'message': 'Appointment not found'
                }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_patient_appointments(self, patient_uhid):
        """Get all appointments for a patient"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT * FROM appointments 
                WHERE patient_uhid = ?
                ORDER BY appointment_date DESC
            ''', (patient_uhid,))
            rows = cursor.fetchall()
            
            return {
                'status': 'success',
                'count': len(rows),
                'data': [dict(row) for row in rows]
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_doctor_appointments(self, doctor_id):
        """Get all appointments for a doctor"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT * FROM appointments 
                WHERE doctor_id = ?
                ORDER BY appointment_date ASC
            ''', (doctor_id,))
            rows = cursor.fetchall()
            
            return {
                'status': 'success',
                'count': len(rows),
                'data': [dict(row) for row in rows]
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def update_appointment(self, appointment_id, appointment_data):
        """Update appointment details"""
        try:
            cursor = self.conn.cursor()
            
            fields = []
            values = []
            for key, value in appointment_data.items():
                if key != 'appointment_id':
                    fields.append(f'{key} = ?')
                    values.append(value)
            
            values.append(appointment_id)
            
            if not fields:
                return {'status': 'error', 'message': 'No fields to update'}
            
            query = f'UPDATE appointments SET updated_at = CURRENT_TIMESTAMP, {", ".join(fields)} WHERE appointment_id = ?'
            cursor.execute(query, values)
            self.conn.commit()
            
            return {
                'status': 'success',
                'message': 'Appointment updated successfully'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def cancel_appointment(self, appointment_id):
        """Cancel an appointment"""
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                UPDATE appointments 
                SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
                WHERE appointment_id = ?
            ''', (appointment_id,))
            self.conn.commit()
            
            return {
                'status': 'success',
                'message': 'Appointment cancelled successfully'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def close(self):
        """Close database connection"""
        self.conn.close()
