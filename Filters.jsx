import React from "react";
import { sortFields } from "../data/data";

function Filters({
                     filter,
                     sortFieldsSelected,
                     onFilterChange,
                     onSortChange,
                     onClearFilters,
                     onClearSort
                 }) {
    return (
        <div className="filters">
            <h3>Фильтры</h3>

            <div>
                <label>Порода: </label>
                <input
                    type="text"
                    value={filter.breed}
                    onChange={(event) => onFilterChange("breed", event.target.value)}
                    placeholder="Например: мейн"
                />
            </div>

            <div>
                <label>Возраст: </label>
                <input
                    type="text"
                    value={filter.age}
                    onChange={(event) => onFilterChange("age", event.target.value)}
                    placeholder="Например: 12-15"
                />
            </div>

            <div>
                <label>Популярность от: </label>
                <input
                    type="number"
                    value={filter.popularityMin}
                    onChange={(event) => onFilterChange("popularityMin", event.target.value)}
                />
            </div>

            <div>
                <label>Популярность до: </label>
                <input
                    type="number"
                    value={filter.popularityMax}
                    onChange={(event) => onFilterChange("popularityMax", event.target.value)}
                />
            </div>

            <div>
                <label>Вес от: </label>
                <input
                    type="number"
                    value={filter.weightMin}
                    onChange={(event) => onFilterChange("weightMin", event.target.value)}
                />
            </div>

            <div>
                <label>Вес до: </label>
                <input
                    type="number"
                    value={filter.weightMax}
                    onChange={(event) => onFilterChange("weightMax", event.target.value)}
                />
            </div>

            <button type="button" onClick={onClearFilters}>
                Очистить фильтр
            </button>

            <h3>Сортировка</h3>

            {[0, 1, 2].map((level) => (
                <div key={level}>
                    <label>{level + 1} уровень: </label>

                    <select
                        value={sortFieldsSelected[level]?.field || ""}
                        onChange={(event) => onSortChange(level, "field", event.target.value)}
                    >
                        {sortFields.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.text}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortFieldsSelected[level]?.dir || "asc"}
                        onChange={(event) => onSortChange(level, "dir", event.target.value)}
                    >
                        <option value="asc">По возрастанию</option>
                        <option value="desc">По убыванию</option>
                    </select>
                </div>
            ))}

            <button type="button" onClick={onClearSort}>
                Очистить сортировку
            </button>
        </div>
    );
}

export default Filters;