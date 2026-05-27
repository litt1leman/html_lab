import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { chartFields } from "../data/data";

const chartTypes = [
    { value: "scatter", text: "Точечная диаграмма" },
    { value: "line", text: "Линейная диаграмма" },
    { value: "bar", text: "Столбчатая диаграмма" }
];

function getFieldName(field) {
    const foundField = chartFields.find((item) => item.value === field);
    return foundField ? foundField.text : field;
}

function getChartTypeName(chartType) {
    if (chartType === "bar") return "столбчатая";
    if (chartType === "line") return "линейная";
    return "точечная";
}

function drawChart(chartElement, cats, settings) {
    const chartBlock = d3.select(chartElement);
    chartBlock.selectAll("*").remove();

    if (cats.length === 0) {
        chartBlock
            .append("div")
            .attr("class", "chart-empty")
            .text("Нет данных для построения диаграммы");
        return;
    }

    const data = cats
        .map((cat) => ({
            x: Number(cat[settings.xField]),
            y: Number(cat[settings.yField]),
            label: cat.breed
        }))
        .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y));

    if (data.length === 0) {
        chartBlock
            .append("div")
            .attr("class", "chart-empty")
            .text("Для графика нужны числовые данные");
        return;
    }

    const width = 900;
    const height = 430;
    const margin = {
        top: 30,
        right: 30,
        bottom: 90,
        left: 70
    };

    const svg = chartBlock
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    if (settings.chartType === "bar") {
        drawBarChart(d3, svg, data, width, height, margin, settings.yField);
    } else {
        drawXYChart(
            d3,
            svg,
            data,
            width,
            height,
            margin,
            settings.xField,
            settings.yField,
            settings.chartType
        );
    }
}

function drawXYChart(d3, svg, data, width, height, margin, xField, yField, chartType) {
    const xExtent = d3.extent(data, (item) => item.x);
    const minX = xExtent[0];
    const maxX = xExtent[1];
    const maxY = d3.max(data, (item) => item.y) || 0;

    const xScale = d3.scaleLinear()
        .domain(minX === maxX ? [minX - 1, maxX + 1] : xExtent)
        .nice()
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, maxY])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 25)
        .attr("text-anchor", "middle")
        .attr("class", "chart-axis-title")
        .text(getFieldName(xField));

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("class", "chart-axis-title")
        .text(getFieldName(yField));

    if (chartType === "line") {
        const sortedData = [...data].sort((a, b) => a.x - b.x);

        const line = d3.line()
            .x((item) => xScale(item.x))
            .y((item) => yScale(item.y));

        svg.append("path")
            .datum(sortedData)
            .attr("class", "chart-line")
            .attr("d", line);
    }

    svg.selectAll(".chart-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "chart-point")
        .attr("cx", (item) => xScale(item.x))
        .attr("cy", (item) => yScale(item.y))
        .attr("r", 5)
        .append("title")
        .text((item) => `${item.label}: X = ${item.x}, Y = ${item.y}`);
}

function drawBarChart(d3, svg, data, width, height, margin, yField) {
    const visibleData = data.slice(0, 25);
    const maxY = d3.max(visibleData, (item) => item.y) || 0;

    const xScale = d3.scaleBand()
        .domain(visibleData.map((item) => item.label))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, maxY])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("class", "chart-axis-title")
        .text(getFieldName(yField));

    svg.selectAll(".chart-bar")
        .data(visibleData)
        .enter()
        .append("rect")
        .attr("class", "chart-bar")
        .attr("x", (item) => xScale(item.label))
        .attr("y", (item) => yScale(item.y))
        .attr("width", xScale.bandwidth())
        .attr("height", (item) => height - margin.bottom - yScale(item.y))
        .append("title")
        .text((item) => `${item.label}: ${item.y}`);
}

function Chart({ cats }) {
    const chartRef = useRef(null);

    const defaultSettings = {
        xField: "id",
        yField: "weight",
        chartType: "scatter"
    };

    const [formSettings, setFormSettings] = useState(defaultSettings);
    const [chartSettings, setChartSettings] = useState(defaultSettings);

    useEffect(() => {
        if (chartRef.current) {
            drawChart(chartRef.current, cats, chartSettings);
        }
    }, [cats, chartSettings]);

    const handleChange = (field, value) => {
        setFormSettings((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setChartSettings(formSettings);
    };

    return (
        <section className="chart-module">
            <h2>Визуализация данных D3.js</h2>

            <form className="chart-controls" onSubmit={handleSubmit}>
                <div className="control-group">
                    <label htmlFor="chartX">Значение X</label>
                    <select
                        id="chartX"
                        value={formSettings.xField}
                        onChange={(event) => handleChange("xField", event.target.value)}
                    >
                        {chartFields.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.text}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="chartY">Значение Y</label>
                    <select
                        id="chartY"
                        value={formSettings.yField}
                        onChange={(event) => handleChange("yField", event.target.value)}
                    >
                        {chartFields.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.text}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="chartType">Тип диаграммы</label>
                    <select
                        id="chartType"
                        value={formSettings.chartType}
                        onChange={(event) => handleChange("chartType", event.target.value)}
                    >
                        {chartTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.text}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">Построить</button>
            </form>

            <div className="chart-stats">
                <span>Количество записей: {cats.length}</span>
                <span>X: {getFieldName(chartSettings.xField)}</span>
                <span>Y: {getFieldName(chartSettings.yField)}</span>
                <span>Тип: {getChartTypeName(chartSettings.chartType)}</span>
            </div>

            <div id="chart" className="chart-display" ref={chartRef}></div>
        </section>
    );
}

export default Chart;