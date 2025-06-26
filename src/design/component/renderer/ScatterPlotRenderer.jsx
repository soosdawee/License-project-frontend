import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const ScatterPlotRenderer = ({ state }) => {
  const ref = useRef();
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHeight, setContainerHeight] = useState(400);
  const [disabledGroups, setDisabledGroups] = useState(new Set());

  const interpolateAnnotation = (template, d, context = {}) =>
    template
      .replace(/{name}/g, d.name ?? "")
      .replace(/{x-axis}/g, d.x ?? "")
      .replace(/{y-axis}/g, d.y ?? "")
      .replace(/{filter}/g, d.group ?? "")
      .replace(/{title}/g, context.title || "");

  const toggleGroup = (group) => {
    setDisabledGroups((prev) => {
      const updated = new Set(prev);
      updated.has(group) ? updated.delete(group) : updated.add(group);
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
    if (!state.data || state.data.length < 2) return;

    const fontFamily = state.font || "Arial, sans-serif";
    const titleFontSize = state.titleSize || 40;
    const articleFontSize = state.articleSize || 16;
    const footerFontSize = 12;
    const textColor = state.textColor || "#000000";
    const opacity = Math.min(Math.max(state.opacity / 100, 0), 1);
    const transitionTime = state.transitionTime || 500;

    const margin = {
      top:
        30 +
        (state.title ? titleFontSize + 10 : 0) +
        (state.article ? articleFontSize * 2 + 10 : 0) +
        (state.showLegend ? 40 : 0),
      right: 20,
      bottom:
        50 +
        (state.areLabelsVisible ? 20 : 0) +
        (state.footer ? footerFontSize * 2 + 10 : 0),
      left: 60 + (state.areLabelsVisible ? 20 : 0),
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

    const [_, xHeader, yHeader, groupHeader] = state.data[0];
    const data = state.data.slice(1).map((row) => ({
      name: row[0],
      x: +row[1],
      y: +row[2],
      group: row[3],
    }));

    const groups = [...new Set(data.map((d) => d.group))];
    const filteredData = data.filter((d) => !disabledGroups.has(d.group));

    const x = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d.x))
      .nice()
      .range([0, innerWidth]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d.y))
      .nice()
      .range([innerHeight, 0]);

    const colorMap = parseCustomColors(state.customColors);
    const selectedPalette =
      ColorPalettes[state.colorPalette] || ColorPalettes.vibrant;
    const fallbackColorScale = d3
      .scaleOrdinal(selectedPalette.colors)
      .domain(groups);

    const xAxis = d3.axisBottom(x).tickPadding(10);
    const yAxis = d3
      .axisLeft(y)
      .tickSize(state.showGrids ? -innerWidth : 0)
      .tickPadding(10);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line").attr("stroke", textColor);
        g.selectAll(".tick text").attr("fill", textColor);
      });

    g.append("g")
      .call(yAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line")
          .attr("stroke", textColor)
          .attr("stroke-opacity", state.showGrids ? 0.2 : 0);
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
        .text(state.xAxisLabel || xHeader);

      g.append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${-margin.left + 30},${innerHeight / 2}) rotate(-90)`
        )
        .style("font-size", "14px")
        .style("fill", textColor)
        .style("font-family", fontFamily)
        .text(state.yAxisLabel || yHeader);
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

    g.selectAll(".point")
      .data(filteredData)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "point")
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y))
            .attr("r", 0)
            .attr(
              "fill",
              (d) => colorMap[d.group] || fallbackColorScale(d.group)
            )
            .attr("opacity", opacity)
            .transition()
            .duration(transitionTime)
            .attr("r", 4),
        (update) =>
          update
            .transition()
            .duration(transitionTime)
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y))
            .attr(
              "fill",
              (d) => colorMap[d.group] || fallbackColorScale(d.group)
            )
            .attr("opacity", opacity),
        (exit) =>
          exit.transition().duration(transitionTime).attr("r", 0).remove()
      )
      .on("mouseover", (event, d) => {
        if (state.showAnnotations) {
          tooltip
            .html(
              `<div>${interpolateAnnotation(
                state.customAnnotation || "<b>{name}:</b> {x-axis}, {y-axis}",
                d,
                { title: d.group }
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

    if (state.isFooter) {
      g.append("text")
        .attr("x", -60)
        .attr("y", innerHeight + margin.bottom - 10)
        .style("font-size", `${footerFontSize}px`)
        .style("fill", textColor)
        .style("font-family", fontFamily)
        .text(state.footerText);
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
      const maxLegendWidth = containerWidth - 40;

      groups.forEach((group) => {
        const isActive = !disabledGroups.has(group);
        const color = colorMap[group] || fallbackColorScale(group);
        const textWidth = group.length * (articleFontSize * 0.6) + 7;

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
          .on("click", () => toggleGroup(group));

        legendItem
          .append("text")
          .attr("x", 18)
          .attr("y", 10)
          .text(group)
          .style("font-size", `${articleFontSize - 4}px`)
          .style("font-family", fontFamily)
          .style("cursor", "pointer")
          .style("fill", isActive ? textColor : "#ccc")
          .on("click", () => toggleGroup(group));

        xOffset += textWidth + 15;
      });
    }

    return () => tooltip.remove();
  }, [state, containerWidth, containerHeight, disabledGroups]);

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

export default ScatterPlotRenderer;
