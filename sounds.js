// Ses efektleri - Base64 formatında
const SoundEffects = {
    // Kart çevirme sesi
    cardFlip: {
        url: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ',
        audio: null
    },
    
    // Eşleşme sesi (başarılı)
    matchSuccess: {
        url: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ',
        audio: null
    },
    
    // Yanlış eşleşme sesi
    matchFail: {
        url: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ',
        audio: null
    },
    
    // Oyun başlangıç sesi
    gameStart: {
        url: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ',
        audio: null
    },
    
    // Oyun bitiş sesi
    gameEnd: {
        url: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ',
        audio: null
    },
    
    // Buton tıklama sesi
    buttonClick: {
        url: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ',
        audio: null
    },
    
    // İpucu sesi
    hintSound: {
        url: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ',
        audio: null
    }
};

// Ses yöneticisi
class SoundManager {
    constructor() {
        this.sounds = {};
        this.muted = false;
        this.volume = 0.7;
        this.initSounds();
    }
    
    initSounds() {
        // Web Audio API ile basit sesler oluştur
        this.createSounds();
    }
    
    createSounds() {
        // Kart çevirme sesi (kısa bip)
        this.sounds.cardFlip = this.createBeepSound(800, 0.1, 'sine');
        
        // Başarılı eşleşme sesi (yükselen ton)
        this.sounds.matchSuccess = this.createSuccessSound();
        
        // Yanlış eşleşme sesi (alçalan ton)
        this.sounds.matchFail = this.createFailSound();
        
        // Oyun başlangıç sesi (3 kısa bip)
        this.sounds.gameStart = this.createGameStartSound();
        
        // Oyun bitiş sesi (zafer sesi)
        this.sounds.gameEnd = this.createGameEndSound();
        
        // Buton tıklama sesi
        this.sounds.buttonClick = this.createClickSound();
        
        // İpucu sesi
        this.sounds.hintSound = this.createHintSound();
    }
    
    createBeepSound(frequency, duration, type = 'sine') {
        return () => {
            if (this.muted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.log('Ses hatası:', e);
            }
        };
    }
    
    createSuccessSound() {
        return () => {
            if (this.muted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
                
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(this.volume * 0.8, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                console.log('Ses hatası:', e);
            }
        };
    }
    
    createFailSound() {
        return () => {
            if (this.muted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
                oscillator.frequency.exponentialRampToValueAtTime(261.63, audioContext.currentTime + 0.3); // C4
                
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(this.volume * 0.6, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            } catch (e) {
                console.log('Ses hatası:', e);
            }
        };
    }
    
    createGameStartSound() {
        return () => {
            if (this.muted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // 3 kısa bip
                for (let i = 0; i < 3; i++) {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = 600 + (i * 100);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime + (i * 0.1));
                    gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, audioContext.currentTime + (i * 0.1) + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (i * 0.1) + 0.1);
                    
                    oscillator.start(audioContext.currentTime + (i * 0.1));
                    oscillator.stop(audioContext.currentTime + (i * 0.1) + 0.1);
                }
            } catch (e) {
                console.log('Ses hatası:', e);
            }
        };
    }
    
    createGameEndSound() {
        return () => {
            if (this.muted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Zafer melodisi (Do-Mi-Sol-Do)
                const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                
                notes.forEach((freq, index) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'triangle';
                    
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime + (index * 0.15));
                    gainNode.gain.linearRampToValueAtTime(this.volume * 0.7, audioContext.currentTime + (index * 0.15) + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (index * 0.15) + 0.2);
                    
                    oscillator.start(audioContext.currentTime + (index * 0.15));
                    oscillator.stop(audioContext.currentTime + (index * 0.15) + 0.2);
                });
            } catch (e) {
                console.log('Ses hatası:', e);
            }
        };
    }
    
    createClickSound() {
        return () => {
            if (this.muted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 400;
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            } catch (e) {
                console.log('Ses hatası:', e);
            }
        };
    }
    
    createHintSound() {
        return () => {
            if (this.muted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
                oscillator.frequency.exponentialRampToValueAtTime(523.25, audioContext.currentTime + 0.2); // C5
                oscillator.frequency.exponentialRampToValueAtTime(261.63, audioContext.currentTime + 0.4); // C4
                
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(this.volume * 0.4, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                console.log('Ses hatası:', e);
            }
        };
    }
    
    play(soundName) {
        if (this.muted || !this.sounds[soundName]) return;
        this.sounds[soundName]();
    }
    
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
    
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
    }
}

// Global ses yöneticisi
let soundManager = null;

// Sayfa yüklendiğinde ses yöneticisini başlat
document.addEventListener('DOMContentLoaded', () => {
    soundManager = new SoundManager();
});