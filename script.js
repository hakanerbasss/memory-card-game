// Oyun değişkenleri
let game = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    moves: 0,
    score: 0,
    time: 0,
    timer: null,
    gameStarted: false,
    gameOver: false,
    difficulty: 'easy',
    hints: 3,
    canFlip: true,
    soundManager: null
};

// Icon listesi (Font Awesome)
const icons = [
    'fa-heart', 'fa-star', 'fa-moon', 'fa-sun', 'fa-cloud', 'fa-bolt',
    'fa-flag', 'fa-gem', 'fa-key', 'fa-crown', 'fa-rocket', 'fa-ghost',
    'fa-dragon', 'fa-robot', 'fa-cat', 'fa-dog', 'fa-fish', 'fa-hippo',
    'fa-car', 'fa-bicycle', 'fa-plane', 'fa-ship', 'fa-train', 'fa-umbrella',
    'fa-music', 'fa-camera', 'fa-gamepad', 'fa-tv', 'fa-mobile', 'fa-laptop',
    'fa-tree', 'fa-leaf', 'fa-seedling', 'fa-feather', 'fa-snowflake', 'fa-fire'
];

// Zorluk seviyeleri
const difficulties = {
    easy: { rows: 4, cols: 4, pairs: 8 },
    medium: { rows: 4, cols: 5, pairs: 10 },
    hard: { rows: 5, cols: 6, pairs: 15 }
};

// DOM elementleri
const elements = {
    gameBoard: document.getElementById('gameBoard'),
    timer: document.getElementById('timer'),
    moves: document.getElementById('moves'),
    score: document.getElementById('score'),
    hints: document.getElementById('hints'),
    startBtn: document.getElementById('startBtn'),
    hintBtn: document.getElementById('hintBtn'),
    restartBtn: document.getElementById('restartBtn'),
    muteBtn: document.getElementById('muteBtn'),
    volumeSlider: document.getElementById('volumeSlider'),
    gameResult: document.getElementById('gameResult'),
    finalTime: document.getElementById('finalTime'),
    finalMoves: document.getElementById('finalMoves'),
    finalScore: document.getElementById('finalScore'),
    performance: document.getElementById('performance'),
    resultMessage: document.getElementById('resultMessage'),
    playAgainBtn: document.getElementById('playAgainBtn')
};

// Ses yöneticisini başlat
function initSoundManager() {
    if (typeof SoundManager !== 'undefined') {
        game.soundManager = new SoundManager();
        updateVolumeDisplay();
    }
}

// Ses kontrollerini ayarla
function setupSoundControls() {
    if (!elements.muteBtn || !elements.volumeSlider) return;
    
    elements.muteBtn.addEventListener('click', () => {
        if (game.soundManager) {
            const isMuted = game.soundManager.toggleMute();
            elements.muteBtn.innerHTML = isMuted ? 
                '<i class="fas fa-volume-mute"></i> Ses Kapalı' : 
                '<i class="fas fa-volume-up"></i> Ses Açık';
            elements.muteBtn.classList.toggle('muted', isMuted);
            
            // Buton tıklama sesi
            if (!isMuted) {
                game.soundManager.play('buttonClick');
            }
        }
    });
    
    elements.volumeSlider.addEventListener('input', (e) => {
        if (game.soundManager) {
            const volume = e.target.value / 100;
            game.soundManager.setVolume(volume);
            updateVolumeDisplay();
            
            // Test sesi çal
            if (volume > 0) {
                setTimeout(() => {
                    game.soundManager.play('buttonClick');
                }, 100);
            }
        }
    });
}

// Ses seviyesi görüntüsünü güncelle
function updateVolumeDisplay() {
    if (game.soundManager) {
        const volumePercent = Math.round(game.soundManager.volume * 100);
        elements.volumeSlider.value = volumePercent;
    }
}

// Oyunu başlat
function startGame() {
    if (game.gameStarted) return;
    
    resetGame();
    initGame();
    
    // Oyun başlangıç sesi
    if (game.soundManager) {
        game.soundManager.play('gameStart');
    }
    
    game.gameStarted = true;
    game.gameOver = false;
    elements.startBtn.disabled = true;
    elements.hintBtn.disabled = false;
    elements.restartBtn.disabled = false;
    elements.gameResult.style.display = 'none';
    
    // Timer'ı başlat
    game.timer = setInterval(updateTimer, 1000);
    
    // Buton metnini güncelle
    elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Oyun Devam Ediyor';
    elements.startBtn.classList.add('disabled');
}

