// Создаем переменные для подсказки, количества попыток, чисел которые не подошли, кнопок, контейнера с игрой и поля ввода попыток
const hint = document.getElementById("hint");
const hintEven = document.getElementById("hintEven");
const numberOfGuessesRef = document.getElementById("number-of-guesses");
const guessedNumbersRef = document.getElementById("guessed-numbers");
const restartButton = document.getElementById("restart");
const game = document.getElementById("game");
const guessInput = document.getElementById("guess");
const checkButton = document.getElementById("check-btn");
const numberMax = document.getElementById("number-max");

let answer;
let numberOfGuesses;
let guessedNumbersArr;

// Создаем стрелочную функцию для кнопки "угадать", которая будет сравнивать число игрока и загаданное число
const play = () => {
  // Переменная для числа игрока
  const userGuess = guessInput.value;
  // Добавляем проверку являются ли полученные данные числом и равно ли оно одному из чисел от 1 до 100
  if (userGuess < 0 || userGuess > 100 || isNaN(userGuess)) {
    // Если одно из условий нарушается, возвращаем и показываем сообщение
    alert("Введите число от 1 до 100");
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
  answer = Math.floor(Math.random() * 100) + 1;
  console.log(answer);
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
  // Возвращаем видимость полю игры
  game.style.display = "grid";
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
