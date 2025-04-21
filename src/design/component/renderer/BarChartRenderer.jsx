import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChartRenderer = (data, width = 500, height = 300) => {
  const ref = useRef();
  const dataAux = [
    { name: "January", value: 40 },
    { name: "February", value: 55 },
    { name: "March", value: 30 },
    { name: "April", value: 70 },
  ];

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(dataAux.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataAux, (d) => d.value)])
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
      .data(dataAux)
      .join("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", "#69b3a2");
  }, [dataAux, width, height]);

  return <svg ref={ref} width={width} height={height} />;
};

export default BarChartRenderer;
