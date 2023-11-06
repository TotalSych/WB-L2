// Создаем переменную для активного игрока, для окончания игры и переменную для надписи чей ход
let playerSymbol = "X";
let gameEnded = false;
let changeTurn = document.getElementById("turn");

// Создаем цикл который вешает на каждую клетку event listener
for (let i = 1; i <= 9; i++) {
  document.getElementById(i.toString()).addEventListener("click", function () {
    // Проверяем пустая ли клетка и не закончена ли игра
    if (this.innerHTML === "" && !gameEnded) {
      // Если обе проверки пройдены, то клетка заполняется символом игрока
      this.innerHTML = playerSymbol;
      // Добавляем класс элементу html в зависимости от символа
      this.classList.add(playerSymbol.toLocaleLowerCase());

      // Проверяем не победил ли один из игроков
      checkWin();
      // Меняем активный символ для следующего хода
      if (playerSymbol === "X") {
        playerSymbol = "O";
        changeTurn.textContent = "Ходит: нолик";
      } else {
        playerSymbol = "X";
        changeTurn.textContent = "Ходит: крестик";
      }
    }
  });
}

// Создаем переменные со всеми выигрышными позициями
let winPos = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

// Создаем функцию для проверки победил ли кто-то из игроков
function checkWin() {
  // Внутри функции запускаем цикл, который проверяет нет ли сейчас в игре одной из выигрышных позиций
  for (let i = 0; i < winPos.length; i++) {
    // Проверяем все ли ячейки имеют одинаковый символ
    if (
      document.getElementById(winPos[i][0]).innerHTML === playerSymbol &&
      document.getElementById(winPos[i][1]).innerHTML === playerSymbol &&
      document.getElementById(winPos[i][2]).innerHTML === playerSymbol
    ) {
      // При победе даем ячейкам с выигрышной комбинацией класс win чтобы закрасить их
      document.getElementById(winPos[i][0]).classList.add("win");
      document.getElementById(winPos[i][1]).classList.add("win");
      document.getElementById(winPos[i][2]).classList.add("win");
      gameEnded = true;

      setTimeout(() => {
        if (playerSymbol === "X") {
          changeTurn.textContent = "Нолик победил!";
        } else {
          changeTurn.textContent = "Крестик победил!";
        }
      }, 500);
    }
  }
}

// Добавляем возможность начать игру заново по клику на кнопку
document.getElementById("reset").addEventListener("click", function () {
  // С помощью цикла убираем у каждого элемента значение и лишние классы
  for (let i = 1; i <= 9; i++) {
    document.getElementById(i.toString()).innerHTML = "";
    document.getElementById(i.toString()).classList.remove("x");
    document.getElementById(i.toString()).classList.remove("o");
    document.getElementById(i.toString()).classList.remove("win");
    // Меняем true на false в проверке закончена ли игра
    gameEnded = false;
    // Первым ходит крестик
    playerSymbol = "X";
    changeTurn.textContent = "Ходит: крестик";
  }
});
