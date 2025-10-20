document.addEventListener("DOMContentLoaded", () => {
  const materialTypeSelect = document.getElementById("materialType");
  const materialGradeSelect = document.getElementById("materialGrade");
  const volumeInput = document.getElementById("volumeInput");
  const frostSelect = document.getElementById("frostAdditive");
  const agreementCheckbox = document.getElementById("agreement");

  const costResult = document.getElementById("costResult");
  const priceDetails = document.getElementById("priceDetails");
  const volumeResultSpan = document.getElementById("volumeResult");

  const lengthInput = document.getElementById("length");
  const widthInput = document.getElementById("width");
  const depthInput = document.getElementById("depth");
  const lengthUnit = document.getElementById("lengthUnit");
  const widthUnit = document.getElementById("widthUnit");
  const depthUnit = document.getElementById("depthUnit");
  const volumeResultBlock = document.getElementById("result");

  const tables = { concrete: {}, mortar: {}, frost: {} };

  // --- Загружаем таблицы ---
  const concreteRows = document.querySelectorAll("#price div:nth-child(2) tbody tr");
  concreteRows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const grade = cells[0].textContent.trim();
    const priceWithoutVAT = parseFloat(cells[1].textContent.match(/\d+/)[0]);
    const priceWithVAT = priceWithoutVAT * 1.2;
    const priceUnderPump = parseFloat(cells[2].textContent.match(/\d+/)[0]);
    const priceUnderPumpWithVAT = priceUnderPump * 1.2;

    tables.concrete[grade] = {
      price: priceWithoutVAT,
      priceVAT: priceWithVAT,
      priceUnderPump: priceUnderPump,
      priceUnderPumpVAT: priceUnderPumpWithVAT
    };
  });

  const mortarRows = document.querySelectorAll("#price div:nth-child(1) tbody tr");
  mortarRows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const grade = cells[0].textContent.trim();
    const priceWithoutVAT = parseFloat(cells[1].textContent.match(/\d+/)[0]);
    const priceWithVAT = priceWithoutVAT * 1.2;
    const priceUnderPump = parseFloat(cells[2].textContent.match(/\d+/)[0]);
    const priceUnderPumpWithVAT = priceUnderPump * 1.2;

    tables.mortar[grade] = {
      price: priceWithoutVAT,
      priceVAT: priceWithVAT,
      priceUnderPump: priceUnderPump,
      priceUnderPumpVAT: priceUnderPumpWithVAT
    };
  });

  const frostRows = document.querySelectorAll("#price div:nth-child(3) tbody tr");
  frostRows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const temp = cells[0].textContent.trim();
    const price = parseFloat(cells[1].textContent.match(/\d+/)[0]);
    const priceVAT = price * 1.2;

    tables.frost[temp] = { price, priceVAT };
  });

  function updateMaterialGrades() {
    materialGradeSelect.innerHTML = '<option value="">Выберите марку</option>';
    const type = materialTypeSelect.value;
    if (!type) {
      materialGradeSelect.classList.add("hidden");
      return;
    }
    Object.keys(tables[type]).forEach(g => {
      const option = document.createElement("option");
      option.value = g;
      option.textContent = g;
      materialGradeSelect.appendChild(option);
    });
    materialGradeSelect.classList.remove("hidden");
  }

  materialTypeSelect.addEventListener("change", () => {
    updateMaterialGrades();
    if (agreementCheckbox.checked) calculateCost();
  });
  materialGradeSelect.addEventListener("change", () => { if (agreementCheckbox.checked) calculateCost(); });
  frostSelect.addEventListener("change", () => { if (agreementCheckbox.checked) calculateCost(); });

  // --- Расчет объема плиты ---
  function calculateVolume() {
    let length = parseFloat(lengthInput.value);
    let width = parseFloat(widthInput.value);
    let depth = parseFloat(depthInput.value);

    if (isNaN(length) || isNaN(width) || isNaN(depth)) {
      volumeResultBlock.classList.add("hidden");
      return;
    }

    if (lengthUnit.value === "cm") length /= 100;
    if (widthUnit.value === "cm") width /= 100;
    if (depthUnit.value === "cm") depth /= 100;

    let volume = length * width * depth;
    volumeResultSpan.textContent = volume.toFixed(2);
    volumeResultBlock.classList.remove("hidden");

    // Перенос в поле расчета стоимости
    volumeInput.value = volume.toFixed(2);

    if (agreementCheckbox.checked) calculateCost();
  }

  [lengthInput, widthInput, depthInput, lengthUnit, widthUnit, depthUnit].forEach(el => {
    el.addEventListener("input", calculateVolume);
    el.addEventListener("change", calculateVolume);
  });

  function formatNumber(num) { return Math.round(num).toLocaleString('ru-RU'); }

  // --- Расчёт стоимости ---
  function calculateCost() {
    const type = materialTypeSelect.value;
    const grade = materialGradeSelect.value;
    const frostTemp = frostSelect.value;

    // Берем объем из поля ввода даже если пользователь не использовал калькулятор объема
    let volume = parseFloat(volumeInput.value);
    if (isNaN(volume)) volume = 0;

    if (!type || !grade) {
      costResult.classList.add("hidden");
      return;
    }

    if (volume < 0.1) {
      alert("Минимальный объем поставки — 0.1 м³.");
      return;
    }

    const pricePerM3 = tables[type][grade].price;
    const pricePerM3VAT = tables[type][grade].priceVAT;
    const priceUnderPump = tables[type][grade].priceUnderPump;
    const priceUnderPumpVAT = tables[type][grade].priceUnderPumpVAT;

    let frostPrice = 0;
    let frostPriceVAT = 0;
    if (frostTemp && frostTemp !== "0") {
      frostPrice = tables.frost[frostTemp].price;
      frostPriceVAT = tables.frost[frostTemp].priceVAT;
    }

    const total = (pricePerM3 + frostPrice) * volume;
    const totalVAT = (pricePerM3VAT + frostPriceVAT) * volume;
    const totalUnderPump = (priceUnderPump + frostPrice) * volume;
    const totalUnderPumpVAT = (priceUnderPumpVAT + frostPriceVAT) * volume;

    costResult.classList.remove("hidden");
    priceDetails.innerHTML = `
      Цена - ${formatNumber(total)} (<span class="bg-yellow-300">${formatNumber(totalVAT)}</span>)<br>
      Цена под Бетононасос - ${formatNumber(totalUnderPump)} (<span class="bg-yellow-300">${formatNumber(totalUnderPumpVAT)}</span>)<br>
      Объем: ${volume.toFixed(2)} м³
    `;
  }

  agreementCheckbox.addEventListener("change", () => {
    if (agreementCheckbox.checked) calculateCost();
    else costResult.classList.add("hidden");
  });

  // --- Обновляем расчет при изменении объема вручную ---
  volumeInput.addEventListener("input", () => {
    if (agreementCheckbox.checked) calculateCost();
  });
});
