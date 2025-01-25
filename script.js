const boardSize = 4;
let gameState = [];
let score = 0;

// Инициализация игры
function initializeGame() {
    gameState = Array(boardSize)
        .fill(null)
        .map(() => Array(boardSize).fill(0));
    score = 0;
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

// Обработка перемещения
function move(direction) {
    const merged = new Set();
    let moved = false; // Флаг, отслеживающий изменения в игровом поле

    const moveLine = (line) => {
        const filtered = line.filter((value) => value !== 0);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1] && !merged.has(i)) {
                filtered[i] *= 2;
                score += filtered[i];
                filtered[i + 1] = 0;
                merged.add(i);
                moved = true; // Плитки объединились
            }
        }
        return filtered.filter((value) => value !== 0);
    };

    for (let i = 0; i < boardSize; i++) {
        const line = [];
        for (let j = 0; j < boardSize; j++) {
            line.push(
                direction === 'left' || direction === 'right'
                    ? gameState[i][j]
                    : gameState[j][i]
            );
        }

        const originalLine = [...line]; // Сохраняем оригинальную строку/столбец для сравнения
        const movedLine = moveLine(direction === 'right' || direction === 'down' ? line.reverse() : line);
        const finalLine = direction === 'right' || direction === 'down' ? movedLine.reverse() : movedLine;

        for (let j = 0; j < boardSize; j++) {
            const value = finalLine[j] || 0;
            if (direction === 'left' || direction === 'right') {
                if (gameState[i][j] !== value) moved = true; // Изменение в плитке
                gameState[i][j] = value;
            } else {
                if (gameState[j][i] !== value) moved = true; // Изменение в плитке
                gameState[j][i] = value;
            }
        }

        // Если строка/столбец не изменился, перемещение не было
        if (JSON.stringify(originalLine) !== JSON.stringify(finalLine)) {
            moved = true;
        }
    }

    // Спавним новую плитку только если что-то изменилось
    if (moved) {
        spawnNewTile();
        renderBoard();
        document.getElementById('score').innerText = `Score: ${score}`;
    }
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
