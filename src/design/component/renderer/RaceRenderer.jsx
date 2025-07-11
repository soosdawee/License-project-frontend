import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import ColorPalettes from "../ui/ColorPalettes";

const RaceRenderer = ({ state }) => {
  const containerRef = useRef();
  const ref = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHieght, setContainerHeight] = useState(400);
  const [valueIndex, setValueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFilters, setActiveFilters] = useState(new Set());

  const rawColumnHeaders = state.data?.[0]?.slice(2) || [];
  const content = state.data?.slice(1) || [];

  const allFilters = Array.from(
    new Set(content.map((row) => row[1]).filter(Boolean))
  );
  useEffect(() => {
    setActiveFilters(new Set(allFilters));
  }, [state.data]);

  const series = content
    .map(([name, filter, ...values]) => ({
      name,
      filter,
      values: values.map((v) =>
        v === "" || v === null || v === undefined ? null : Number(v)
      ),
    }))
    .filter((d) => d.name && d.name.trim() !== "")
    .filter((d) => d.values.some((v) => typeof v === "number" && !isNaN(v)));

  const columnHeaders = rawColumnHeaders
    .map((header, i) => ({
      index: i,
      hasHeader: !!header && header.trim() !== "",
      hasValue: series.some(
        (d) => typeof d.values[i] === "number" && !isNaN(d.values[i])
      ),
    }))
    .filter((col) => col.hasHeader && col.hasValue)
    .map((col) => col.index);

  const headers = columnHeaders.map((i) => rawColumnHeaders[i]);
  const valueColumnCount = columnHeaders.length;
  const selectedIndex = columnHeaders[valueIndex];

  const filtered = series.filter((d) => activeFilters.has(d.filter));

  const currentData = filtered
    .map((d) => ({
      name: d.name,
      value: d.values[selectedIndex] ?? null,
    }))
    .filter((d) => d.name && d.name.trim() !== "")
    .filter((d) => typeof d.value === "number" && !isNaN(d.value))
    .sort((a, b) => b.value - a.value);

  const allSeries = series.map((d) => d.name);

  const paletteColors =
    ColorPalettes[state.colorPalette]?.colors || ColorPalettes.vibrant.colors;

  const colorMapping = {};
  allSeries.forEach((name, index) => {
    colorMapping[name] = paletteColors[index % paletteColors.length];
  });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerHeight(height);
      setContainerWidth(width);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!state || !containerWidth || !containerHieght) {
      return;
    }

    const svg = d3.select(ref.current);
    const width = containerWidth;
    const height = containerHieght;

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

    const barSpacing = Math.min(Math.max(state.barSpacing / 100, 0), 1);
    const barOpacity = Math.min(Math.max(state.opacity / 100, 0), 1);
    const font = state.font || "Arial, sans-serif";
    const textColor = state.textColor || "#000000";
    const titleSzie = state.titleSize || 40;
    const articleSize = state.articleSize || 16;

    const customColors = (state.customBarColors || "")
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
      .style("font-family", font);

    group
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .style("fill", textColor)
      .style("font-family", font);

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
              customColors[d.name] ||
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
              customColors[d.name] ||
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
        .attr("y", titleSzie)
        .style("fill", textColor)
        .style("font-size", `${titleSzie}px`)
        .style("font-family", font)
        .style("font-weight", "bold")
        .text(state.title);
    }

    if (state.article) {
      svg
        .append("foreignObject")
        .attr("class", "static-text")
        .attr("width", width - 40)
        .attr("height", 80)
        .attr("x", 20)
        .attr("y", titleSzie + 10)
        .append("xhtml:div")
        .style("color", textColor)
        .style("font-family", font)
        .style("font-size", `${articleSize}px`)
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
        .style("fill", textColor)
        .style("font-family", font)
        .style("font-size", "12px")
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
            const modifiedFilter = new Set(activeFilters);
            if (modifiedFilter.has(filterVal)) {
              modifiedFilter.delete(filterVal);
            } else {
              modifiedFilter.add(filterVal);
            }
            setActiveFilters(modifiedFilter);
          });

        g.append("rect")
          .attr("fill", isActive ? "#444" : "#ccc")
          .attr("width", 14)
          .attr("height", 14)
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5);

        g.append("text")
          .attr("x", 18)
          .attr("y", 12)
          .text(filterVal)
          .style("fill", textColor)
          .style("font-family", font)
          .style("font-size", "12px");
      });
    }
  }, [
    state,
    valueIndex,
    containerWidth,
    containerHieght,
    colorMapping,
    activeFilters,
  ]);

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
      ref={containerRef}
    >
      <svg ref={ref} width={containerWidth} height={containerHieght} />

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
