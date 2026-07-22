import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', False)
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///ai_opd.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # API Configuration
    API_HOST = os.getenv('API_HOST', '127.0.0.1')
    API_PORT = int(os.getenv('API_PORT', 5000))
    
    # Voice Configuration
    AUDIO_FORMAT = os.getenv('AUDIO_FORMAT', 'wav')
    SAMPLE_RATE = int(os.getenv('SAMPLE_RATE', 16000))
    CHANNELS = int(os.getenv('CHANNELS', 1))
    
    # Emergency Configuration
    EMERGENCY_ALERT_TIMEOUT = int(os.getenv('EMERGENCY_ALERT_TIMEOUT', 300))
    DOCTOR_ASSIGNMENT_TIMEOUT = int(os.getenv('DOCTOR_ASSIGNMENT_TIMEOUT', 60))
    
    # UHID Configuration
    UHID_PREFIX = os.getenv('UHID_PREFIX', 'OPD')
    UHID_LENGTH = int(os.getenv('UHID_LENGTH', 8))
    
    # Google Cloud
    GOOGLE_CLOUD_PROJECT = os.getenv('GOOGLE_CLOUD_PROJECT', '')
    
    # Security
    JWT_SECRET = os.getenv('JWT_SECRET', 'jwt-secret-key')
    JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION', 3600))

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
