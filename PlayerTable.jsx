import React from "react";

function PlayerTable({ cats, currentPage, pageSize }) {
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = cats.slice(startIndex, startIndex + pageSize);

    return (
        <div className="table-wrap">
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Порода</th>
                    <th>Популярность</th>
                    <th>Вес (кг)</th>
                    <th>Возраст (лет)</th>
                </tr>
                </thead>

                <tbody>
                {paginated.length > 0 ? (
                    paginated.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.breed}</td>
                            <td>{cat.popularity}</td>
                            <td>{cat.weight}</td>
                            <td>{cat.age}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="empty-table">
                            Нет данных для отображения
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default PlayerTable;