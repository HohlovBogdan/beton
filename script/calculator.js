// Данные для бетона и раствора (исправлены цены с НДС)
const materials = {
  concrete: [
    { grade: "М 100", price: 3800, priceWithVAT: 4560 },
    { grade: "М 150", price: 4200, priceWithVAT: 5040 },
    { grade: "М 200", price: 4600, priceWithVAT: 5520 },
    { grade: "М 250", price: 5500, priceWithVAT: 6600 },
    { grade: "М 300", price: 5800, priceWithVAT: 6960 },
    { grade: "М 350", price: 6200, priceWithVAT: 7440 },
    { grade: "М 400", price: 7000, priceWithVAT: 8400 },
  ],
  mortar: [
    { grade: "М 50", price: 3500, priceWithVAT: 4200 },
    { grade: "М 75", price: 3800, priceWithVAT: 4560 },
    { grade: "М 100", price: 4000, priceWithVAT: 4800 },
    { grade: "М 150", price: 4300, priceWithVAT: 5160 },
  ],
};

// Функции для калькулятора объема
function calculateVolume() {
  const lengthInput = document.getElementById("length").value;
  const widthInput = document.getElementById("width").value;
  const depthInput = document.getElementById("depth").value;

  const lengthUnit = document.getElementById("lengthUnit").value;
  const widthUnit = document.getElementById("widthUnit").value;
  const depthUnit = document.getElementById("depthUnit").value;

  // Очищаем предыдущие ошибки
  clearErrors();

  function parseNumber(value) {
    if (!value || value === "") return 0;
    return parseFloat(value.replace(",", "."));
  }

  let length = parseNumber(lengthInput);
  let width = parseNumber(widthInput);
  let depth = parseNumber(depthInput);

  let hasError = false;

  // Проверяем поле "Длина"
  if (lengthInput === "") {
    showError("length", "Введите длину");
    hasError = true;
  } else if (isNaN(length)) {
    showError("length", "Введите корректное число");
    hasError = true;
  } else if (length <= 0) {
    showError("length", "Число должно быть больше 0");
    hasError = true;
  }

  // Проверяем поле "Ширина"
  if (widthInput === "") {
    showError("width", "Введите ширину");
    hasError = true;
  } else if (isNaN(width)) {
    showError("width", "Введите корректное число");
    hasError = true;
  } else if (width <= 0) {
    showError("width", "Число должно быть больше 0");
    hasError = true;
  }

  // Проверяем поле "Глубина"
  if (depthInput === "") {
    showError("depth", "Введите глубину");
    hasError = true;
  } else if (isNaN(depth)) {
    showError("depth", "Введите корректное число");
    hasError = true;
  } else if (depth <= 0) {
    showError("depth", "Число должно быть больше 0");
    hasError = true;
  }

  // Если есть ошибки - скрываем результат и выходим
  if (hasError) {
    document.getElementById("result").classList.add("hidden");
    return;
  }

  // Конвертируем все значения в метры
  if (lengthUnit === "cm") length = length / 100;
  if (widthUnit === "cm") width = width / 100;
  if (depthUnit === "cm") depth = depth / 100;

  // Рассчитываем объем в кубических метрах
  const volume = length * width * depth;

  // Округляем до 3 знаков после запятой
  const roundedVolume = Math.round(volume * 1000) / 1000;

  // Показываем результат
  document.getElementById("volumeResult").textContent = roundedVolume;
  document.getElementById("result").classList.remove("hidden");

  // Автоподстановка объема в калькулятор стоимости
  updateVolumeFromCalculator(roundedVolume);
}

// Функция для показа ошибки
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const parent = field.parentElement.parentElement;

  // Создаем или находим элемент для ошибки
  let errorElement = parent.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message text-red-500 text-xs mt-1";
    parent.appendChild(errorElement);
  }

  errorElement.textContent = message;
  field.classList.add("border-red-500");
}

// Функция для очистки ошибок
function clearErrors() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document
    .querySelectorAll(".border-red-500")
    .forEach((el) => el.classList.remove("border-red-500"));
}

// Функции для калькулятора стоимости
function calculateCost() {
  const materialGradeSelect = document.getElementById("materialGrade");
  const volumeInput = document.getElementById("volumeInput").value;
  const selectedOption =
    materialGradeSelect.options[materialGradeSelect.selectedIndex];

  if (!selectedOption.value) {
    alert("Пожалуйста, выберите марку материала");
    return;
  }

  const volume = parseFloat(volumeInput.replace(",", "."));
  if (isNaN(volume) || volume <= 0) {
    alert("Пожалуйста, введите корректный объем");
    return;
  }

  const price = parseInt(selectedOption.getAttribute("data-price"));
  const priceWithVAT = parseInt(
    selectedOption.getAttribute("data-price-with-vat")
  );

  // Расчет стоимости
  const costWithoutVAT = price * volume;
  const costWithVAT = priceWithVAT * volume;

  // Обновляем результат
  document.getElementById("costWithoutVAT").textContent =
    costWithoutVAT.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  document.getElementById("costWithVAT").textContent =
    costWithVAT.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  document.getElementById(
    "priceDetails"
  ).textContent = `Цена за м³: ${price} руб. (с НДС: ${priceWithVAT} руб.)`;
  document.getElementById("costResult").classList.remove("hidden");
}

// Автоподстановка объема из первого калькулятора
function updateVolumeFromCalculator(volume) {
  document.getElementById("volumeInput").value = volume;
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Обработчики для калькулятора объема
  const inputs = ["length", "width", "depth"];
  const selects = ["lengthUnit", "widthUnit", "depthUnit"];

  inputs.forEach((id) => {
    document.getElementById(id).addEventListener("input", calculateVolume);
  });

  selects.forEach((id) => {
    document.getElementById(id).addEventListener("change", calculateVolume);
  });

  // Обработчики для калькулятора стоимости
  document
    .getElementById("materialType")
    .addEventListener("change", function () {
      const materialGradeSelect = document.getElementById("materialGrade");
      const selectedType = this.value;

      if (selectedType) {
        materialGradeSelect.innerHTML =
          '<option value="">Выберите марку</option>';
        materials[selectedType].forEach((material) => {
          const option = document.createElement("option");
          option.value = material.grade;
          option.textContent = material.grade;
          option.setAttribute("data-price", material.price);
          option.setAttribute("data-price-with-vat", material.priceWithVAT);
          materialGradeSelect.appendChild(option);
        });
        materialGradeSelect.classList.remove("hidden");
      } else {
        materialGradeSelect.classList.add("hidden");
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const agreementCheckbox = document.getElementById("agreement");
  const calculateButton = document.getElementById("calculateButton");

  if (agreementCheckbox && calculateButton) {
    agreementCheckbox.addEventListener("change", function () {
      calculateButton.disabled = !this.checked;
    });
  }
});
