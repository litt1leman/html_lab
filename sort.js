const createSortArr = (data) => {
    let sortArr = [];

    const sortSelects = data.getElementsByTagName('select');

    for (const item of sortSelects) {
        const keySort = item.value;

        if (keySort == 0) {
            break;
        }

        const desc = document.getElementById(item.id + 'Desc').checked;

        sortArr.push({
            column: keySort - 1,
            direction: desc
        });
    }

    return sortArr;
};

const sortTable = (idTable, formData) => {
    const sortArr = createSortArr(formData);

    if (sortArr.length === 0) {
        return false;
    }

    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);

    const headerRow = rowData.shift();

    rowData.sort((first, second) => {
        for (let { column, direction } of sortArr) {
            let firstCell = first.cells[column].innerHTML;
            let secondCell = second.cells[column].innerHTML;

            if (!isNaN(firstCell) && !isNaN(secondCell)) {
                firstCell = Number(firstCell);
                secondCell = Number(secondCell);

                if (firstCell !== secondCell) {
                    return direction
                        ? secondCell - firstCell
                        : firstCell - secondCell;
                }
            } else {
                const comparison = firstCell.localeCompare(secondCell);
                if (comparison !== 0) {
                    return direction ? -comparison : comparison;
                }
            }
        }
        return 0;
    });

    table.innerHTML = "";
    table.append(headerRow);

    let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
    table.append(tbody);
};

const resetSort = (sortForm) => {
    const selects = sortForm.getElementsByTagName('select');
    for (let i = 0; i < selects.length; i++) {
        selects[i].selectedIndex = 0;
        if (i > 0) {
            selects[i].disabled = true;
        }
    }

    document.getElementById('fieldsFirstDesc').checked = false;
    document.getElementById('fieldsSecondDesc').checked = false;
};