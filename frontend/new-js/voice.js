// ==================== Voice Recording Handler ====================

class VoiceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isRecording = false;
    }

    async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            return { status: 'success', message: 'Recording started...' };
        } catch (error) {
            return { status: 'error', message: 'Microphone access denied: ' + error.message };
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
            return { status: 'success', message: 'Recording stopped' };
        }
        return { status: 'error', message: 'No recording in progress' };
    }

    async getRecordedAudio() {
        return new Promise((resolve) => {
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                resolve({ blob: audioBlob, url: audioUrl });
            };
        });
    }
}

class SpeechToText {
    static async recognize() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            return { status: 'error', message: 'Speech Recognition not supported in your browser' };
        }

        return new Promise((resolve) => {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            let transcript = '';

            recognition.onstart = () => {
                console.log('Listening...');
            };

            recognition.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
            };

            recognition.onerror = (event) => {
                resolve({ status: 'error', message: 'Error: ' + event.error });
            };

            recognition.onend = () => {
                if (transcript.trim()) {
                    resolve({ status: 'success', transcript: transcript });
                } else {
                    resolve({ status: 'error', message: 'No speech detected' });
                }
            };

            recognition.start();
        });
    }
}

// ==================== Global Voice Recorder Instance ====================
const voiceRecorder = new VoiceRecorder();

// ==================== Voice Registration Functions ====================

async function startVoiceRecording() {
    const result = await voiceRecorder.startRecording();
    updateVoiceStatus(result.message, result.status === 'success' ? 'info' : 'danger');
    
    document.getElementById('voiceStartBtn').style.display = 'none';
    document.getElementById('voiceStopBtn').style.display = 'inline-block';
}

function stopVoiceRecording() {
    const result = voiceRecorder.stopRecording();
    updateVoiceStatus(result.message, result.status === 'success' ? 'success' : 'danger');
    
    document.getElementById('voiceStartBtn').style.display = 'inline-block';
    document.getElementById('voiceStopBtn').style.display = 'none';
}

function updateVoiceStatus(message, type = 'info') {
    const statusBox = document.getElementById('voiceStatus');
    statusBox.innerHTML = `<strong>Status:</strong> ${message}`;
    statusBox.className = `status-box alert-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info'}`;
    statusBox.style.display = 'block';
}

async function submitVoiceRegistration() {
    updateVoiceStatus('Processing your voice...', 'info');
    
    // Use Web Speech API for transcription
    const speechResult = await SpeechToText.recognize();
    
    if (speechResult.status !== 'success') {
        updateVoiceStatus('Error: ' + speechResult.message, 'danger');
        return;
    }

    // Display transcribed text
    displayTranscript(speechResult.transcript);

    // Extract information from speech
    const extractedData = extractPatientInfo(speechResult.transcript);
    displayExtractedInfo(extractedData);

    // Show submit button
    const voiceResult = document.getElementById('voiceResult');
    voiceResult.innerHTML = `
        <strong>✓ Voice data processed successfully!</strong>
        <p>Please verify the extracted information and click Submit to register.</p>
    `;
    voiceResult.className = 'result-box alert-success';
    voiceResult.style.display = 'block';

    // Store for submission
    window.voiceData = extractedData;
}

function displayTranscript(text) {
    const box = document.getElementById('voiceTranscript');
    box.innerHTML = `<strong>📝 Transcribed Text:</strong><p>${text}</p>`;
    box.style.display = 'block';
}

function displayExtractedInfo(data) {
    const box = document.getElementById('voiceExtracted');
    let html = '<strong>📊 Extracted Information:</strong><ul>';
    
    if (data.name) html += `<li><strong>Name:</strong> ${data.name}</li>`;
    if (data.age) html += `<li><strong>Age:</strong> ${data.age}</li>`;
    if (data.gender) html += `<li><strong>Gender:</strong> ${data.gender}</li>`;
    if (data.phone) html += `<li><strong>Phone:</strong> ${data.phone}</li>`;
    
    html += '</ul>';
    box.innerHTML = html;
    box.style.display = 'block';
}

function extractPatientInfo(text) {
    // Simple extraction - can be enhanced with NLP
    const data = {};
    
    // Extract age
    const ageMatch = text.match(/(\d{1,3})\s*(years?|yrs?|age)/i);
    if (ageMatch) data.age = parseInt(ageMatch[1]);
    
    // Extract gender
    if (/male|man|boy|mr/i.test(text)) data.gender = 'Male';
    else if (/female|woman|girl|ms|mrs/i.test(text)) data.gender = 'Female';
    
    // Extract phone
    const phoneMatch = text.match(/(\d{10})/);
    if (phoneMatch) data.phone = phoneMatch[1];
    
    // Extract name (first word or name-like word)
    const words = text.split(/\s+/);
    if (words.length > 0) data.name = words[0];
    
    return data;
}

function resetVoiceForm() {
    document.getElementById('voiceStatus').style.display = 'none';
    document.getElementById('voiceTranscript').style.display = 'none';
    document.getElementById('voiceExtracted').style.display = 'none';
    document.getElementById('voiceResult').style.display = 'none';
    document.getElementById('voiceStartBtn').style.display = 'inline-block';
    document.getElementById('voiceStopBtn').style.display = 'none';
    window.voiceData = null;
}
