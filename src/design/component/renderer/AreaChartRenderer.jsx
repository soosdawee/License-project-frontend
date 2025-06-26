import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const AreaChartRenderer = ({ state }) => {
  const ref = useRef();
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHeight, setContainerHeight] = useState(400);
  const [disabledAreas, setDisabledAreas] = useState(new Set());

  const interpolateAnnotation = (template, d, context = {}) =>
    template
      .replace(/{name}/g, d.data?.name ?? d.label)
      .replace(/{value}/g, d.data?.value ?? d.value)
      .replace(/{title}/g, context.title || "");

  const toggleArea = (name) => {
    setDisabledAreas((prev) => {
      const updated = new Set(prev);
      updated.has(name) ? updated.delete(name) : updated.add(name);
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
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
          setContainerHeight(entry.contentRect.height);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!state.data || state.data?.length < 2) return;

    const fontFamily = state.font || "Arial, sans-serif";
    const titleFontSize = state.titleSize || 40;
    const articleFontSize = state.articleSize || 16;
    const textColor = state.textColor || "#000000";
    const opacity = Math.min(Math.max(state.opacity / 100, 0), 1);

    const margin = {
      top:
        0.05 * containerHeight +
        (state.title ? titleFontSize + 10 : 0) +
        (state.article ? articleFontSize * 2 + 10 : 0) +
        (state.showLegend ? 40 : 0),
      right: 0.05 * containerWidth,
      bottom:
        0.1 * containerHeight +
        (state.areLabelsVisible ? 20 : 0) +
        (state.isFooter ? 40 : 0),
      left: 0.13 * containerWidth + (state.areLabelsVisible ? 30 : 0),
    };

    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    svg.attr("width", containerWidth).attr("height", containerHeight);

    svg
      .append("rect")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr(
        "fill",
        state.backgroundColor === "transparent" ? "none" : state.backgroundColor
      )
      .lower();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const headers = state.data[0];
    const series = headers.slice(1);

    const data = state.data
      .slice(1)
      .filter((row) => row.length > 1)
      .map((row) => {
        const obj = { label: row[0] };
        series.forEach((line, i) => {
          obj[line] = +row[i + 1];
        });
        return obj;
      });

    const filteredData = data.filter((d) =>
      series.some((key) => !disabledAreas.has(key) && d[key] !== 0)
    );

    const x = d3
      .scalePoint()
      .domain(filteredData.map((d) => d.label))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(series, (key) => d[key]))])
      .nice()
      .range([innerHeight, 0]);

    const colorMap = parseCustomColors(state.customColors);
    const selectedPalette =
      ColorPalettes[state.colorPalette] || ColorPalettes.vibrant;
    const fallbackColorScale = d3
      .scaleOrdinal(selectedPalette.colors)
      .domain(series);

    const yAxis = d3
      .axisLeft(y)
      .tickSize(state.showGrids ? -innerWidth : 0)
      .tickPadding(10);

    g.append("g")
      .call(yAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line")
          .attr("stroke", textColor)
          .attr("stroke-opacity", state.showGrids ? 0.2 : 0);
        g.selectAll(".tick text").attr("fill", textColor);
      });

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickPadding(10))
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line").attr("stroke", textColor);
        g.selectAll(".tick text").attr("fill", textColor);
      });

    if (state.areLabelsVisible) {
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .style("font-size", "14px")
        .style("fill", textColor)
        .style("font-family", fontFamily)
        .text(state.xAxisLabel || "X Axis");

      g.append("text")
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

    series.forEach((key) => {
      if (disabledAreas.has(key)) return;
      const filteredData = data.filter((d) => d[key] !== 0);
      if (filteredData.length === 0) return;

      const color = colorMap[key] || fallbackColorScale(key);

      const area = d3
        .area()
        .x((d) => x(d.label))
        .y0(innerHeight)
        .y1((d) => y(d[key]));

      const path = g
        .append("path")
        .datum(filteredData)
        .attr("fill", color)
        .attr("fill-opacity", opacity * 0.6)
        .attr("d", area);

      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("stroke-opacity", opacity)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(state.transitionTime || 750)
        .attr("stroke-dashoffset", 0);

      if (state.showLegend) {
        const legend = svg
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top - 30})`);

        const legendItems = series
          .filter((key) => {
            return data.some((d) => d[key] !== 0 && d[key] !== undefined);
          })
          .map((key) => ({
            name: key,
            color: colorMap[key] || fallbackColorScale(key),
          }));

        let xOffset = -90;
        const padding = 0;
        const fontSize = 12;

        legendItems.forEach((item) => {
          const group = legend
            .append("g")
            .attr("transform", `translate(${xOffset}, 0)`)
            .style("cursor", "pointer")
            .on("click", () => toggleArea(item.name));

          group
            .append("rect")
            .attr("x", 0)
            .attr("y", -fontSize + 2)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", item.color)
            .attr("opacity", disabledAreas.has(item.name) ? 0.3 : 1);

          const text = group
            .append("text")
            .attr("x", 16)
            .attr("y", 2)
            .style("fill", textColor)
            .style("font-family", fontFamily)
            .style("font-size", `${fontSize}px`)
            .text(item.name)
            .attr("opacity", disabledAreas.has(item.name) ? 0.3 : 1);

          const textWidth = text.node().getComputedTextLength();
          xOffset += textWidth + 12 + padding + 8;
        });
      }

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
        .attr("x", 50)
        .attr("y", titleFontSize)
        .attr("text-anchor", "middle")
        .style("font-size", `${titleFontSize}px`)
        .style("font-weight", "bold")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.title);
    }

    if (state.article) {
      const articleY = state.title ? titleFontSize + 10 : 20;
      const maxArticleWidth = containerWidth - 40;
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

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 35)
        .attr("y", containerHeight - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.footerText);
    }

    return () => tooltip.remove();
  }, [state, containerWidth, containerHeight, disabledAreas]);

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

export default AreaChartRenderer;
