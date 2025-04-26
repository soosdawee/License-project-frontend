import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChartRenderer = ({ tableData }) => {
  const ref = useRef();
  const width = 600;
  const height = 400;

  console.log(tableData);

  useEffect(() => {
    if (!tableData || tableData.length === 0) return;

    const formattedData = tableData
      .filter((row) => row[0] !== "" && !isNaN(row[1]))
      .map((row) => ({
        name: row[0],
        value: +row[1],
      }));

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(formattedData.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, (d) => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g").call(d3.axisLeft(y));

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.selectAll("rect")
      .data(formattedData)
      .join("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", "#60002");
  }, [tableData]);

  return <svg ref={ref} width={width} height={height} />;
};

export default BarChartRenderer;
