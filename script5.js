
const cats = [
    { id: 1, breed: "Мейн-кун", popularity: 95, weight: 8.5, age: 12, activity: "Высокая" },
    { id: 2, breed: "Британская короткошерстная", popularity: 92, weight: 6.0, age: 14, activity: "Средняя" },
    { id: 3, breed: "Шотландская вислоухая", popularity: 90, weight: 5.5, age: 12, activity: "Средняя" },
    { id: 4, breed: "Сиамская", popularity: 85, weight: 4.0, age: 15, activity: "Высокая" },
    { id: 5, breed: "Персидская", popularity: 88, weight: 5.0, age: 14, activity: "Низкая" },
    { id: 6, breed: "Сфинкс", popularity: 83, weight: 4.5, age: 13, activity: "Высокая" },
    { id: 7, breed: "Рэгдолл", popularity: 87, weight: 7.0, age: 12, activity: "Низкая" },
    { id: 8, breed: "Абиссинская", popularity: 80, weight: 4.5, age: 14, activity: "Высокая" },
    { id: 9, breed: "Бенгальская", popularity: 93, weight: 6.0, age: 13, activity: "Высокая" },
    { id: 10, breed: "Русская голубая", popularity: 83, weight: 4.5, age: 15, activity: "Средняя" },
    { id: 11, breed: "Норвежская лесная", popularity: 81, weight: 7.0, age: 14, activity: "Высокая" },
    { id: 12, breed: "Турецкий ангора", popularity: 78, weight: 4.0, age: 15, activity: "Высокая" },
    { id: 13, breed: "Корниш-рекс", popularity: 75, weight: 3.5, age: 13, activity: "Высокая" },
    { id: 14, breed: "Девон-рекс", popularity: 76, weight: 3.5, age: 14, activity: "Высокая" },
    { id: 15, breed: "Оцикет", popularity: 74, weight: 5.5, age: 13, activity: "Высокая" },
    { id: 16, breed: "Сококе", popularity: 70, weight: 4.5, age: 14, activity: "Средняя" },
    { id: 17, breed: "Египетская мау", popularity: 73, weight: 4.5, age: 13, activity: "Высокая" },
    { id: 18, breed: "Бурманская", popularity: 79, weight: 5.0, age: 14, activity: "Высокая" },
    { id: 19, breed: "Бомбейская", popularity: 72, weight: 4.5, age: 13, activity: "Средняя" },
    { id: 20, breed: "Шартрез", popularity: 71, weight: 6.0, age: 14, activity: "Низкая" },
    { id: 21, breed: "Курильский бобтейл", popularity: 77, weight: 5.5, age: 13, activity: "Высокая" },
    { id: 22, breed: "Японский бобтейл", popularity: 74, weight: 4.0, age: 14, activity: "Высокая" },
    { id: 23, breed: "Мэнкс", popularity: 69, weight: 5.0, age: 13, activity: "Средняя" },
    { id: 24, breed: "Саванна", popularity: 84, weight: 8.0, age: 12, activity: "Высокая" },
    { id: 25, breed: "Каракал", popularity: 68, weight: 10.0, age: 11, activity: "Высокая" },
    { id: 26, breed: "Сервал", popularity: 67, weight: 9.0, age: 10, activity: "Высокая" },
    { id: 27, breed: "Чаузи", popularity: 70, weight: 7.5, age: 11, activity: "Высокая" },
    { id: 28, breed: "Пиксибоб", popularity: 66, weight: 6.0, age: 12, activity: "Средняя" },
    { id: 29, breed: "Американский керл", popularity: 72, weight: 5.0, age: 13, activity: "Средняя" },
    { id: 30, breed: "Американская короткошерстная", popularity: 75, weight: 6.0, age: 14, activity: "Средняя" }
];

