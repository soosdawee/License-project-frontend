import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const PieChartRenderer = ({ state, chartRef }) => {
  const ref = useRef();
  const containerRef = useRef();
  const prevArcsRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHieght, setContainerHeight] = useState(400);
  const [disabledCategories, setDisabledCategories] = useState(new Set());

  const handleAnnotation = (template, d) =>
    template
      .replace(/{name}/g, d.data.name)
      .replace(/{value}/g, d.data.value)
      .replace(/{note}/g, d.data.note || "");

  const parseCustomColors = (colors) => {
    if (!colors) {
      return {};
    }
    const result = {};
    colors.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) result[label] = color;
    });
    return result;
  };

  const findContrast = (hexColor) => {
    hexColor = hexColor?.substring(1);

    if (hexColor?.length === 3) {
      hexColor = hexColor
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const luminance =
      (0.299 * parseInt(hexColor?.substr(0, 2), 16)) / 255 +
      (0.587 * parseInt(hexColor?.substr(2, 2), 16)) / 255 +
      (0.114 * parseInt(hexColor?.substr(4, 2), 16)) / 255;
    return luminance < 0.5 ? "#ffffff" : "#000000";
  };

  const toggleCategory = (name) => {
    setDisabledCategories((prev) => {
      const updated = new Set(prev);
      updated.has(name) ? updated.delete(name) : updated.add(name);
      return updated;
    });
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerHeight(height);
        setContainerWidth(width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const width = containerWidth;
    const height = containerHieght;

    if (
      !state.data ||
      state.data.length === 0 ||
      !containerWidth ||
      !containerHieght
    ) {
      return;
    }

    const textColor = state.textColor || "#000000";
    const opacity = Math.min(Math.max(state.opacity / 100, 0), 1);
    const font = state.font || "Arial, sans-serif";
    const titleSize = state.titleSize || 40;
    const articelSize = state.articleSize || 16;
    const cornerRadius = 0;

    const rawData = state.data
      .filter((row) => row[0] !== "" && !isNaN(row[1]))
      .map((row) => ({ name: row[0], value: +row[1], note: row[2] || "" }))
      .filter((d) => d.value > 0);

    const filtered =
      disabledCategories.size === 0
        ? rawData
        : rawData.filter((d) => !disabledCategories.has(d.name));

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    let topMargin = 20;
    if (state.title) topMargin += titleSize + 10;
    if (state.article) topMargin += articelSize * 2 + 10;
    if (state.showLegend) topMargin += 30;

    const footerHeight = state.isFooter && state.footerText ? 30 : 0;
    const availableChartHeight = height - topMargin - footerHeight;
    const radius = Math.min(width, availableChartHeight) / 2 - 10;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svg
      .append("rect")
      .attr("height", height)
      .attr("width", width)
      .attr(
        "fill",
        state.backgroundColor === "transparent" ? "none" : state.backgroundColor
      )
      .lower();

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("color", "#000000")
      .style("position", "absolute")
      .style("background", "#ffffff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "0.9rem")
      .style("font-family", font)
      .style("display", "none")
      .style("padding", "8px");

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

    const newArcs = pie(filtered);
    const colorMap = parseCustomColors(state.customColors);
    const selectedPalette =
      ColorPalettes[state.colorPalette] || ColorPalettes.vibrant;
    const fallbackColorScale = d3
      .scaleOrdinal(selectedPalette.colors)
      .domain(rawData.map((d) => d.name));

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
              `<div>${handleAnnotation(
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

    const total = d3.sum(filtered, (d) => d.value);

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
      .style("font-family", font)
      .style("font-size", "12px")
      .style("fill", (d) => {
        const fillColor =
          colorMap[d.data.name] || fallbackColorScale(d.data.name);
        return findContrast(fillColor);
      })
      .attr("dy", state.showPercentages ? "-0.4em" : "0.35em");

    if (state.showPercentages) {
      labelGroups
        .append("text")
        .text((d) => `${((d.data.value / total) * 100).toFixed(1)}%`)
        .style("font-family", font)
        .style("font-size", "11px")
        .style("fill", (d) => {
          const fillColor =
            colorMap[d.data.name] || fallbackColorScale(d.data.name);
          return findContrast(fillColor);
        })
        .attr("dy", "0.9em");
    }

    if (state.title) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", titleSize)
        .style("fill", textColor)
        .style("font-size", `${titleSize}px`)
        .style("font-family", font)
        .style("font-weight", "bold")
        .text(state.title);
    }

    if (state.article) {
      const articleY = state.title ? titleSize + 10 : 20;
      const maxArticleWidth = width - 40;
      const lineHeight = articelSize * 1.5;

      svg
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", articleY)
        .attr("width", maxArticleWidth)
        .attr("height", articelSize * 3)
        .append("xhtml:div")
        .style("color", textColor)
        .style("font-family", font)
        .style("font-size", `${articelSize}px`)
        .style("line-height", `${lineHeight}px`)
        .style("text-align", "left")
        .style("display", "block")
        .html(state.article);
    }

    if (state.showLegend) {
      let legendY = 20;
      if (state.title) legendY += titleSize + 10;
      if (state.article) legendY += articelSize * 2 + 10;

      const legend = svg
        .append("g")
        .attr("transform", `translate(20, ${legendY})`);

      let xOffset = 0;

      rawData.forEach((item) => {
        if (!item.name) {
          return;
        }

        const isActive = !disabledCategories.has(item.name);
        const color = colorMap[item.name] || fallbackColorScale(item.name);
        const label = item.name;
        const textWidth = label.length * (articelSize * 0.6) + 20;

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
          .style("fill", isActive ? textColor : "#ccc")
          .style("font-family", font)
          .style("font-size", `${articelSize - 4}px`)
          .style("cursor", "pointer")
          .on("click", () => toggleCategory(item.name));

        xOffset += textWidth + 5;
      });
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", height - 10)
        .style("fill", textColor)
        .style("font-family", font)
        .style("font-size", "12px")
        .text(state.footerText);
    }

    return () => tooltip.remove();
  }, [state, disabledCategories, containerWidth, containerHieght]);

  return (
    <Box sx={{ width: "100%", height: "100%" }} ref={chartRef ?? containerRef}>
      <svg
        ref={ref}
        style={{ width: containerWidth, height: containerHieght }}
      />
    </Box>
  );
};

export default PieChartRenderer;
