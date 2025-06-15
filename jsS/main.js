// Оголошує змінну для вибраного числа, яке буде вставлене в клітинку
let write = "";

// Встановлює початковий рівень складності головоломки (кількість порожніх клітинок)
let sudokudiff = 35;

// Створює 9x9 двовимірний масив для представлення судоку, заповнений нулями (порожні клітинки)
let sudokuGrid = Array(9).fill().map(() => Array(9).fill(0));

// Масив для збереження ID клітинок з початковими числами, щоб знати, які числа були згенеровані
let generatedNumbersIds = [];

// Функція для вибору числа, яке потрібно вставити
function number(numbers) {
    write = numbers; // Зберігає вибране число
    
    if (write == null) { 
        document.getElementById("number").style.fontSize = "65px"; // Якщо число не вибрано, зменшує шрифт
    }
    else {
        document.getElementById("number").style.fontSize = "80px"; // Якщо число вибрано, збільшує шрифт
    }

    document.getElementById("number").textContent = `Number: ${numbers}`; // Відображає вибране число на сторінці
}

// Перевіряє, чи можна поставити число в задану клітинку
function canPlaceNumber(row, col, number) {
    if (sudokuGrid[row].includes(number)) return false; // Перевіряє, чи є число у рядку

    for (let i = 0; i < 9; i++) {
        if (sudokuGrid[i][col] === number) return false; // Перевіряє, чи є число у колонці
    }

    let startRow = Math.floor(row / 3) * 3; // Визначає початковий рядок 3x3 блоку
    let startCol = Math.floor(col / 3) * 3; // Визначає початкову колонку 3x3 блоку

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudokuGrid[startRow + i][startCol + j] === number) return false; // Перевіряє число в блоці
        }
    }
    return true; // Якщо число не повторюється, його можна вставити
}

// Заповнює клітинку вибраним числом
function full(cellId) {
    let row = Math.floor((cellId - 1) / 9); // Обчислює рядок клітинки
    let col = (cellId - 1) % 9; // Обчислює колонку клітинки
    let cellElement = document.getElementById(`cell-${cellId}`); // Отримує елемент клітинки
    
    if (write == null) {
        cellElement.textContent = null; // Якщо число не вибране, очищає клітинку
        sudokuGrid[row][col] = write; // Записує число у масив судоку

    }
    else {
        if (cellElement && (sudokuGrid[row][col] === 0 || cellElement.textContent === "")) { // Переконується, що клітинка пуста
    if (canPlaceNumber(row, col, write)) { // Перевіряє можливість вставки числа
        cellElement.textContent = write; // Вставляє число у клітинку
        sudokuGrid[row][col] = write; // Записує число у масив судоку
    } else {
        cellElement.style.backgroundColor = "red"; // Виділяє помилкове число червоним кольором
        setTimeout(() => {
            cellElement.style.backgroundColor = "grey"; // Повертає колір через 250 мс
        }, 250);
    }
}
    }
}

// Рекурсивно заповнює судоку випадковими числами
function fillSudoku(row = 0, col = 0) {
    if (row === 9) return true; // Якщо всі рядки заповнені, завершити
    
    let nextRow = col === 8 ? row + 1 : row; // Перехід до наступного рядка після останньої колонки
    let nextCol = (col + 1) % 9; // Перехід до наступної колонки

    if (sudokuGrid[row][col] !== 0) { // Пропускає заповнені клітинки
        return fillSudoku(nextRow, nextCol);
    }

    let numbers = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5); // Створює випадковий порядок чисел

    for (let num of numbers) {
        if (canPlaceNumber(row, col, num)) { // Перевіряє, чи можна вставити число
            sudokuGrid[row][col] = num; // Вставляє число
            if (fillSudoku(nextRow, nextCol)) return true; // Рекурсивно заповнює наступну клітинку
            sudokuGrid[row][col] = 0; // Якщо рішення не знайдено, очистити клітинку
        }
    }
    return false; // Якщо неможливо заповнити клітинку, повертає false
}

// Видаляє випадкові числа для створення головоломки
function removeNumbers(difficulty = sudokudiff) {
    let count = 0;
    while (count < difficulty) { // Видаляє числа поки не досягнуто необхідної складності
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (sudokuGrid[row][col] !== 0) { // Видаляє число, якщо воно є
            sudokuGrid[row][col] = 0;
            count++;
        }
    }
}

// Генерує нову головоломку Sudoku
function generateSudoku() {
    sudokuGrid = Array(9).fill().map(() => Array(9).fill(0)); // Очищає судоку
    generatedNumbersIds = []; // Очищає список клітинок з числами

    let success = fillSudoku(); // Заповнює судоку
    if (!success) { // Якщо генерація не вдалася, пробує знову
        console.error("Помилка генерації судоку! Пробую ще раз...");
        generateSudoku();
    }

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuGrid[row][col] !== 0) {
                generatedNumbersIds.push(row * 9 + col + 1); // Зберігає ID клітинок з числами
            }
        }
    }

    removeNumbers(sudokudiff); // Видаляє числа згідно з рівнем складності
    renderSudoku(); // Відображає оновлену судоку
}

// Відображає Sudoku у таблиці HTML
function renderSudoku() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cellId = row * 9 + col + 1;
            let cell = document.getElementById(`cell-${cellId}`);
            if (cell) {
                cell.textContent = sudokuGrid[row][col] !== 0 ? sudokuGrid[row][col] : ""; // Якщо число є, відображає його
            }
        }
    }
}

// Змінює рівень складності та перегенеровує судоку
function diff(selected) {
    sudokudiff = selected;
    generateSudoku();
}

// Запускає генерацію судоку після завантаження сторінки
document.addEventListener("DOMContentLoaded", generateSudoku);