const sortFields = [
    { value: "", text: "Не выбрано" },
    { value: "id", text: "№" },
    { value: "breed", text: "Порода" },
    { value: "popularity", text: "Популярность" },
    { value: "weight", text: "Вес (кг)" },
    { value: "age", text: "Возраст (лет)" },
    { value: "activity", text: "Активность" }
];

let filteredCats = [...cats];
let currentCats = [...cats];

function normalizeString(value) {
    return String(value).trim().toLowerCase();
}

function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    const recordsCount = document.getElementById("recordsCount");

    tableBody.innerHTML = "";

    data.forEach(cat => {
        const row = document.createElement("tr");
        
        // Определяем цвет для активности
        let activityColor = "";
        if (cat.activity === "Высокая") activityColor = "color: green;";
        else if (cat.activity === "Средняя") activityColor = "color: orange;";
        else if (cat.activity === "Низкая") activityColor = "color: red;";

        row.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.breed}</td>
            <td>${cat.popularity}%</td>
            <td>${cat.weight}</td>
            <td>${cat.age}</td>
            <td style="${activityColor}">${cat.activity}</td>
        `;

        tableBody.appendChild(row);
    });

    recordsCount.textContent = `Показано записей: ${data.length} из ${cats.length}`;
}

function applyFilter() {
    const searchText = normalizeString(document.getElementById("searchText").value);
    const minWeight = parseFloat(document.getElementById("minWeight").value);
    const maxWeight = parseFloat(document.getElementById("maxWeight").value);

    filteredCats = cats.filter(cat => {
        const matchesBreed = searchText === "" || normalizeString(cat.breed).includes(searchText);
        const matchesWeight = cat.weight >= minWeight && cat.weight <= maxWeight;
        
        return matchesBreed && matchesWeight;
    });

    currentCats = [...filteredCats];
    applySort();
}

function resetFilter() {
    document.getElementById("searchText").value = "";
    document.getElementById("minWeight").value = "1";
    document.getElementById("maxWeight").value = "10";

    filteredCats = [...cats];
    currentCats = [...cats];
    applySort();
}

function compareValues(a, b, field, order) {
    let valueA = a[field];
    let valueB = b[field];

    if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
    }

    if (typeof valueB === "string") {
        valueB = valueB.toLowerCase();
    }

    let result = 0;

    if (typeof valueA === "number" && typeof valueB === "number") {
        result = valueA - valueB;
    } else {
        result = String(valueA).localeCompare(String(valueB), "ru");
    }

    return order === "desc" ? -result : result;
}

function applySort() {
    const sortRules = [];
    
    // Получаем все уровни сортировки
    const sortLevels = document.querySelectorAll('.sort-level');
    
    sortLevels.forEach(level => {
        const field = level.querySelector('.sort-field').value;
        const order = level.querySelector('.sort-order').value;
        
        if (field !== "") {
            sortRules.push({ field: field, order: order });
        }
    });

    currentCats = [...filteredCats];

    currentCats.sort((a, b) => {
        for (let i = 0; i < sortRules.length; i++) {
            const rule = sortRules[i];
            const compareResult = compareValues(a, b, rule.field, rule.order);

            if (compareResult !== 0) {
                return compareResult;
            }
        }
        return 0;
    });

    renderTable(currentCats);
}

function createSortLevel(levelNum, currentField = "", currentOrder = "asc", forbiddenFields = []) {
    const container = document.createElement("div");
    container.className = "sort-level";
    container.style.marginBottom = "10px";
    container.style.padding = "8px";
    container.style.backgroundColor = "#f9f9f9";
    container.style.borderRadius = "5px";
    
    const label = document.createElement("label");
    label.textContent = `Уровень ${levelNum}: `;
    label.style.fontWeight = "bold";
    label.style.marginRight = "10px";
    
    const fieldSelect = document.createElement("select");
    fieldSelect.className = "sort-field";
    fieldSelect.style.marginRight = "10px";
    fieldSelect.style.padding = "5px";
    
    // Заполняем select полями для сортировки
    sortFields.forEach(field => {
        if (field.value === "" || !forbiddenFields.includes(field.value) || field.value === currentField) {
            const option = document.createElement("option");
            option.value = field.value;
            option.textContent = field.text;
            fieldSelect.appendChild(option);
        }
    });
    fieldSelect.value = currentField;
    
    const orderSelect = document.createElement("select");
    orderSelect.className = "sort-order";
    orderSelect.style.padding = "5px";
    
    const ascOption = document.createElement("option");
    ascOption.value = "asc";
    ascOption.textContent = "По возрастанию";
    orderSelect.appendChild(ascOption);
    
    const descOption = document.createElement("option");
    descOption.value = "desc";
    descOption.textContent = "По убыванию";
    orderSelect.appendChild(descOption);
    orderSelect.value = currentOrder;
    
    container.appendChild(label);
    container.appendChild(fieldSelect);
    container.appendChild(orderSelect);
    
    return container;
}

function initSortControls() {
    const container = document.getElementById("sortLevelsContainer");
    container.innerHTML = "";
    
    // Создаем 3 уровня сортировки
    for (let i = 1; i <= 3; i++) {
        const sortLevel = createSortLevel(i);
        container.appendChild(sortLevel);
    }
    
    // Обновляем доступные поля при изменении выбора
    updateSortOptions();
}

function updateSortOptions() {
    const sortLevels = document.querySelectorAll('.sort-level');
    const selectedFields = [];
    
    sortLevels.forEach(level => {
        const field = level.querySelector('.sort-field').value;
        if (field && !selectedFields.includes(field)) {
            selectedFields.push(field);
        }
    });
    
    sortLevels.forEach((level, index) => {
        const currentField = level.querySelector('.sort-field').value;
        const order = level.querySelector('.sort-order').value;
        
        const forbiddenFields = selectedFields.filter((f, i) => i !== index);
        const newSelect = createSortLevel(index + 1, currentField, order, forbiddenFields);
        
        // Заменяем select
        const oldFieldSelect = level.querySelector('.sort-field');
        const newFieldSelect = newSelect.querySelector('.sort-field');
        
        // Копируем обработчики
        newFieldSelect.addEventListener('change', updateSortOptions);
        level.replaceChild(newFieldSelect, oldFieldSelect);
    });
}

function resetSort() {
    const sortLevels = document.querySelectorAll('.sort-level');
    
    sortLevels.forEach((level, index) => {
        const fieldSelect = level.querySelector('.sort-field');
        const orderSelect = level.querySelector('.sort-order');
        
        fieldSelect.value = "";
        orderSelect.value = "asc";
    });
    
    currentCats = [...filteredCats];
    renderTable(currentCats);
}

function initButtons() {
    document.getElementById("applyFilterBtn").addEventListener("click", applyFilter);
    document.getElementById("resetFilterBtn").addEventListener("click", resetFilter);
    document.getElementById("applySortBtn").addEventListener("click", applySort);
    document.getElementById("resetSortBtn").addEventListener("click", resetSort);
    
    // Добавляем валидацию для полей веса
    const minWeight = document.getElementById("minWeight");
    const maxWeight = document.getElementById("maxWeight");
    
    minWeight.addEventListener("change", function() {
        if (parseFloat(minWeight.value) > parseFloat(maxWeight.value)) {
            maxWeight.value = minWeight.value;
        }
    });
    
    maxWeight.addEventListener("change", function() {
        if (parseFloat(maxWeight.value) < parseFloat(minWeight.value)) {
            minWeight.value = maxWeight.value;
        }
    });
}

function initSearchInput() {
    const searchInput = document.getElementById("searchText");
    let timeoutId;
    
    searchInput.addEventListener("input", function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(applyFilter, 300);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSortControls();
    initButtons();
    initSearchInput();
    renderTable(cats);
});