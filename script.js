// Game State
let gameState = {
    level: 1,
    score: 0,
    wallet: null,
    currentImage: null,
    helpUsed: false,
    maxLevel: 500,
    isPlaying: false
};

// DOM Elements
const gameArea = document.getElementById('gameArea');
const walletPanel = document.getElementById('walletPanel');
const loginBtn = document.getElementById('loginBtn');
const currentLevelSpan = document.getElementById('currentLevel');
const gameImage = document.getElementById('gameImage');
const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const helpBtn = document.getElementById('helpBtn');
const showKeyBtn = document.getElementById('showKeyBtn');
const privateKey = document.getElementById('privateKey');
const walletAddress = document.getElementById('walletAddress');
const top25List = document.getElementById('top25List');

// Game Data
const gameData = {
    levels: [
        { id: 1, name: "CryptoKing", hint: "Known for bullish strategies" },
        { id: 2, name: "NeoTrader", hint: "Specializes in DeFi protocols" },
        { id: 3, name: "MatrixPro", hint: "Expert in algorithmic trading" },
        { id: 4, name: "CyberNinja", hint: "Stealthy trader, rare appearances" },
        { id: 5, name: "ByteMaster", hint: "Controls large byte positions" }
    ],
    leaderboard: [
        { rank: 1, name: "CryptoKing", score: 1250000 },
        { rank: 2, name: "NeoTrader", score: 980000 },
        { rank: 3, name: "MatrixPro", score: 750000 },
        { rank: 4, name: "CyberNinja", score: 600000 },
        { rank: 5, name: "ByteMaster", score: 450000 },
        { rank: 6, name: "DataQueen", score: 320000 },
        { rank: 7, name: "CodeWarrior", score: 280000 },
        { rank: 8, name: "PixelPunk", score: 240000 },
        { rank: 9, name: "NeonGhost", score: 200000 },
        { rank: 10, name: "HackSmith", score: 180000 }
    ]
};

// Initialize Game
function initGame() {
    loadGameBoard();
    loadLeaderboard();
    setupEventListeners();
    
    // Auto-generate wallet on load
    setTimeout(() => {
        generateWallet();
    }, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', () => {
        alert('Login with X feature coming soon!');
        generateWallet();
    });
    
    submitBtn.addEventListener('click', submitGuess);
    helpBtn.addEventListener('click', useHelp);
    showKeyBtn.addEventListener('click', togglePrivateKey);
    
    // Enter key to submit
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuess();
    });
}

// Load Game Board
function loadGameBoard() {
    currentLevelSpan.textContent = gameState.level;
    
    // Update game image
    const levelData = gameData.levels.find(l => l.id === gameState.level) || gameData.levels[0];
    gameImage.src = `https://via.placeholder.com/300x300/FF0040/000000?text=LEVEL+${gameState.level}`;
    gameImage.alt = `Guess the trader - Level ${gameState.level}`;
    
    // Reset input and help
    guessInput.value = '';
    gameState.helpUsed = false;
    gameState.isPlaying = true;
    
    // Reset card flip
    document.querySelector('.card-inner').classList.remove('flipped');
}

// Generate Wallet
function generateWallet() {
    gameState.wallet = {
        address: '0xA4c13ef5d988E614Da2d33B514B530DAF0f80D95',
        privateKey: '0x7f9e8d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e'
    };
    
    showWalletPanel();
}

// Show Wallet Panel
function showWalletPanel() {
    if (gameState.wallet) {
        walletAddress.textContent = gameState.wallet.address;
        privateKey.textContent = gameState.wallet.privateKey;
        walletPanel.classList.remove('hidden');
    }
}

// Toggle Private Key
function togglePrivateKey() {
    privateKey.classList.toggle('revealed');
}

// Submit Guess
function submitGuess() {
    if (!gameState.isPlaying) return;
    
    const guess = guessInput.value.trim();
    if (!guess) {
        showNotification('Please enter your guess!', 'error');
        return;
    }
    
    const levelData = gameData.levels.find(l => l.id === gameState.level) || gameData.levels[0];
    const isCorrect = guess.toLowerCase() === levelData.name.toLowerCase();
    
    if (isCorrect) {
        // Correct answer
        document.getElementById('resultText').textContent = `CORRECT! It's ${levelData.name}`;
        document.querySelector('.card-inner').classList.add('flipped');
        
        gameState.score += 100;
        gameState.isPlaying = false;
        
        showNotification('Correct! +100 points', 'success');
        
        // Next level after delay
        setTimeout(() => {
            if (gameState.level < gameState.maxLevel) {
                gameState.level++;
                loadGameBoard();
            } else {
                showNotification('Congratulations! You completed all levels!', 'success');
            }
        }, 2500);
    } else {
        // Wrong answer
        showNotification('Wrong answer! Try again.', 'error');
        guessInput.value = '';
        guessInput.focus();
    }
}

// Use Help
function useHelp() {
    if (!gameState.isPlaying) return;
    
    if (gameState.helpUsed) {
        showNotification('You already used help for this level!', 'error');
        return;
    }
    
    if (confirm('Use help for 0.005 AVAX?')) {
        const levelData = gameData.levels.find(l => l.id === gameState.level) || gameData.levels[0];
        showNotification(`Hint: ${levelData.hint}`, 'info');
        gameState.helpUsed = true;
    }
}

// Load Leaderboard
function loadLeaderboard() {
    top25List.innerHTML = '';
    
    gameData.leaderboard.forEach(player => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        let rankClass = '';
        let rankIcon = `#${player.rank}`;
        
        if (player.rank === 1) {
            rankClass = 'gold';
            rankIcon = '🥇';
        } else if (player.rank === 2) {
            rankClass = 'silver';
            rankIcon = '🥈';
        } else if (player.rank === 3) {
            rankClass = 'bronze';
            rankIcon = '🥉';
        }
        
        item.innerHTML = `
            <span class="rank ${rankClass} neon-text">${rankIcon}</span>
            <img src="https://via.placeholder.com/60x60/FF0040/000000?text=${player.rank}" class="player-avatar" alt="${player.name}">
            <span class="player-name">${player.name}</span>
            <span class="player-score">${player.score.toLocaleString()} $ARTGA</span>
        `;
        
        top25List.appendChild(item);
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.5s ease;
        max-width: 300px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
            notification.style.borderLeft = '4px solid #00ff00';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ff0040, #cc0033)';
            notification.style.borderLeft = '4px solid #ff0040';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #00d9ff, #0099cc)';
            notification.style.borderLeft = '4px solid #00d9ff';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', initGame);
