import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const LineChartRenderer = ({ state }) => {
  const ref = useRef();
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHeight, setContainerHeight] = useState(400);
  const [disabledLines, setDisabledLines] = useState(new Set());

  const handleAnnotations = (template, d, context = {}) =>
    template
      .replace(/{name}/g, d.data?.name ?? d.label)
      .replace(/{value}/g, d.data?.value ?? d.value)
      .replace(/{title}/g, context.title || "");

  const toggleLine = (name) => {
    setDisabledLines((prev) => {
      const result = new Set(prev);
      if (result.has(name)) {
        result.delete(name);
      } else {
        result.add(name);
      }
      return result;
    });
  };

  const getCustomColors = (input) => {
    const result = {};
    if (!input) return result;
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) result[label] = color;
    });
    return result;
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
          setContainerHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!state.data || state.data?.length < 2) return;

    const textColor = state.textColor || "#000000";
    const opacity = Math.min(Math.max(state.opacity / 100, 0), 1);
    const font = state.font || "Arial, sans-serif";
    const titleSize = state.titleSize || 40;
    const articleSize = state.articleSize || 16;

    const margin = {
      top:
        30 +
        (state.title ? titleSize + 10 : 0) +
        (state.article ? articleSize * 2 + 10 : 0) +
        (state.showLegend ? 40 : 0),
      right: 20,
      bottom: 50 + (state.areLabelsVisible ? 20 : 0),
      left: 60 + (state.areLabelsVisible ? 20 : 0),
    };

    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    svg.attr("width", containerWidth).attr("height", containerHeight);

    svg
      .append("rect")
      .attr("height", containerHeight)
      .attr("width", containerWidth)
      .attr(
        "fill",
        state.backgroundColor === "transparent" ? "none" : state.backgroundColor
      )
      .lower();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const columnHeaders = state.data[0];
    const lines = columnHeaders.slice(1);

    const data = state.data.slice(1).map((row) => {
      const obj = { label: row[0] };
      lines.forEach((line, i) => {
        obj[line] = +row[i + 1];
      });
      return obj;
    });

    const filtered = data.filter((d) =>
      lines.some((line) => !disabledLines.has(line) && d[line] !== 0)
    );

    const x = d3
      .scalePoint()
      .domain(filtered.map((d) => d.label))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(lines, (line) => d[line]))])
      .nice()
      .range([innerHeight, 0]);

    const colors = getCustomColors(state.customColors);
    const selectedPalette =
      ColorPalettes[state.colorPalette] || ColorPalettes.vibrant;
    const worstCaseColors = d3
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
        .style("fill", textColor)
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-family", font)
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .text(state.xAxisLabel || "X Axis");

      g.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${-margin.left + 30},${innerHeight / 2}) rotate(-90)`
        )
        .style("fill", textColor)
        .style("font-family", font)
        .style("font-size", "14px")
        .text(state.yAxisLabel || "Y Axis");
    }

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "#ffffff")
      .style("border", "1px solid #ccc")
      .style("color", "#000000")
      .style("border-radius", "4px")
      .style("font-family", font)
      .style("font-size", "0.9rem")
      .style("padding", "8px")
      .style("display", "none");

    lines.forEach((key) => {
      if (disabledLines.has(key)) {
        return;
      }

      const filteredData = data.filter((d) => d[key] !== 0);
      if (filteredData.length === 0) {
        return;
      }

      const color = colors[key] || worstCaseColors(key);
      const line = lineGenerator(key);

      const path = g
        .append("path")
        .datum(filteredData)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-opacity", opacity)
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
                  `<div>${handleAnnotations(
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
        .attr("y", titleSize)
        .style("font-size", `${titleSize}px`)
        .style("font-weight", "bold")
        .style("font-family", font)
        .style("fill", textColor)
        .text(state.title);
    }

    if (state.article) {
      const articleY = state.title ? titleSize + 10 : 20;
      const maxArticleWidth = containerWidth - 40;
      const lineHeight = articleSize * 1.5;

      svg
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", articleY)
        .attr("width", maxArticleWidth)
        .attr("height", articleSize * 3)
        .append("xhtml:div")
        .style("color", textColor)
        .style("font-family", font)
        .style("font-size", `${articleSize}px`)
        .style("display", "block")
        .style("line-height", `${lineHeight}px`)
        .style("text-align", "left")
        .html(state.article);
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 35)
        .attr("y", containerHeight - 10)
        .style("font-family", font)
        .style("fill", textColor)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(state.footerText);
    }

    if (state.showLegend) {
      let legendY = 20;
      if (state.title) legendY += titleSize + 10;
      if (state.article) legendY += articleSize * 2 + 10;

      const legend = svg
        .append("g")
        .attr("transform", `translate(20, ${legendY})`);

      let xOffset = 0;
      let yOffset = 0;
      const maxLegendWidth = containerWidth - 40;

      lines.forEach((lineName) => {
        if (lineName === null) {
          return;
        }
        const isActive = !disabledLines.has(lineName);
        const color = colors[lineName] || worstCaseColors(lineName);
        const textWidth = lineName?.length * (articleSize * 0.6) + 7;

        if (xOffset + textWidth > maxLegendWidth) {
          xOffset = 0;
          yOffset += 20;
        }

        const legendItem = legend
          .append("g")
          .attr("transform", `translate(${xOffset}, ${yOffset})`);

        legendItem
          .append("rect")
          .attr("fill", color)
          .attr("stroke", isActive ? "black" : "none")
          .attr("width", 12)
          .attr("height", 12)
          .attr("cursor", "pointer")
          .on("click", () => toggleLine(lineName));

        legendItem
          .append("text")
          .attr("x", 18)
          .attr("y", 10)
          .text(lineName)
          .style("fill", isActive ? textColor : "#ccc")
          .style("font-family", font)
          .style("font-size", `${articleSize - 4}px`)
          .style("cursor", "pointer")
          .on("click", () => toggleLine(lineName));

        xOffset += textWidth + 15;
      });
    }

    return () => {
      tooltip.remove();
    };
  }, [state, containerWidth, containerHeight, disabledLines]);

  return (
    <Box
      ref={containerRef}
      sx={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg
        ref={ref}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default LineChartRenderer;
