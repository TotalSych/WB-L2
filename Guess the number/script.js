// Переменная для подсказки
const hint = document.getElementById("hint");
// Переменная для второй подсказки, четное ли число
const hintEven = document.getElementById("hintEven");
// Переменная для количества попыток
const numberOfGuessesRef = document.getElementById("number-of-guesses");
// Переменная для неправильных попыток
const guessedNumbersRef = document.getElementById("guessed-numbers");
// Переменная для кнопки "заново"
const restartButton = document.getElementById("restart");
// Переменная для поля игры
const game = document.getElementById("game");
// Переменная для поля воода попытки
const guessInput = document.getElementById("guess");
// Переменная для кнопки "угадать"
const checkButton = document.getElementById("check-btn");
// Переменная для начального экрана с выбором максимального числа
const startScreen = document.getElementById("start-screen");
// Переменная для кнопки "начать игру"
const startButton = document.getElementById("start");
// Переменная для текста игры
const gameTitle = document.getElementById("game-title");
// Переменная для максимального числа
const numberMaxRef = document.getElementById("number-max");

// Переменная для ответа
let answer;
// Переменная для количества попыток
let numberOfGuesses;
// Переменная для масива с неправильными попытками
let guessedNumbersArr;
// Переменная для максимального числа
let numberMax;

// Функция для генерации случайного числа от 1 до указанного значения
const generateNumber = () => {
  answer = Math.floor(Math.random() * numberMax) + 1;
  console.log(answer);
};

// Функция для начала игры
startButton.addEventListener("click", () => {
  // даем значение переменной для максимального числа
  numberMax = numberMaxRef.value;
  // Создаем случайное число
  generateNumber();
  // Скрываем начальный экран
  startScreen.style.display = "none";
  // Показываем экран игры
  game.style.display = "grid";
  // Добавляем текст с правилами игры
  gameTitle.innerHTML = `Угадайте число от 1 до ${numberMax}`;
});

// Создаем стрелочную функцию для кнопки "угадать", которая будет сравнивать число игрока и загаданное число
const play = () => {
  // Переменная для числа игрока
  const userGuess = guessInput.value;
  console.log(userGuess);
  // Добавляем проверку являются ли полученные данные числом и равно ли оно одному из чисел от 1 до 100
  if (userGuess < 0 || userGuess > numberMax.value || isNaN(userGuess)) {
    // Если одно из условий нарушается, возвращаем и показываем сообщение
    alert(`Введите число от 1 до ${numberMax}`);
    return;
  }
  // Если полученное число подходит, добавляем его в массив попыток и добавляем 1 к количеству попыток
  guessedNumbersArr.push(userGuess);
  numberOfGuesses += 1;
  // Сравниваем число игрока с загаданным числом и в случае ошибки даем подсказку
  if (userGuess != answer) {
    if (userGuess < answer) {
      hint.innerHTML = "Слишком маленькое число, попробуйте еще раз!";
    } else {
      hint.innerHTML = "Слишком большое число, попробуйте еще раз!";
    }
    numberOfGuessesRef.innerHTML = `<span>Количество попыток:</span> ${numberOfGuesses}`;
    guessedNumbersRef.innerHTML = `<span>Неправильный попытки:</span> ${guessedNumbersArr.join(
      ","
    )}`;
    // убираем класс ошибки и добавляем его снова с коротким промежутком, чтобы сообщение снова появилось при ошибке
    hint.classList.remove("error");
    setTimeout(() => {
      hint.classList.add("error");
    }, 10);
    // Добавляем подсказку при накоплении 3 ошибок
    if (numberOfGuesses >= 3) {
      // Проверяем есть ли остаток при делении ответа на 2 и исходя из этого даем подсказку
      if (answer % 2 == 0) {
        hintEven.classList.add("error");
        hintEven.innerHTML = "💡 Подсказка: загаданное число четное";
      } else {
        hintEven.classList.add("error");
        hintEven.innerHTML = "💡 Подсказка: загаданное число нечетное";
      }
    }
  } else {
    // При победе меняем текст и фон подсказки на победный
    hint.innerHTML = `Вы победили!<br>Правильное число было <span>${answer}</span>.<br>Вы смогли его угадать с <span>${numberOfGuesses}</span> попытки.`;
    hint.classList.add("success");
    // Убираем вторую подсказку и поле с игрой
    hintEven.classList.remove("error");
    hintEven.innerHTML = "";
    game.style.display = "none";
    // Добавляем кнопку "заново"
    restartButton.style.display = "block";
  }
};

// Создаем функцию которая создаст случайное число и напишет правильный ответ, обнулит количество попыток, массив неправильных попыток, значение в поле воода и уберет у подсказки классы ошибки и победы
const init = () => {
  numberOfGuesses = 0;
  guessedNumbersArr = [];
  guessInput.value = "";
  numberOfGuessesRef.innerHTML = "Количество попыток: 0";
  hint.classList.remove("success", "error");
};

// Добавляем возможность нажатия кнопки "Угадать" по нажатию клавиши Enter
guessInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    event.preventDefault();
    play();
  }
});

// Добавляем функционал кнопке рестарт по клику
restartButton.addEventListener("click", () => {
  // Возвращаем видимость полю выбора числа
  startScreen.style.display = "block";
  // Убираем видимость кнопки рестарт
  restartButton.style.display = "none";
  // убираем подсказку
  hint.innerHTML = "";
  // Убираем класс победы у подсказки
  hint.classList.remove("success");
  // вызываем функцию init для генерации нового числа
  init();
});

// Привязываем функцию с логикой игры к кнопке "Угадать"
checkButton.addEventListener("click", play);
// При загрузке страницы запускаем функцию init чтобы началась игра
window.addEventListener("load", init);
