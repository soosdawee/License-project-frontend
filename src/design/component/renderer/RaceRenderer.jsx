import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import ColorPalettes from "../ui/ColorPalettes";

const RaceRenderer = ({ state }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [valueIndex, setValueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFilters, setActiveFilters] = useState(new Set());

  const rawHeaders = state.data?.[0]?.slice(2) || [];
  const rows = state.data?.slice(1) || [];

  const allFilters = Array.from(
    new Set(rows.map((row) => row[1]).filter(Boolean))
  );
  useEffect(() => {
    setActiveFilters(new Set(allFilters));
  }, [state.data]);

  const dataSeries = rows
    .map(([name, filter, ...values]) => ({
      name,
      filter,
      values: values.map((v) =>
        v === "" || v === null || v === undefined ? null : Number(v)
      ),
    }))
    .filter((d) => d.name && d.name.trim() !== "")
    .filter((d) => d.values.some((v) => typeof v === "number" && !isNaN(v)));

  const validColumnIndices = rawHeaders
    .map((header, i) => ({
      index: i,
      hasHeader: !!header && header.trim() !== "",
      hasValue: dataSeries.some(
        (d) => typeof d.values[i] === "number" && !isNaN(d.values[i])
      ),
    }))
    .filter((col) => col.hasHeader && col.hasValue)
    .map((col) => col.index);

  const headers = validColumnIndices.map((i) => rawHeaders[i]);
  const valueColumnCount = validColumnIndices.length;
  const selectedIndex = validColumnIndices[valueIndex];

  const filteredDataSeries = dataSeries.filter((d) =>
    activeFilters.has(d.filter)
  );

  const currentData = filteredDataSeries
    .map((d) => ({
      name: d.name,
      value: d.values[selectedIndex] ?? null,
    }))
    .filter((d) => d.name && d.name.trim() !== "")
    .filter((d) => typeof d.value === "number" && !isNaN(d.value))
    .sort((a, b) => b.value - a.value);

  const allSeriesNames = dataSeries.map((d) => d.name);

  const paletteColors =
    ColorPalettes[state.colorPalette]?.colors || ColorPalettes.vibrant.colors;

  const colorMapping = {};
  allSeriesNames.forEach((name, index) => {
    colorMapping[name] = paletteColors[index % paletteColors.length];
  });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!state || !dimensions.width || !dimensions.height) return;

    const svg = d3.select(svgRef.current);
    const width = dimensions.width;
    const height = dimensions.height;

    const titleHeight = state.title ? (state.titleSize || 40) + 10 : 0;
    const articleHeight = state.article ? 70 : 0;
    const dynamicTop = 20 + titleHeight + articleHeight;
    const footerHeight = state.isFooter && state.footerText ? 20 : 0;

    const margin = {
      top: dynamicTop,
      right: 160,
      bottom: 40 + footerHeight,
      left: 100,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const fontFamily = state.font || "Arial, sans-serif";
    const textColor = state.textColor || "#000000";
    const titleFontSize = state.titleSize || 40;
    const articleFontSize = state.articleSize || 16;
    const barSpacing = Math.min(Math.max(state.barSpacing / 100, 0), 1);
    const barOpacity = Math.min(Math.max(state.opacity / 100, 0), 1);

    const customColorMap = (state.customBarColors || "")
      .split(",")
      .reduce((acc, pair) => {
        const [key, color] = pair.split(":").map((s) => s.trim());
        if (key && color) acc[key] = color;
        return acc;
      }, {});

    let backgroundRect = svg.select("rect.background");
    if (backgroundRect.empty()) {
      backgroundRect = svg.append("rect").attr("class", "background").lower();
    }

    backgroundRect
      .attr("width", width)
      .attr("height", height)
      .attr(
        "fill",
        state.backgroundColor === "transparent"
          ? "none"
          : state.backgroundColor || "#ffffff"
      );

    const g = svg.select("g.race-content");
    if (g.empty()) {
      svg
        .append("g")
        .attr("class", "race-content")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    const group = svg.select("g.race-content");
    group.attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleBand()
      .domain(currentData.map((d) => d.name))
      .range([0, innerHeight])
      .padding(barSpacing);

    const maxValue = d3.max(currentData, (d) => d.value) || 0;
    const x = d3.scaleLinear().domain([0, maxValue]).range([0, innerWidth]);

    group.selectAll("g.axis").remove();

    group
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", textColor)
      .style("font-family", fontFamily);

    group
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .style("fill", textColor)
      .style("font-family", fontFamily);

    const bars = group.selectAll("rect.bar").data(currentData, (d) => d.name);

    bars.join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "bar")
          .attr("y", (d) => y(d.name))
          .attr("x", 0)
          .attr("height", y.bandwidth())
          .attr("width", (d) => x(d.value))
          .attr(
            "fill",
            (d) =>
              customColorMap[d.name] ||
              colorMapping[d.name] ||
              state.barColor ||
              "#600002"
          )
          .attr("fill-opacity", barOpacity),
      (update) =>
        update
          .call((update) =>
            update
              .transition()
              .duration(800)
              .attr("y", (d) => y(d.name))
              .attr("width", (d) => x(d.value))
              .attr("height", y.bandwidth())
          )
          .attr(
            "fill",
            (d) =>
              customColorMap[d.name] ||
              colorMapping[d.name] ||
              state.barColor ||
              "#600002"
          )
          .attr("fill-opacity", barOpacity),
      (exit) => exit.remove()
    );

    svg.selectAll(".static-text").remove();

    if (state.title) {
      svg
        .append("text")
        .attr("class", "static-text")
        .attr("x", 20)
        .attr("y", titleFontSize)
        .style("font-size", `${titleFontSize}px`)
        .style("font-weight", "bold")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.title);
    }

    if (state.article) {
      svg
        .append("foreignObject")
        .attr("class", "static-text")
        .attr("x", 20)
        .attr("y", titleFontSize + 10)
        .attr("width", width - 40)
        .attr("height", 80)
        .append("xhtml:div")
        .style("font-size", `${articleFontSize}px`)
        .style("font-family", fontFamily)
        .style("color", textColor)
        .style("line-height", "0.75")
        .style("display", "block")
        .style("text-align", "left")
        .html(state.article);
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("class", "static-text")
        .attr("x", 10)
        .attr("y", height - 10)
        .style("font-size", "12px")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.footerText);
    }

    svg.selectAll("g.svg-legend").remove();

    if (state.showLegend) {
      const legend = svg
        .append("g")
        .attr("class", "svg-legend")
        .attr(
          "transform",
          `translate(${width - margin.right + 20}, ${dynamicTop})`
        );

      const legendSpacing = 20;

      allFilters.forEach((filterVal, i) => {
        const isActive = activeFilters.has(filterVal);
        const g = legend
          .append("g")
          .attr("class", "legend-item")
          .attr("transform", `translate(0, ${i * legendSpacing})`)
          .style("cursor", "pointer")
          .on("click", () => {
            const newFilters = new Set(activeFilters);
            if (newFilters.has(filterVal)) {
              newFilters.delete(filterVal);
            } else {
              newFilters.add(filterVal);
            }
            setActiveFilters(newFilters);
          });

        g.append("rect")
          .attr("width", 14)
          .attr("height", 14)
          .attr("fill", isActive ? "#444" : "#ccc")
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5);

        g.append("text")
          .attr("x", 18)
          .attr("y", 12)
          .text(filterVal)
          .style("font-size", "12px")
          .style("font-family", fontFamily)
          .style("fill", textColor);
      });
    }
  }, [state, valueIndex, dimensions, colorMapping, activeFilters]);

  useEffect(() => {
    if (!isPlaying) return;
    if (valueIndex >= valueColumnCount - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setValueIndex((i) => i + 1), 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, valueIndex, valueColumnCount]);

  return (
    <Box
      sx={{ width: "100%", height: "100%", position: "relative" }}
      ref={wrapperRef}
    >
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: "5px",
          width: "5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={() => setIsPlaying(!isPlaying)}
          sx={{ pointerEvents: "auto" }}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>

        <Select
          size="small"
          value={valueIndex}
          onChange={(e) => {
            setValueIndex(Number(e.target.value));
            setIsPlaying(false);
          }}
          sx={{ pointerEvents: "auto", backgroundColor: "white" }}
        >
          {headers.map((label, idx) => (
            <MenuItem key={label} value={idx}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default RaceRenderer;