// Oyunu sıfırla
function resetGame() {
    clearInterval(game.timer);
    game.cards = [];
    game.flippedCards = [];
    game.matchedPairs = 0;
    game.moves = 0;
    game.score = 0;
    game.time = 0;
    game.gameStarted = false;
    game.gameOver = false;
    game.hints = 3;
    game.canFlip = true;
    
    // UI'ı güncelle
    elements.timer.textContent = '00:00';
    elements.moves.textContent = '0';
    elements.score.textContent = '0';
    elements.hints.textContent = '3';
    elements.gameBoard.innerHTML = '';
    
    // Butonları sıfırla
    elements.startBtn.disabled = false;
    elements.hintBtn.disabled = true;
    elements.restartBtn.disabled = true;
    elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Oyunu Başlat';
    elements.startBtn.classList.remove('disabled');
}

// Oyunu başlat
function initGame() {
    const difficulty = difficulties[game.difficulty];
    game.totalPairs = difficulty.pairs;
    
    // Icon'ları seç ve karıştır
    const selectedIcons = [...icons].slice(0, difficulty.pairs);
    const cardIcons = [...selectedIcons, ...selectedIcons];
    shuffleArray(cardIcons);
    
    // Oyun tahtasını ayarla
    elements.gameBoard.style.gridTemplateColumns = `repeat(${difficulty.cols}, 1fr)`;
    elements.gameBoard.style.gridTemplateRows = `repeat(${difficulty.rows}, 1fr)`;
    
    // Kartları oluştur
    cardIcons.forEach((icon, index) => {
        const card = createCard(icon, index);
        game.cards.push(card);
        elements.gameBoard.appendChild(card.element);
    });
}

// Kart oluştur
function createCard(icon, id) {
    const card = {
        id: id,
        icon: icon,
        flipped: false,
        matched: false,
        element: null
    };
    
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.id = id;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.innerHTML = `<i class="fas ${icon}"></i>`;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.innerHTML = '<i class="fas fa-question"></i>';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);
    
    cardElement.addEventListener('click', () => flipCard(card));
    card.element = cardElement;
    
    return card;
}

// Kart çevir
function flipCard(card) {
    if (!game.canFlip || !game.gameStarted || game.gameOver) return;
    if (card.flipped || card.matched) return;
    if (game.flippedCards.length >= 2) return;
    
    // Kart çevirme sesi
    if (game.soundManager) {
        game.soundManager.play('cardFlip');
    }
    
    card.flipped = true;
    card.element.classList.add('flipped');
    game.flippedCards.push(card);
    
    if (game.flippedCards.length === 2) {
        game.canFlip = false;
        game.moves++;
        elements.moves.textContent = game.moves;
        
        setTimeout(checkMatch, 800);
    }
}

// Eşleşmeyi kontrol et
function checkMatch() {
    const [card1, card2] = game.flippedCards;
    
    if (card1.icon === card2.icon) {
        // Eşleşme başarılı
        card1.matched = true;
        card2.matched = true;
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        
        // Başarılı eşleşme sesi
        if (game.soundManager) {
            game.soundManager.play('matchSuccess');
        }
        
        game.matchedPairs++;
        
        // Puan hesapla
        const timeBonus = Math.max(0, 300 - game.time);
        const movesBonus = Math.max(0, 50 - game.moves);
        const baseScore = 100;
        const matchScore = baseScore + timeBonus + movesBonus;
        
        game.score += matchScore;
        elements.score.textContent = game.score;
        
        // Tüm eşleşmeler tamamlandı mı?
        if (game.matchedPairs === game.totalPairs) {
            endGame();
        }
    } else {
        // Eşleşme başarısız
        card1.flipped = false;
        card2.flipped = false;
        
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            
            // Başarısız eşleşme sesi
            if (game.soundManager) {
                game.soundManager.play('matchFail');
            }
        }, 800);
    }
    
    game.flippedCards = [];
    game.canFlip = true;
}

// Oyunu bitir
function endGame() {
    clearInterval(game.timer);
    game.gameOver = true;
    game.gameStarted = false;
    
    // Oyun bitiş sesi
    if (game.soundManager) {
        game.soundManager.play('gameEnd');
    }
    
    // Performansı hesapla
    const performance = calculatePerformance();
    
    // Sonuçları göster
    elements.finalTime.textContent = formatTime(game.time);
    elements.finalMoves.textContent = game.moves;
    elements.finalScore.textContent = game.score;
    elements.performance.textContent = performance.level;
    elements.resultMessage.textContent = performance.message;
    
    elements.gameResult.style.display = 'block';
    
    // Butonları güncelle
    elements.startBtn.disabled = false;
    elements.startBtn.innerHTML = '<i class="fas fa-play"></i> Yeni Oyun';
    elements.startBtn.classList.remove('disabled');
}

