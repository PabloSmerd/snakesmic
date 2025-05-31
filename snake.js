const gameArea = document.getElementById('gameArea');
const gridSize = 40;
const gameSize = 640; // ← Исправлено! Теперь соответствует CSS (650px - borders)
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let speed = 200;
let score = 0;
const scoreEl = document.getElementById('score');

let introHidden = false;

// ← Убрал дублирование! Только одна привязка событий
document.addEventListener('keydown', (e) => {
    if (!introHidden && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        document.getElementById('introScreen').style.display = 'none';
        introHidden = true;
    }
    changeDirection(e);
});

function changeDirection(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (gameSize / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (gameSize / gridSize)) * gridSize
        };
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y)); // ← Проверка на столкновение с змейкой
    
    return newFood;
}

function draw() {
    gameArea.innerHTML = '';
    
    // Отрисовка змейки
    snake.forEach(part => {
        const segment = document.createElement('div');
        segment.classList.add('snake');
        segment.style.left = part.x + 'px';
        segment.style.top = part.y + 'px';
        gameArea.appendChild(segment);
    });
    
    // Отрисовка еды
    const foodEl = document.createElement('div');
    foodEl.classList.add('food');
    foodEl.style.left = food.x + 'px';
    foodEl.style.top = food.y + 'px';
    gameArea.appendChild(foodEl);
}

function update() {
    if (direction.x === 0 && direction.y === 0) {
        return;
    }
    
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Столкновение со стеной
    if (head.x < 0 || head.x >= gameSize || head.y < 0 || head.y >= gameSize) {
        alert('Game Over!');
        resetGame();
        return;
    }
    
    // Столкновение с собой
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        alert('Game Over!');
        resetGame();
        return;
    }
    
    snake.unshift(head);
    
    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
        score++;
        scoreEl.textContent = score;
        
        // ← Добавлена проверка скорости игры
        if (speed > 100) {
            speed -= 5; // Ускоряемся по мере роста
            clearInterval(gameInterval);
            gameInterval = setInterval(update, speed);
        }
    } else {
        snake.pop();
    }
    
    draw();
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = spawnFood();
    score = 0;
    speed = 200;
    scoreEl.textContent = score;
    
    // ← Сброс интервала
    clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);
    
    draw();
}

// ← Сохраняем ссылку на интервал для корректного управления
let gameInterval = setInterval(update, speed);

// Первоначальная отрисовка
draw();
