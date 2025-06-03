import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

const BarChartRenderer = ({ state }) => {
  const ref = useRef();
  const width = 600;
  const height = 400;

  const interpolateAnnotation = (template, d) =>
    template
      .replace(/{name}/g, d.name)
      .replace(/{value}/g, d.value)
      .replace(/{note}/g, d.note || "");

  const parseCustomBarColors = (input) => {
    const result = {};
    if (!input) return result;
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) result[label] = color;
    });
    return result;
  };

  useEffect(() => {
    if (!state.data || state.data.length === 0) return;

    const fontFamily = state.font || "Arial, sans-serif";
    const titleFontSize = state.titleSize || 40;
    const articleFontSize = state.articleSize || 16;
    const textColor = state.textColor || "#000000"; // fallback to black

    const formattedData = state.data
      .filter((row) => row[0] !== "" && row[0] !== null && !isNaN(row[1]))
      .map((row) => ({ name: row[0], value: +row[1], note: row[2] || "" }));

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr(
        "fill",
        state.backgroundColor === "transparent" ? "none" : state.backgroundColor
      )
      .lower();

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.75)")
      .style("color", textColor) // use textColor here
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "0.9rem")
      .style("display", "none")
      .style("font-family", fontFamily);

    const titleMargin = state.title ? titleFontSize * 1.5 : 0;
    const articleMargin = state.article ? 70 : 0;

    const yAxisLabelMargin =
      state.areLabelsVisible && state.yAxisLabel ? 20 : 0;
    const xAxisLabelMargin =
      state.areLabelsVisible && state.xAxisLabel ? 20 : 0;

    const margin = {
      top: 20 + titleMargin + articleMargin,
      right: 60,
      bottom: 50 + xAxisLabelMargin,
      left: 90 + yAxisLabelMargin,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const spacingPadding = Math.min(Math.max(state.barSpacing / 100, 0), 1);
    const defaultBarColor = state.barColor || "#60002";
    const barOpacity = Math.min(Math.max(state.opacity / 100, 0), 1);

    const customColorMap = parseCustomBarColors(state.customBarColors);

    const x = d3
      .scaleBand()
      .domain(formattedData.map((d) => d.name))
      .range([0, innerWidth])
      .padding(spacingPadding);

    const maxValue = d3.max(formattedData, (d) => d.value) || 0;
    const y = d3.scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yAxis = d3.axisLeft(y).ticks(5);

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-family", fontFamily)
      .style("fill", textColor); // y axis tick labels

    if (state.showGrids) {
      const yTicks = y.ticks(5);
      g.append("g")
        .call(
          d3
            .axisLeft(y)
            .tickSize(-innerWidth)
            .tickFormat(() => "")
            .tickValues(yTicks.slice(1))
        )
        .selectAll("line")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2");
    }

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-family", fontFamily)
      .style("fill", textColor); // x axis tick labels

    if (state.areLabelsVisible) {
      if (state.yAxisLabel)
        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2)
          .attr("y", 15)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-family", fontFamily)
          .style("fill", textColor) // y axis label
          .text(state.yAxisLabel);
      if (state.xAxisLabel)
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height - 5)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-family", fontFamily)
          .style("fill", textColor) // x axis label
          .text(state.xAxisLabel);
    }

    g.selectAll("rect.bar")
      .data(formattedData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("y", innerHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => customColorMap[d.name] || defaultBarColor)
      .attr("fill-opacity", barOpacity)
      .on("mouseover", (event, d) => {
        if (state.showAnnotations) {
          tooltip
            .html(
              `<div>${interpolateAnnotation(
                state.customAnnotation || "{name}: {value}",
                d
              )}</div>`
            )
            .style("display", "block");
        }
      })
      .on("mousemove", (event) => {
        if (state.showAnnotations) {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px");
        }
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      })
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerHeight - y(d.value));

    if (state.title) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", titleFontSize)
        .attr("text-anchor", "start")
        .style("font-size", `${titleFontSize}px`)
        .style("font-weight", "bold")
        .style("font-family", fontFamily)
        .style("fill", textColor) // title color
        .text(state.title);
    }

    if (state.article) {
      const articleY = state.title ? titleFontSize * 1.2 + 10 : 20;
      const maxArticleWidth = width - 40;
      const lineHeight = articleFontSize * 1.5;

      svg
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", articleY)
        .attr("width", maxArticleWidth)
        .attr("height", 100)
        .append("xhtml:div")
        .style("font-size", `${articleFontSize}px`)
        .style("font-family", fontFamily)
        .style("color", textColor) // article text color
        .style("line-height", `${lineHeight}px`)
        .style("display", "block")
        .style("text-align", "left")
        .html(state.article);
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", height - 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-family", fontFamily)
        .style("fill", textColor) // footer color
        .text(state.footerText);
    }

    return () => {
      tooltip.remove();
    };
  }, [state]);

  return (
    <Box sx={{ flex: 7 }}>
      <svg ref={ref} width={width} height={height} />
    </Box>
  );
};

export default BarChartRenderer;
