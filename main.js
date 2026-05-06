let currentTableData = [];

const createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

const setSortSelect = (arr, sortSelect) => {
    sortSelect.innerHTML = "";
    sortSelect.append(createOption('Нет', 0));

    arr.forEach((item, index) => {
        sortSelect.append(createOption(item, index + 1));
    });
};

const setSortSelects = (data, dataForm) => {
    const head = Object.keys(data);
    const allSelect = dataForm.getElementsByTagName('select');

    for (let i = 0; i < allSelect.length; i++) {
        setSortSelect(head, allSelect[i]);

        if (i > 0) {
            allSelect[i].disabled = true;
        }
    }
};

const changeNextSelect = (curSelect, nextSelectId) => {
    let nextSelect = document.getElementById(nextSelectId);

    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;

    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
        nextSelect.selectedIndex = 0;
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const filterForm = document.getElementById("filter");
    const sortForm = document.getElementById("sort");

    currentTableData = [...buildings];

    createTable(currentTableData, 'list');
    setSortSelects(buildings[0], sortForm);

    document.getElementById("findBtn").addEventListener("click", function () {
        filterTable(buildings, 'list', filterForm);

        currentTableData = dataFilter(filterForm);
        currentTableData = buildings.filter(item => {
            let result = true;

            Object.entries(item).forEach(([key, val]) => {
                if (typeof val === 'string') {
                    result &&= val.toLowerCase().includes(currentTableData[correspond[key]]);
                } else {
                    result &&= val >= currentTableData[correspond[key][0]] &&
                               val <= currentTableData[correspond[key][1]];
                }
            });

            return result;
        });

        resetSort(sortForm);
    });

    document.getElementById("clearBtn").addEventListener("click", function () {
        clearFilter('list', buildings, filterForm);
        currentTableData = [...buildings];
        resetSort(sortForm);
    });

    document.getElementById("fieldsFirst").addEventListener("change", function () {
        changeNextSelect(this, "fieldsSecond");
    });

    document.getElementById("sortBtn").addEventListener("click", function () {
        sortTable('list', sortForm);
    });

    document.getElementById("resetSortBtn").addEventListener("click", function () {
        resetSort(sortForm);
        clearTable('list');
        createTable(currentTableData, 'list');
    });
});