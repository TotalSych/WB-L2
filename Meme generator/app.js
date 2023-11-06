// Создаем функцию для создания мема
// В качестве аргументов она получает изображение, верхний текст, нижний текст и размеры текстов
// Создаем переменные для холства с мемом, с помощью метода getContext("2d") получаем объект представляющий из себя двумерный контекст
const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");

function generateMeme(img, topText, bottomText, topTextSize, bottomTextSize) {
  // Приравниваем размер холста к размеру изображения
  canvas.width = img.width;
  canvas.height = img.height;

  // Очищаем холст
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Рисуем главное изображение
  ctx.drawImage(img, 0, 0);

  // Задаем белый стиль текста с черным бортом
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.textAlign = "center";

  // Создаем переменную для размера верхнего текста
  let fontSize = canvas.width * topTextSize;
  ctx.font = `${fontSize}px Impact`;
  ctx.lineWidth = fontSize / 20;

  // Добавляем верхний текст на изображение
  ctx.textBaseline = "top";
  topText.split("\n").forEach((t, i) => {
    ctx.fillText(t, canvas.width / 2, i * fontSize, canvas.width);
    ctx.strokeText(t, canvas.width / 2, i * fontSize, canvas.width);
  });

  // Размер нижнего текста
  fontSize = canvas.width * bottomTextSize;
  ctx.font = `${fontSize}px Impact`;
  ctx.lineWidth = fontSize / 20;

  // Добавляем нижний текст на изображение
  ctx.textBaseline = "bottom";
  bottomText
    .split("\n")
    .reverse() // т.к. нижний текст рисуется снизу вверх
    .forEach((t, i) => {
      ctx.fillText(
        t,
        canvas.width / 2,
        canvas.height - i * fontSize,
        canvas.width
      );
      ctx.strokeText(
        t,
        canvas.width / 2,
        canvas.height - i * fontSize,
        canvas.width
      );
    });
}

// Создаем event listener ожидающий загрузки страницы
window.addEventListener("DOMContentLoaded", (event) => {
  // Создаем переменные для текста инпутов и кнопки
  const topTextInput = document.getElementById("top-text");
  const bottomTextInput = document.getElementById("bottom-text");
  const topTextSizeInput = document.getElementById("top-text-size-input");
  const bottomTextSizeInput = document.getElementById("bottom-text-size-input");
  const imageInput = document.getElementById("image-input");
  const generateBtn = document.getElementById("generate-btn");
  const download = document.getElementById("download");

  // Добавляем event listener для кнопки "Создать"
  generateBtn.addEventListener("click", () => {
    // Читаем изображение как DataURL с помощью FileReader API
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        generateMeme(
          img,
          topTextInput.value,
          bottomTextInput.value,
          topTextSizeInput.value,
          bottomTextSizeInput.value
        );
      };
      download.style.display = "block";
      // Добавляем event listener для кнопки "Скачать изображение"
      download.addEventListener("click", function (e) {
        const link = document.createElement("a");
        link.download = "download.png";
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
      });
    };
    reader.readAsDataURL(imageInput.files[0]);
  });
});
