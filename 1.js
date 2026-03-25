const img = document.getElementById("trapImage");

const inputTypeSelect = document.getElementById("inputTypeSelect");
const btnShow = document.getElementById("btnShow");

const AD = document.getElementById("AD");
const BC = document.getElementById("BC");
const CD = document.getElementById("CD");
const hBase = document.getElementById("hBase");

const sideField = document.querySelector(".side-field");
const heightField = document.querySelector(".height-field");

const chkHeightToSide = document.getElementById("chkHeightToSide");
const chkPerimeter = document.getElementById("chkPerimeter");
const chkDiags = document.getElementById("chkDiags");

const btnCalc = document.getElementById("btnCalc");
const btnClear = document.getElementById("btnClear");

const resultBlock = document.getElementById("resultBlock");

const IMG_SIDE = "pict_1.png";
const IMG_HEIGHT = "pict_2.png";

resultBlock.style.display = "none";

function clearErrors() {
    [AD, BC, CD, hBase].forEach(input => {
        input.classList.remove("input-error");
    });
}

function showError(message, fields = []) {
    clearErrors();

    fields.forEach(field => {
        field.classList.add("input-error");
    });

    resultBlock.style.display = "block";
    resultBlock.innerHTML = `
        <p class="title">Результат:</p>
        <p class="error-text">${message}</p>
    `;
}

function parsePositive(input) {
    const value = parseFloat(input.value.replace(",", "."));

    if (!(value > 0)) {
        input.classList.add("input-error");
        return null;
    }

    input.classList.remove("input-error");
    return value;
}

function updateMode() {
    const mode = inputTypeSelect.value;

    clearErrors();

    resultBlock.style.display = "none";
    resultBlock.innerHTML = '<p class="title">Результат:</p><p>—</p>';

    if (mode === "side") {
        sideField.style.display = "block";
        heightField.style.display = "none";
        img.src = IMG_SIDE;
        img.alt = "трапеция: основания и боковая сторона";
    } else {
        sideField.style.display = "none";
        heightField.style.display = "block";
        img.src = IMG_HEIGHT;
        img.alt = "трапеция: основания и высота к основанию";
    }
}

btnShow.addEventListener("click", updateMode);

btnCalc.addEventListener("click", () => {
    clearErrors();

    const bigBase = parsePositive(AD);
    const smallBase = parsePositive(BC);

    resultBlock.style.display = "block";

    if (bigBase === null || smallBase === null) {
        showError("Ошибка: основания должны быть положительными числами.", [AD, BC]);
        return;
    }

    if (bigBase <= smallBase) {
        showError("Ошибка: должно выполняться AD > BC.", [AD, BC]);
        return;
    }

    const halfDiff = (bigBase - smallBase) / 2;
    const mode = inputTypeSelect.value;

    let side;
    let hToBase;

    if (mode === "side") {
        side = parsePositive(CD);

        if (side === null) {
            showError("Ошибка: боковая сторона должна быть положительным числом.", [CD]);
            return;
        }

        if (side <= halfDiff) {
            showError(
                "Ошибка: боковая сторона должна быть больше (AD - BC) / 2, иначе такая трапеция невозможна.",
                [CD]
            );
            return;
        }

        hToBase = Math.sqrt(side * side - halfDiff * halfDiff);
    } else {
        hToBase = parsePositive(hBase);

        if (hToBase === null) {
            showError("Ошибка: высота должна быть положительным числом.", [hBase]);
            return;
        }

        side = Math.sqrt(hToBase * hToBase + halfDiff * halfDiff);
    }

    const perimeter = bigBase + smallBase + 2 * side;
    const diagonal = Math.sqrt(
        hToBase * hToBase + Math.pow((bigBase + smallBase) / 2, 2)
    );

    const hToSide = (((bigBase + smallBase) / 2) * hToBase) / side;

    let out = '<p class="title">Результат:</p>';

    if (chkHeightToSide.checked) {
        out += `<p>Высота от основания к боковой стороне = ${hToSide.toFixed(3)}</p>`;
    }
    if (chkPerimeter.checked) {
        out += `<p>Периметр = ${perimeter.toFixed(3)}</p>`;
    }

    if (chkDiags.checked) {
        out += `<p>Диагональ AC = ${diagonal.toFixed(3)}</p>`;
        out += `<p>Диагональ BD = ${diagonal.toFixed(3)}</p>`;
    }

    if (!chkHeightToSide.checked && !chkPerimeter.checked && !chkDiags.checked) {
        out +='<p>Ничего не выбрано для вычисления.</p>';
    }

    resultBlock.innerHTML = out;
});

btnClear.addEventListener("click", () => {
    AD.value = "";
    BC.value = "";
    CD.value = "";
    hBase.value = "";

    clearErrors();

    resultBlock.style.display = "none";
    resultBlock.innerHTML ='<p class="title">Результат:</p><p>—</p>';
});