const gameArea = document.getElementById('gameArea');
const gridSize = 40; // Размер клетки
const gameSize = 400; // Размер поля
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let speed = 200;
let score = 0;
const scoreEl = document.getElementById('score');

// Управление стрелками
let introHidden = false;

document.addEventListener('keydown', (e) => {
    if (!introHidden && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        document.getElementById('introScreen').style.display = 'none';
        introHidden = true;
    }

    changeDirection(e);
});
document.addEventListener('keydown', changeDirection);

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
    return {
        x: Math.floor(Math.random() * (gameSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (gameSize / gridSize)) * gridSize
    };
}

function draw() {
    gameArea.innerHTML = ''; // Очищаем поле

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
    // ⛔ Если направление не выбрано — ничего не делаем
    if (direction.x === 0 && direction.y === 0) {
        return;
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Столкновение со стеной
    if (
        head.x < 0 || head.x >= gameSize ||
        head.y < 0 || head.y >= gameSize
    ) {
        alert('Game is over!');
        resetGame();
        return;
    }

    // Столкновение с собой
    if (snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        alert('Game is over');
        resetGame();
        return;
    }

    // Добавляем новую голову
    snake.unshift(head);

    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    
        // Увеличиваем счёт
        score++;
        scoreEl.textContent = score;
    
        // Не удаляем хвост — змейка станет длиннее на 1
    } else {
        // Удаляем хвост — обычное движение
        snake.pop();
    }
    draw();
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = spawnFood();
    score = 0;
    scoreEl.textContent = score;
    draw();
}

setInterval(update, speed);