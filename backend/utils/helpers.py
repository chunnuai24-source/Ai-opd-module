from datetime import datetime, timedelta
import uuid

class Helpers:
    """Helper utility functions"""
    
    @staticmethod
    def generate_id(prefix=''):
        """Generate unique ID with optional prefix"""
        unique_id = str(uuid.uuid4().hex[:8]).upper()
        return f"{prefix}{unique_id}" if prefix else unique_id
    
    @staticmethod
    def format_phone(phone):
        """Format phone number"""
        digits = ''.join(filter(str.isdigit, phone))
        if len(digits) == 10:
            return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
        return digits
    
    @staticmethod
    def get_current_timestamp():
        """Get current timestamp in ISO format"""
        return datetime.now().isoformat()
    
    @staticmethod
    def format_date(date_obj, format='%d-%m-%Y %H:%M'):
        """Format datetime object to string"""
        if isinstance(date_obj, str):
            return date_obj
        return date_obj.strftime(format)
    
    @staticmethod
    def calculate_age(birth_date):
        """Calculate age from birth date"""
        try:
            if isinstance(birth_date, str):
                birth_date = datetime.strptime(birth_date, '%Y-%m-%d')
            today = datetime.today()
            return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        except:
            return None
    
    @staticmethod
    def get_appointment_time_slots(date_string, duration_minutes=30):
        """Generate available time slots for a day"""
        slots = []
        start_hour = 9  # 9 AM
        end_hour = 17   # 5 PM
        
        current_time = datetime.strptime(f"{date_string} {start_hour}:00", '%Y-%m-%d %H:%M')
        end_time = datetime.strptime(f"{date_string} {end_hour}:00", '%Y-%m-%d %H:%M')
        
        while current_time < end_time:
            slots.append(current_time.strftime('%H:%M'))
            current_time += timedelta(minutes=duration_minutes)
        
        return slots
    
    @staticmethod
    def paginate_results(items, page=1, per_page=20):
        """Paginate results"""
        start = (page - 1) * per_page
        end = start + per_page
        return {
            'data': items[start:end],
            'page': page,
            'per_page': per_page,
            'total': len(items),
            'total_pages': (len(items) + per_page - 1) // per_page
        }
    
    @staticmethod
    def build_error_response(message, code=None, details=None):
        """Build standardized error response"""
        response = {
            'status': 'error',
            'message': message
        }
        if code:
            response['code'] = code
        if details:
            response['details'] = details
        return response
    
    @staticmethod
    def build_success_response(data, message='Success', code=None):
        """Build standardized success response"""
        response = {
            'status': 'success',
            'message': message,
            'data': data
        }
        if code:
            response['code'] = code
        return response