// Performans hesapla
function calculatePerformance() {
    const timePerPair = game.time / game.totalPairs;
    const movesPerPair = game.moves / game.totalPairs;
    
    let level, message;
    
    if (timePerPair < 5 && movesPerPair < 2) {
        level = 'Mükemmel';
        message = 'İnanılmaz! Hafızan harika çalışıyor! 🏆';
    } else if (timePerPair < 8 && movesPerPair < 3) {
        level = 'Çok İyi';
        message = 'Harika performans! Hafızan çok güçlü! ⭐';
    } else if (timePerPair < 12 && movesPerPair < 4) {
        level = 'İyi';
        message = 'Güzel oynadın! Daha iyi olabilirsin! 👍';
    } else if (timePerPair < 20 && movesPerPair < 6) {
        level = 'Orta';
        message = 'Fena değil! Biraz daha pratik yapmalısın! 💪';
    } else {
        level = 'Geliştirilmeli';
        message = 'Pratik yaparak daha iyi olabilirsin! 📚';
    }
    
    return { level, message };
}

// Timer'ı güncelle
function updateTimer() {
    game.time++;
    elements.timer.textContent = formatTime(game.time);
}

// Zamanı formatla
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// İpucu kullan
function useHint() {
    if (!game.gameStarted || game.gameOver || game.hints <= 0) return;
    
    // İpucu sesi
    if (game.soundManager) {
        game.soundManager.play('hintSound');
    }
    
    game.hints--;
    elements.hints.textContent = game.hints;
    
    // İpucu puanı düşür
    game.score = Math.max(0, game.score - 50);
    elements.score.textContent = game.score;
    
    // Eşleşmemiş kartları bul
    const unmatchedCards = game.cards.filter(card => !card.matched && !card.flipped);
    if (unmatchedCards.length < 2) return;
    
    // Rastgele bir eşleşme bul
    const iconsMap = new Map();
    let matchFound = false;
    let card1, card2;
    
    for (const card of unmatchedCards) {
        if (iconsMap.has(card.icon)) {
            card1 = iconsMap.get(card.icon);
            card2 = card;
            matchFound = true;
            break;
        }
        iconsMap.set(card.icon, card);
    }
    
    if (matchFound && card1 && card2) {
        // İpucu animasyonu
        card1.element.classList.add('hint');
        card2.element.classList.add('hint');
        
        setTimeout(() => {
            card1.element.classList.remove('hint');
            card2.element.classList.remove('hint');
        }, 2000);
    }
    
    // İpucu butonunu güncelle
    if (game.hints <= 0) {
        elements.hintBtn.disabled = true;
        elements.hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> İpucu Yok';
    }
}

// Dizi karıştırma
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Zorluk seviyesini değiştir
function changeDifficulty(level) {
    if (game.gameStarted) {
        if (!confirm('Oyun devam ediyor. Zorluk değiştirilirse mevcut oyun kaybolacak. Devam etmek istiyor musunuz?')) {
            return;
        }
        resetGame();
    }
    
    game.difficulty = level;
    
    // Butonları güncelle
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        }
    });
}

// Event listener'ları kur
function setupEventListeners() {
    // Zorluk butonları
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeDifficulty(btn.dataset.level);
            
            // Buton tıklama sesi
            if (game.soundManager) {
                game.soundManager.play('buttonClick');
            }
        });
    });
    
    // Başlat butonu
    elements.startBtn.addEventListener('click', () => {
        startGame();
        
        // Buton tıklama sesi
        if (game.soundManager) {
            game.soundManager.play('buttonClick');
        }
    });
    
    // İpucu butonu
    elements.hintBtn.addEventListener('click', () => {
        useHint();
        
        // Buton tıklama sesi
        if (game.soundManager) {
            game.soundManager.play('buttonClick');
        }
    });
    
    // Yeniden başlat butonu
    elements.restartBtn.addEventListener('click', () => {
        if (confirm('Oyunu yeniden başlatmak istiyor musunuz?')) {
            resetGame();
            startGame();
            
            // Buton tıklama sesi
            if (game.soundManager) {
                game.soundManager.play('buttonClick');
            }
        }
    });
    
    // Tekrar oyna butonu
    elements.playAgainBtn.addEventListener('click', () => {
        resetGame();
        startGame();
        
        // Buton tıklama sesi
        if (game.soundManager) {
            game.soundManager.play('buttonClick');
        }
    });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Ses yöneticisini başlat
    initSoundManager();
    
    // Ses kontrollerini ayarla
    setupSoundControls();
    
    // Event listener'ları kur
    setupEventListeners();
    
    // Varsayılan zorluk
    changeDifficulty('easy');
    
    // Başlangıçta ipucu butonunu devre dışı bırak
    elements.hintBtn.disabled = true;
    elements.restartBtn.disabled = true;
    
    console.log('🎮 Hafıza Kart Oyunu yüklendi!');
    console.log('🔊 Ses efektleri aktif!');
    console.log('🎯 Zorluk seviyeleri: Kolay, Orta, Zor');
    console.log('💡 İpucu sistemi: 3 ipucu hakkı');
});