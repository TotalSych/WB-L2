// Переменная для массива
let array = [];
// Переменная для столбцов
let bars = [];
// Переменная для анимации
let animation;
let stop = false;
// Задержка в миллисекундах
let delay = 100;

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");

// Создаем функцию для генерации нового случайного массива
function generateArray() {
  // Очищаем массив и полоски
  array = [];
  bars = [];
  const container = document.getElementById("array-container");
  container.innerHTML = "";

  // Генерируем массив случайных чисел
  for (let i = 0; i < 50; i++) {
    array.push(Math.floor(Math.random() * 200) + 1);
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${array[i]}px`;
    container.appendChild(bar);
    bars.push(bar);
  }
}
generateArray();

// Создаем функцию для начала сортировки, которая будет прикреплена к кнопке
async function startSorting() {
  // Отключаем все кнопки кроме кнопки стоп
  disableButtons();
  // Определяем тип сортировки
  const sortingType = document.getElementById("sorting-select").value;
  stop = false;
  // Исходя из типа запускаем функцию
  if (sortingType === "bubble") {
    await bubbleSort();
  } else if (sortingType === "selection") {
    await selectionSort();
  } else if (sortingType === "insertion") {
    await insertionSort();
  } else if (sortingType === "merge") {
    await mergeSort(0, array.length - 1);
  } else if (sortingType === "quick") {
    await quickSort(0, array.length - 1);
  }
  // После завершения сортировки активируем кнопки
  enableButtons();
}

// Функция отключения кнопок
function disableButtons() {
  startButton.disabled = true;
  stopButton.disabled = false;
}

// Функция включения кнопок
function enableButtons() {
  startButton.disabled = false;
  stopButton.disabled = true;
}

// По нажатию на кнопку стоп, stop = true
stopButton.addEventListener("click", () => {
  stop = true;
  enableButtons();
});

// Добавляем задержку после каждого шага сортировки
async function sleep() {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function swap(index1, index2) {
  // Анимируем перестановку
  bars[index1].style.backgroundColor = "red";
  bars[index2].style.backgroundColor = "red";
  await sleep();
  if (stop) {
    return; // Остановить сортировку, если stop = true
  }
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  bars[index1].style.height = `${array[index1]}px`;
  bars[index2].style.height = `${array[index2]}px`;
  bars[index1].style.backgroundColor = "blue";
  bars[index2].style.backgroundColor = "blue";
  await sleep();
}

// Добавляем сортировку пузырьком
async function bubbleSort() {
  const length = array.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
      }
    }
  }
}

// Добавляем сортировку выбором
async function selectionSort() {
  const length = array.length;
  for (let i = 0; i < length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      await swap(i, minIndex);
    }
  }
}

// Добавляем сортировку вставками
async function insertionSort() {
  const length = array.length;
  for (let i = 1; i < length; i++) {
    let j = i;
    while (j > 0 && array[j] < array[j - 1]) {
      await swap(j, j - 1);
      j--;
    }
  }
}

// Добавляем сортировку слиянием
async function mergeSort(start, end) {
  if (start < end) {
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
  }
}

async function merge(start, mid, end) {
  const auxArray = [];
  let i = start;
  let j = mid + 1;
  let k = 0;

  // Объединяем два отсортированных массива
  while (i <= mid && j <= end) {
    if (array[i] <= array[j]) {
      auxArray[k++] = array[i++];
    } else {
      auxArray[k++] = array[j++];
    }
  }

  while (i <= mid) {
    auxArray[k++] = array[i++];
  }

  while (j <= end) {
    auxArray[k++] = array[j++];
  }

  // Копируем объединенный массив обратно в изначальный массив
  for (let x = start; x <= end; x++) {
    array[x] = auxArray[x - start];
    bars[x].style.height = `${array[x]}px`;
  }
  await sleep();
}

async function partition(low, high) {
  const pivotValue = array[high];
  let pivotIndex = low - 1;
  for (let i = low; i <= high; i++) {
    if (array[i] < pivotValue) {
      pivotIndex++;
      await swap(i, pivotIndex);
    }
  }
  await swap(high, pivotIndex + 1);
  return pivotIndex + 1;
}

// Добавляем быструю сортировку
async function quickSort(low, high) {
  if (low < high) {
    const pivotIndex = await partition(low, high);
    await quickSort(low, pivotIndex - 1);
    await quickSort(pivotIndex + 1, high);
  }
}

// Добавляем обработчик для кнопки "Остановить"
stopButton.addEventListener("click", stopSorting);

function stopSorting() {
  stop = true;
  enableButtons();
}
