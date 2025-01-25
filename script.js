const boardSize = 4;
let gameState = [];
let score = 0;
let record = localStorage.getItem('record') || 0;
let isMoving = false; // Флаг для предотвращения повторного движения

// Звук движения
const moveSound = document.getElementById('move-sound');

// Инициализация игры
function initializeGame() {
    gameState = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
    score = 0;
    updateRecord();
    document.getElementById('score').innerText = `Score: ${score}`;
    spawnNewTile();
    spawnNewTile();
    renderBoard();
}

// Рендер игрового поля
function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const tileValue = gameState[row][col];
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.value = tileValue;
            if (tileValue > 0) {
                tile.innerText = tileValue;
            }
            board.appendChild(tile);
        }
    }
}

// Спавн новой плитки
function spawnNewTile() {
    const emptyCells = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (gameState[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length === 0) return;
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[row][col] = Math.random() < 0.9 ? 2 : 4;
}

// Обновление рекорда
function updateRecord() {
    if (score > record) {
        record = score;
        localStorage.setItem('record', record);
    }
    document.getElementById('record').innerText = `Record: ${record}`;
}

// Обработка перемещения
function move(direction) {
    if (isMoving) return; // Предотвращение повторного движения
    isMoving = true;

    let moved = false;

    const moveLine = (line) => {
        const filtered = line.filter(value => value !== 0);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                score += filtered[i];
                filtered[i + 1] = 0;
                moved = true;
            }
        }
        return filtered.filter(value => value !== 0);
    };

    for (let i = 0; i < boardSize; i++) {
        const line = [];
        for (let j = 0; j < boardSize; j++) {
            line.push(direction === 'left' || direction === 'right' ? gameState[i][j] : gameState[j][i]);
        }
        const movedLine = moveLine(direction === 'right' || direction === 'down' ? line.reverse() : line);
        const finalLine = direction === 'right' || direction === 'down' ? movedLine.reverse() : movedLine;

        for (let j = 0; j < boardSize; j++) {
            const value = finalLine[j] || 0;
            if (direction === 'left' || direction === 'right') {
                if (gameState[i][j] !== value) moved = true;
                gameState[i][j] = value;
            } else {
                if (gameState[j][i] !== value) moved = true;
                gameState[j][i] = value;
            }
        }
    }

    if (moved) {
        spawnNewTile(); // Создать новую плитку только если было движение
        renderBoard();
        document.getElementById('score').innerText = `Score: ${score}`;
        updateRecord();
        moveSound.play(); // Проигрывание звука
    }

    setTimeout(() => {
        isMoving = false; // Сбрасываем блокировку движения
    }, 150); // Минимальная задержка для обработки
}

// Управление клавишами
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
});

// Кнопки управления
document.getElementById('restart-button').addEventListener('click', initializeGame);
document.getElementById('new-game-button').addEventListener('click', initializeGame);

// Запуск игры
initializeGame();
