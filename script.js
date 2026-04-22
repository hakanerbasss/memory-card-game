class MemoryGame {
    constructor() {
        this.icons = [
            'fas fa-heart', 'fas fa-star', 'fas fa-moon', 'fas fa-sun',
            'fas fa-cloud', 'fas fa-bolt', 'fas fa-flask', 'fas fa-gem',
            'fas fa-music', 'fas fa-film', 'fas fa-gamepad', 'fas fa-robot',
            'fas fa-rocket', 'fas fa-ghost', 'fas fa-dragon', 'fas fa-crown',
            'fas fa-palette', 'fas fa-code', 'fas fa-key', 'fas fa-lock',
            'fas fa-tree', 'fas fa-umbrella', 'fas fa-snowflake', 'fas fa-fire',
            'fas fa-water', 'fas fa-leaf', 'fas fa-feather', 'fas fa-paw',
            'fas fa-fish', 'fas fa-bug', 'fas fa-cat', 'fas fa-dog',
            'fas fa-hippo', 'fas fa-kiwi-bird', 'fas fa-spider', 'fas fa-otter'
        ];
        
        this.levels = {
            easy: { rows: 4, cols: 4 },
            medium: { rows: 4, cols: 5 },
            hard: { rows: 5, cols: 6 }
        };
        
        this.currentLevel = 'easy';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameTime = 0;
        this.timer = null;
        this.canFlip = true;
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.createBoard();
    }
    
    cacheElements() {
        this.gameBoard = document.getElementById('gameBoard');
        this.timerElement = document.getElementById('timer');
        this.movesElement = document.getElementById('moves');
        this.scoreElement = document.getElementById('score');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.diffButtons = document.querySelectorAll('.diff-btn');
        this.message = document.getElementById('message');
        this.closeMessage = document.getElementById('closeMessage');
        this.finalTime = document.getElementById('finalTime');
        this.finalMoves = document.getElementById('finalMoves');
        this.finalScore = document.getElementById('finalScore');
        this.messageTitle = document.getElementById('messageTitle');
        this.messageText = document.getElementById('messageText');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.closeMessage.addEventListener('click', () => this.hideMessage());
        
        this.diffButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.diffButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = e.target.dataset.level;
                this.createBoard();
                if (this.gameStarted) {
                    this.resetGame();
                }
            });
        });
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        const level = this.levels[this.currentLevel];
        const totalCards = level.rows * level.cols;
        const neededIcons = totalCards / 2;
        
        // Rastgele icon seç
        const selectedIcons = this.shuffleArray([...this.icons]).slice(0, neededIcons);
        const cardIcons = [...selectedIcons, ...selectedIcons];
        const shuffledIcons = this.shuffleArray(cardIcons);
        
        // Grid yapısını ayarla
        this.gameBoard.style.gridTemplateColumns = `repeat(${level.cols}, 1fr)`;
        
        // Kartları oluştur
        shuffledIcons.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.icon = icon;
            card.dataset.index = index;
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.innerHTML = '<i class="fas fa-question"></i>';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.innerHTML = `<i class="${icon}"></i>`;
            
            card.appendChild(cardBack);
            card.appendChild(cardFront);
            
            card.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(card);
        });
        
        this.cards = Array.from(document.querySelectorAll('.card'));
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.startBtn.disabled = true;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Oyun Devam Ediyor';
        this.startBtn.style.opacity = '0.7';
        
        this.startTimer();
        this.updateStats();
    }
    
    startTimer() {
        this.gameTime = 0;
        this.timer = setInterval(() => {
            this.gameTime++;
            this.timerElement.textContent = this.gameTime;
        }, 1000);
    }
    
    flipCard(card) {
        if (!this.gameStarted || !this.canFlip || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched') || 
            this.flippedCards.length >= 2) {
            return;
        }
        
        card.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }
    
    checkMatch() {
        this.canFlip = false;
        
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.dataset.icon === card2.dataset.icon;
        
        if (isMatch) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.flippedCards = [];
                this.canFlip = true;
                this.matchedPairs++;
                this.score += 100;
                this.updateStats();
                
                const totalPairs = (this.levels[this.currentLevel].rows * this.levels[this.currentLevel].cols) / 2;
                if (this.matchedPairs === totalPairs) {
                    this.endGame();
                }
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
                this.canFlip = true;
            }, 1000);
        }
    }
    
    updateStats() {
        this.movesElement.textContent = this.moves;
        this.scoreElement.textContent = this.score;
        
        // Zaman bazlı bonus
        if (this.gameTime > 0) {
            const timeBonus = Math.max(0, 500 - this.gameTime * 2);
            const moveBonus = Math.max(0, 200 - this.moves);
            this.score = timeBonus + moveBonus + (this.matchedPairs * 100);
            this.scoreElement.textContent = this.score;
        }
    }
    
    showHint() {
        if (!this.gameStarted || this.flippedCards.length > 0) return;
        
        // Eşleşmemiş kartları bul
        const unmatchedCards = this.cards.filter(card => 
            !card.classList.contains('matched')
        );
        
        if (unmatchedCards.length < 2) return;
        
        // Rastgele 2 kartı göster
        const [card1, card2] = this.shuffleArray(unmatchedCards).slice(0, 2);
        
        card1.classList.add('flipped');
        card2.classList.add('flipped');
        
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
        
        // Hint kullanımı için puan düş
        this.score = Math.max(0, this.score - 50);
        this.updateStats();
    }
    
    endGame() {
        clearInterval(this.timer);
        
        // Skor hesapla
        const timeBonus = Math.max(0, 1000 - this.gameTime * 5);
        const moveBonus = Math.max(0, 500 - this.moves * 2);
        const finalScore = timeBonus + moveBonus + 1000;
        
        // Mesajı göster
        this.finalTime.textContent = this.gameTime;
        this.finalMoves.textContent = this.moves;
        this.finalScore.textContent = finalScore;
        
        let title = "Tebrikler! 🎉";
        let text = "Oyunu başarıyla tamamladın!";
        
        if (this.gameTime < 60) {
            title = "Mükemmel! ⚡";
            text = "Çok hızlı tamamladın!";
        } else if (this.moves < 20) {
            title = "Harika! 🧠";
            text = "Çok az hamleyle tamamladın!";
        }
        
        this.messageTitle.textContent = title;
        this.messageText.textContent = text;
        this.message.classList.add('show');
    }
    
    hideMessage() {
        this.message.classList.remove('show');
        this.resetGame();
    }
    
    resetGame() {
        clearInterval(this.timer);
        this.gameStarted = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameTime = 0;
        this.flippedCards = [];
        this.canFlip = true;
        
        this.startBtn.disabled = false;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Oyunu Başlat';
        this.startBtn.style.opacity = '1';
        
        this.timerElement.textContent = '0';
        this.movesElement.textContent = '0';
        this.scoreElement.textContent = '0';
        
        this.createBoard();
    }
}

// Oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    const game = new MemoryGame();
    
    // Oyun başlangıç animasyonu
    setTimeout(() => {
        document.querySelectorAll('.card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('flipped');
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 1000);
            }, index * 100);
        });
    }, 500);
});