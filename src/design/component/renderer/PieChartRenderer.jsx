import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const PieChartRenderer = ({ state, look }) => {
  const ref = useRef();
  const prevArcsRef = useRef();
  const [disabledCategories, setDisabledCategories] = useState(new Set());

  const width = 600;
  const height = 400;

  const interpolateAnnotation = (template, d) =>
    template
      .replace(/{name}/g, d.data.name)
      .replace(/{value}/g, d.data.value)
      .replace(/{note}/g, d.data.note || "");

  const parseCustomColors = (input) => {
    const result = {};
    if (!input) return result;
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) result[label] = color;
    });
    return result;
  };

  const getContrastingTextColor = (hexColor) => {
    hexColor = hexColor.replace("#", "");
    if (hexColor.length === 3) {
      hexColor = hexColor
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(hexColor.substr(0, 2), 16) / 255;
    const g = parseInt(hexColor.substr(2, 2), 16) / 255;
    const b = parseInt(hexColor.substr(4, 2), 16) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const toggleCategory = (name) => {
    setDisabledCategories((prev) => {
      const updated = new Set(prev);
      if (updated.has(name)) {
        updated.delete(name);
      } else {
        updated.add(name);
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!state.data || state.data.length === 0) return;

    const fontFamily = state.font || "Arial, sans-serif";
    const titleFontSize = state.titleSize || 40;
    const articleFontSize = state.articleSize || 16;
    const textColor = state.textColor || "#000000";
    const opacity = Math.min(Math.max(state.opacity / 100, 0), 1);

    const cornerRadius = 0;
    const rawData = state.data
      .filter((row) => row[0] !== "" && !isNaN(row[1]))
      .map((row) => ({ name: row[0], value: +row[1], note: row[2] || "" }))
      .filter((d) => d.value > 0);

    const filteredData =
      disabledCategories.size === 0
        ? rawData
        : rawData.filter((d) => !disabledCategories.has(d.name));

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    let topMargin = 20;
    if (state.title) topMargin += titleFontSize + 10;
    if (state.article) topMargin += articleFontSize * 2 + 10;
    if (state.showLegend) topMargin += 30;

    const footerHeight = state.isFooter && state.footerText ? 30 : 0;
    const availableChartHeight = height - topMargin - footerHeight;
    const radius = Math.min(width, availableChartHeight) / 2 - 10;

    svg.attr("width", width).attr("height", height);

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
      .style("background", "#ffffff")
      .style("border", "1px solid #ccc")
      .style("color", "#000000")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "0.9rem")
      .style("display", "none")
      .style("font-family", fontFamily);

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2}, ${topMargin + availableChartHeight / 2})`
      );

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius)
      .cornerRadius(cornerRadius);

    const newArcs = pie(filteredData);

    const colorMap = parseCustomColors(state.customColors);
    const selectedPalette =
      ColorPalettes[state.colorPalette] || ColorPalettes.vibrant;
    const fallbackColorScale = d3
      .scaleOrdinal(selectedPalette.colors)
      .domain(rawData.map((d) => d.name));

    const findPrevArc = (name) =>
      prevArcsRef.current?.find((d) => d.data.name === name);

    const paths = g.selectAll("path").data(newArcs, (d) => d.data.name);

    paths
      .enter()
      .append("path")
      .attr(
        "fill",
        (d) => colorMap[d.data.name] || fallbackColorScale(d.data.name)
      )
      .attr("fill-opacity", opacity)
      .each(function (d) {
        this._current = {
          startAngle: d.endAngle,
          endAngle: d.endAngle,
          innerRadius: 0,
          outerRadius: radius,
          data: d.data,
        };
      })
      .merge(paths)
      .transition()
      .duration(state.transitionTime || 750)
      .attrTween("d", function (d) {
        const interp = d3.interpolate(this._current, d);
        this._current = interp(1);
        return (t) => arc(interp(t));
      });

    paths
      .exit()
      .transition()
      .duration(state.transitionTime || 750)
      .attrTween("d", function (d) {
        const start = this._current || d;
        const end = { ...d, startAngle: d.endAngle, endAngle: d.endAngle };
        const interp = d3.interpolate(start, end);
        return (t) => arc(interp(t));
      })
      .remove();

    prevArcsRef.current = newArcs;

    g.selectAll("path")
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
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));

    g.selectAll(".label-group").remove();

    const total = d3.sum(filteredData, (d) => d.value);

    const labelGroups = g
      .selectAll(".label-group")
      .data(newArcs, (d) => d.data.name)
      .enter()
      .append("g")
      .attr("class", "label-group")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle");

    labelGroups
      .append("text")
      .text((d) => d.data.name)
      .style("font-size", "12px")
      .style("font-family", fontFamily)
      .style("fill", (d) => {
        const fillColor =
          colorMap[d.data.name] || fallbackColorScale(d.data.name);
        return getContrastingTextColor(fillColor);
      })
      .attr("dy", state.showPercentages ? "-0.4em" : "0.35em");

    if (state.showPercentages) {
      labelGroups
        .append("text")
        .text((d) => `${((d.data.value / total) * 100).toFixed(1)}%`)
        .style("font-size", "11px")
        .style("font-family", fontFamily)
        .style("fill", (d) => {
          const fillColor =
            colorMap[d.data.name] || fallbackColorScale(d.data.name);
          return getContrastingTextColor(fillColor);
        })
        .attr("dy", "0.9em");
    }

    if (state.title) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", titleFontSize)
        .attr("text-anchor", "start")
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
      // Legend should be placed right under article
      let legendY = 20;
      if (state.title) legendY += titleFontSize + 10;
      if (state.article) legendY += articleFontSize * 2 + 10;

      const legend = svg
        .append("g")
        .attr("transform", `translate(20, ${legendY})`);

      let xOffset = 0;

      rawData.forEach((item) => {
        if (!item.name) return;

        const isActive = !disabledCategories.has(item.name);
        const color = colorMap[item.name] || fallbackColorScale(item.name);
        const label = item.name || "";
        const textWidth = label.length * (articleFontSize * 0.6) + 20;

        const legendItem = legend
          .append("g")
          .attr("transform", `translate(${xOffset}, 0)`);

        legendItem
          .append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", color)
          .attr("stroke", isActive ? "black" : "none")
          .attr("cursor", "pointer")
          .on("click", () => toggleCategory(item.name));

        legendItem
          .append("text")
          .attr("x", 18)
          .attr("y", 10)
          .text(label)
          .style("font-size", `${articleFontSize - 4}px`)
          .style("font-family", fontFamily)
          .style("cursor", "pointer")
          .style("fill", isActive ? textColor : "#ccc")
          .on("click", () => toggleCategory(item.name));

        xOffset += textWidth + 5;
      });
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", height - 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.footerText);
    }

    return () => tooltip.remove();
  }, [state, disabledCategories]);

  return (
    <Box sx={look}>
      <svg ref={ref} style={{ border: "1px solid #001f47" }} />
    </Box>
  );
};

export default PieChartRenderer;
