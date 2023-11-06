// Создаем переменные для холста
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
// задаем размер одного квадрата
const grid = 32;
// Создаем массив в котором будут храниться последовательности фигур
var tetrominoSequence = [];

// С помощью двумерного массива следим за тем, что находится в каждой клетке игрового поля
// Размер поля — 10 на 20, и несколько строк ещё находится за видимой областью
var playfield = [];

// Заполняем массив пустыми ячейками
for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

// Задаём формы для каждой фигуры
const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// цвет каждой фигуры
const colors = {
  I: "cyan",
  O: "yellow",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
};

// счётчик
let count = 0;
// текущая фигура в игре
let tetromino = getNextTetromino();
// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
// флаг конца игры, на старте — неактивный
let gameOver = false;

// Создаем функцию, выдающую сулчайное число в диапазоне, по которому будет выбираться фигура
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создаем функцию для создания последовательности появления фигур
function generateSequence() {
  // Переменная с фигурами
  const sequence = ["I", "J", "L", "O", "S", "T", "Z"];

  while (sequence.length) {
    // Случайным образом находим любую из них
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    // Помещаем выбранную фигуру в игровой массив с последовательностями
    tetrominoSequence.push(name);
  }
}

// Создаем функцию с помощью которой получим двумерный массив с названием фигуры, матрицей с которой фигура будет отрисовываться, строкой и столбцом
function getNextTetromino() {
  // Если следующей фигуры нет — генерируем её
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }
  // Берём первую фигуру из массива
  const name = tetrominoSequence.pop();
  // Создаём матрицу
  const matrix = tetrominos[name];

  // I и O стартуют с середины, остальные — чуть левее
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
  const row = name === "I" ? -1 : -2;

  // возвращаем массив данных
  return {
    name: name,
    matrix: matrix,
    row: row,
    col: col,
  };
}

// Создаем функцию для поворота фигур
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));
  // Возвращаем матрицу
  return result;
}

// Добавляем проверку можно ли повернуть или повернуть фигуру
function isValidMove(matrix, cellRow, cellCol) {
  // Проверяем все строки и столбцы
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        // Проверяем выходит ли фигура за границы поля
        (cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // Проверяем пересекается ли фигура с другими фигурами
          playfield[cellRow + row][cellCol + col])
      ) {
        // Если правила нарушаются, возвращаем false
        return false;
      }
    }
  }
  // Если правила не нарушаются, то возвращаем true и фигура продолжает падать вниз
  return true;
}

// Добавляем проверку получился ли целый ряд
function placeTetromino() {
  // обрабатываем все строки и столбцы в игровом поле
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        // если край фигуры после установки вылезает за границы поля, то игра закончилась
        if (tetromino.row + row < 0) {
          return showGameOver();
        }
        // если всё в порядке, то записываем фигуру в массив игрового поля
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // проверяем, чтобы заполненные ряды очистились снизу вверх
  for (let row = playfield.length - 1; row >= 0; ) {
    // если ряд заполнен очищаем его и опускаем всё вниз на одну клетку
    if (playfield[row].every((cell) => !!cell)) {
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r - 1][c];
        }
      }
    } else {
      // переходим к следующему ряду
      row--;
    }
  }
  // получаем следующую фигуру
  tetromino = getNextTetromino();
}

// Добавляем функцию game over
function showGameOver() {
  // прекращаем всю анимацию игры
  cancelAnimationFrame(rAF);
  // ставим флаг окончания
  gameOver = true;
  // рисуем чёрный прямоугольник посередине поля
  context.fillStyle = "black";
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  // пишем надпись белым моноширинным шрифтом по центру
  context.globalAlpha = 1;
  context.fillStyle = "white";
  context.font = "36px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
}

// Добавляем event listener к клавишам
document.addEventListener("keydown", function (e) {
  // Проверяем законча на ли игра, если да, то клавиши не работают
  if (gameOver) return;

  // стрелки влево и вправо
  if (e.which === 37 || e.which === 39) {
    const col =
      e.which === 37
        ? // если влево, то уменьшаем индекс в столбце, если вправо — увеличиваем
          tetromino.col - 1
        : tetromino.col + 1;

    // если так ходить можно, то запоминаем текущее положение
    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  // стрелка вверх — поворот
  if (e.which === 38) {
    // поворачиваем фигуру на 90 градусов
    const matrix = rotate(tetromino.matrix);
    // если так ходить можно — запоминаем
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  // стрелка вниз — ускорить падение
  if (e.which === 40) {
    // смещаем фигуру на строку вниз
    const row = tetromino.row + 1;
    // если опускаться больше некуда — запоминаем новое положение
    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;
      // ставим на место и смотрим на заполненные ряды
      placeTetromino();
      return;
    }
    // запоминаем строку, куда стала фигура
    tetromino.row = row;
  }
});

// Для анимации каждый цикл очищаем холст с игровым поле и отрисовываем его заново соблюдая положение фигур
function loop() {
  // начинаем анимацию
  rAF = requestAnimationFrame(loop);
  // очищаем холст
  context.clearRect(0, 0, canvas.width, canvas.height);

  // рисуем игровое поле с учётом заполненных фигур
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        // рисуем всё на один пиксель меньше, чтобы получился эффект «в клетку»
        context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }

  // рисуем текущую фигуру
  if (tetromino) {
    // фигура сдвигается вниз каждые 35 кадров
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    // даем фигуре её цвет
    context.fillStyle = colors[tetromino.name];

    // отрисовываем фигуру
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          // делаем её на 1 пиксель меньше
          context.fillRect(
            (tetromino.col + col) * grid,
            (tetromino.row + row) * grid,
            grid - 1,
            grid - 1
          );
        }
      }
    }
  }
}

// Запускаем игру
rAF = requestAnimationFrame(loop);
