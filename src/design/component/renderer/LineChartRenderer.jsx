import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const LineChartRenderer = ({ state, look }) => {
  const ref = useRef();
  const [disabledLines, setDisabledLines] = useState(new Set());

  const width = 600;

  const interpolateAnnotation = (template, d, context = {}) =>
    template
      .replace(/{name}/g, d.data?.name ?? d.label)
      .replace(/{value}/g, d.data?.value ?? d.value)
      .replace(/{title}/g, context.title || "");

  const toggleLine = (name) => {
    setDisabledLines((prev) => {
      const updated = new Set(prev);
      if (updated.has(name)) {
        updated.delete(name);
      } else {
        updated.add(name);
      }
      return updated;
    });
  };

  const parseCustomColors = (input) => {
    const result = {};
    if (!input) return result;
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) result[label] = color;
    });
    return result;
  };

  useEffect(() => {
    if (!state.data || state.data?.length < 2) return;

    const fontFamily = state.font || "Arial, sans-serif";
    const titleFontSize = state.titleSize || 40;
    const articleFontSize = state.articleSize || 16;
    const textColor = state.textColor || "#000000";
    const opacity = Math.min(Math.max(state.opacity / 100, 0), 1);

    let dynamicHeight = 300;
    if (state.title) dynamicHeight += titleFontSize + 10;
    if (state.article) dynamicHeight += articleFontSize * 2 + 10;
    if (state.showLegend) dynamicHeight += 40;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    let margin = {
      top:
        30 +
        (state.title ? titleFontSize + 10 : 0) +
        (state.article ? articleFontSize * 2 + 10 : 0) +
        (state.showLegend ? 40 : 0),
      right: 20,
      bottom: 50,
      left: 60,
    };

    if (state.areLabelsVisible) {
      margin.bottom += 20;
      margin.left += 20;
    }

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = dynamicHeight - margin.top - margin.bottom;

    svg.attr("width", width).attr("height", dynamicHeight);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", dynamicHeight)
      .attr(
        "fill",
        state.backgroundColor === "transparent" ? "none" : state.backgroundColor
      )
      .lower();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const headers = state.data[0];
    const lines = headers.slice(1);

    const data = state.data.slice(1).map((row) => {
      const obj = { label: row[0] };
      lines.forEach((line, i) => {
        obj[line] = +row[i + 1];
      });
      return obj;
    });

    const filteredData = data.filter((d) =>
      lines.some((line) => !disabledLines.has(line) && d[line] !== 0)
    );

    const x = d3
      .scalePoint()
      .domain(filteredData.map((d) => d.label))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(lines, (line) => d[line]))])
      .nice()
      .range([innerHeight, 0]);

    const colorMap = parseCustomColors(state.customColors);
    const selectedPalette =
      ColorPalettes[state.colorPalette] || ColorPalettes.vibrant;
    const fallbackColorScale = d3
      .scaleOrdinal(selectedPalette.colors)
      .domain(lines);

    const lineGenerator = (key) =>
      d3
        .line()
        .x((d) => x(d.label))
        .y((d) => y(d[key]));

    const yAxis = d3
      .axisLeft(y)
      .tickSize(state.showGrids ? -innerWidth : 0)
      .tickPadding(10);

    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line")
          .attr("stroke", textColor)
          .attr("stroke-opacity", state.showGrids ? 0.2 : 0);
        g.selectAll(".tick text").attr("fill", textColor);
      });

    const xAxis = d3.axisBottom(x).tickPadding(10);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line").attr("stroke", textColor);
        g.selectAll(".tick text").attr("fill", textColor);
      });

    if (state.areLabelsVisible) {
      g.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .style("font-size", "14px")
        .style("fill", textColor)
        .style("font-family", fontFamily)
        .text(state.xAxisLabel || "X Axis");

      g.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${-margin.left + 30},${innerHeight / 2}) rotate(-90)`
        )
        .style("font-size", "14px")
        .style("fill", textColor)
        .style("font-family", fontFamily)
        .text(state.yAxisLabel || "Y Axis");
    }

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#ffffff")
      .style("border", "1px solid #ccc")
      .style("color", "#000000")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "0.9rem")
      .style("display", "none")
      .style("font-family", fontFamily);

    lines.forEach((key) => {
      if (disabledLines.has(key)) return;

      const filteredData = data.filter((d) => d[key] !== 0);
      if (filteredData.length === 0) return;

      const color = colorMap[key] || fallbackColorScale(key);
      const line = lineGenerator(key);

      const path = g
        .append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-opacity", opacity)
        .attr("stroke-width", 2)
        .attr("d", line);

      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(state.transitionTime || 750)
        .attr("stroke-dashoffset", 0);

      filteredData.forEach((d) => {
        g.append("circle")
          .attr("cx", x(d.label))
          .attr("cy", y(d[key]))
          .attr("r", 3)
          .attr("fill", color)
          .attr("opacity", opacity)
          .on("mouseover", (event) => {
            if (state.showAnnotations) {
              tooltip
                .html(
                  `<div>${interpolateAnnotation(
                    state.customAnnotation || "{name}: {value}",
                    {
                      data: {
                        name: d.label,
                        value: d[key],
                      },
                    },
                    { title: key }
                  )}</div>`
                )
                .style("display", "block");
            }
          })
          .on("mousemove", (event) => {
            tooltip
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px");
          })
          .on("mouseout", () => tooltip.style("display", "none"));
      });
    });

    if (state.title) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", titleFontSize)
        .style("font-size", `${titleFontSize}px`)
        .style("font-weight", "bold")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.title);
    }

    if (state.article) {
      const articleY = state.title ? titleFontSize + 10 : 20;
      const maxArticleWidth = width - 40;
      const lineHeight = articleFontSize * 1.5;

      svg
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", articleY)
        .attr("width", maxArticleWidth)
        .attr("height", articleFontSize * 3)
        .append("xhtml:div")
        .style("font-size", `${articleFontSize}px`)
        .style("font-family", fontFamily)
        .style("color", textColor)
        .style("line-height", `${lineHeight}px`)
        .style("display", "block")
        .style("text-align", "left")
        .html(state.article);
    }

    if (state.showLegend) {
      let legendY = 20;
      if (state.title) legendY += titleFontSize + 10;
      if (state.article) legendY += articleFontSize * 2 + 10;

      const legend = svg
        .append("g")
        .attr("transform", `translate(20, ${legendY})`);

      let xOffset = 0;
      let yOffset = 0;
      const maxLegendWidth = width - 40;

      lines.forEach((lineName) => {
        if (lineName === null) return;
        const isActive = !disabledLines.has(lineName);
        const color = colorMap[lineName] || fallbackColorScale(lineName);
        const textWidth = lineName?.length * (articleFontSize * 0.6) + 7;

        if (xOffset + textWidth > maxLegendWidth) {
          xOffset = 0;
          yOffset += 20;
        }

        const legendItem = legend
          .append("g")
          .attr("transform", `translate(${xOffset}, ${yOffset})`);

        legendItem
          .append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", color)
          .attr("stroke", isActive ? "black" : "none")
          .attr("cursor", "pointer")
          .on("click", () => toggleLine(lineName));

        legendItem
          .append("text")
          .attr("x", 18)
          .attr("y", 10)
          .text(lineName)
          .style("font-size", `${articleFontSize - 4}px`)
          .style("font-family", fontFamily)
          .style("cursor", "pointer")
          .style("fill", isActive ? textColor : "#ccc")
          .on("click", () => toggleLine(lineName));

        xOffset += textWidth;
      });
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", dynamicHeight - 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.footerText);
    }
  }, [state, disabledLines]);

  return (
    <Box sx={look}>
      <svg ref={ref} style={{ border: "1px solid #001f47" }} />
    </Box>
  );
};

export default LineChartRenderer;
