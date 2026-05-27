import React from "react";
import Filters from "./components/Filters";
import PlayerTable from "./components/PlayerTable";
import Chart from "./components/Chart";
import { catsData } from "./data/data";
import "./style3.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                breed: "",
                age: "",
                popularityMin: "",
                popularityMax: "",
                weightMin: "",
                weightMax: ""
            },
            sortFieldsSelected: [
                { field: "", dir: "asc" },
                { field: "", dir: "asc" },
                { field: "", dir: "asc" }
            ],
            currentPage: 1,
            pageSize: 10
        };
    }

    handleFilterChange = (field, value) => {
        this.setState({
            filter: {
                ...this.state.filter,
                [field]: value
            },
            currentPage: 1
        });
    };

    handleSortChange = (level, type, value) => {
        const updatedSort = [...this.state.sortFieldsSelected];

        updatedSort[level] = {
            ...updatedSort[level],
            [type]: value
        };

        this.setState({
            sortFieldsSelected: updatedSort,
            currentPage: 1
        });
    };

    handleClearFilters = () => {
        this.setState({
            filter: {
                breed: "",
                age: "",
                popularityMin: "",
                popularityMax: "",
                weightMin: "",
                weightMax: ""
            },
            currentPage: 1
        });
    };

    handleClearSort = () => {
        this.setState({
            sortFieldsSelected: [
                { field: "", dir: "asc" },
                { field: "", dir: "asc" },
                { field: "", dir: "asc" }
            ],
            currentPage: 1
        });
    };

    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        });
    };

    getFilteredCats = () => {
        const { filter } = this.state;

        const minPopularity =
            filter.popularityMin === "" ? null : Number(filter.popularityMin);

        const maxPopularity =
            filter.popularityMax === "" ? null : Number(filter.popularityMax);

        const minWeight =
            filter.weightMin === "" ? null : Number(filter.weightMin);

        const maxWeight =
            filter.weightMax === "" ? null : Number(filter.weightMax);

        return catsData.filter((cat) => {
            const breedMatches = cat.breed
                .toLowerCase()
                .includes(filter.breed.toLowerCase());

            const ageMatches = cat.age
                .toLowerCase()
                .includes(filter.age.toLowerCase());

            const minPopularityMatches =
                minPopularity === null || cat.popularity >= minPopularity;

            const maxPopularityMatches =
                maxPopularity === null || cat.popularity <= maxPopularity;

            const minWeightMatches =
                minWeight === null || cat.weight >= minWeight;

            const maxWeightMatches =
                maxWeight === null || cat.weight <= maxWeight;

            return (
                breedMatches &&
                ageMatches &&
                minPopularityMatches &&
                maxPopularityMatches &&
                minWeightMatches &&
                maxWeightMatches
            );
        });
    };

    getSortedCats = (filteredCats) => {
        const { sortFieldsSelected } = this.state;

        const activeSortFields = sortFieldsSelected.filter(
            (item) => item.field !== ""
        );

        return [...filteredCats].sort((a, b) => {
            for (let sortRule of activeSortFields) {
                let valA = a[sortRule.field];
                let valB = b[sortRule.field];

                if (typeof valA === "string") {
                    valA = valA.toLowerCase();
                }

                if (typeof valB === "string") {
                    valB = valB.toLowerCase();
                }

                if (valA < valB) {
                    return sortRule.dir === "asc" ? -1 : 1;
                }

                if (valA > valB) {
                    return sortRule.dir === "asc" ? 1 : -1;
                }
            }

            return 0;
        });
    };

    render() {
        const { filter, sortFieldsSelected, currentPage, pageSize } = this.state;

        const filteredCats = this.getFilteredCats();
        const sortedCats = this.getSortedCats(filteredCats);

        const totalPages = Math.max(1, Math.ceil(sortedCats.length / pageSize));

        return (
            <div className="App">
                <h1>Породы кошек</h1>

                <Filters
                    filter={filter}
                    sortFieldsSelected={sortFieldsSelected}
                    onFilterChange={this.handleFilterChange}
                    onSortChange={this.handleSortChange}
                    onClearFilters={this.handleClearFilters}
                    onClearSort={this.handleClearSort}
                />

                <PlayerTable
                    cats={sortedCats}
                    currentPage={currentPage}
                    pageSize={pageSize}
                />

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                key={page}
                                onClick={() => this.handlePageChange(page)}
                                disabled={page === currentPage}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                <Chart cats={filteredCats} />
            </div>
        );
    }
}

export default App;