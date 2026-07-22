from flask import Blueprint, request, jsonify
from models.doctor import Doctor

doctor_bp = Blueprint('doctor', __name__, url_prefix='/api/doctors')
doctor_model = Doctor()

@doctor_bp.route('', methods=['POST'])
def create_doctor():
    """
    Create a new doctor record
    
    Expected JSON:
    {
        "first_name": "John",
        "last_name": "Smith",
        "specialization": "Cardiology",
        "phone_number": "9876543210",
        "email": "john@hospital.com",
        "max_patients": 10
    }
    """
    try:
        data = request.get_json()
        result = doctor_model.create_doctor(data)
        return jsonify(result), 201
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@doctor_bp.route('/<doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    """Get doctor details"""
    try:
        result = doctor_model.get_doctor_by_id(doctor_id)
        return jsonify(result), 200 if result['status'] == 'success' else 404
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@doctor_bp.route('/<doctor_id>', methods=['PUT'])
def update_doctor(doctor_id):
    """Update doctor details"""
    try:
        data = request.get_json()
        result = doctor_model.update_doctor(doctor_id, data)
        return jsonify(result), 200 if result['status'] == 'success' else 400
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@doctor_bp.route('/available', methods=['GET'])
def get_available_doctors():
    """Get list of available doctors"""
    try:
        result = doctor_model.get_available_doctors()
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
