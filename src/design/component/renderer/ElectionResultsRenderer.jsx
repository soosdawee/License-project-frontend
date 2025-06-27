import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, MenuItem, Select } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const ElectionResultsRenderer = ({ state }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const headers = state.data?.[0]?.slice(1) || []; // party names
  const allRows = state.data?.slice(1) || [];
  const allHistoricalRows = state.historical?.slice(1) || [];

  // Filter out rows with empty name or all zero/invalid party values
  const rows = allRows.filter((row) => {
    const hasValidName = row[0] && row[0].toString().trim() !== "";
    const hasValidValues = headers.some((_, i) => {
      const val = Number(row[i + 1]);
      return !isNaN(val) && val > 0;
    });
    return hasValidName && hasValidValues;
  });

  const [selectedRegion, setSelectedRegion] = useState(rows[0]?.[0] || "");
  const selectedRow = rows.find((row) => row[0] === selectedRegion);
  const selectedHistoricalRow = allHistoricalRows.find(
    (row) => row[0] === selectedRegion
  );

  const values = headers.map((header, i) => ({
    party: header,
    value: Number(selectedRow?.[i + 1]) || 0,
    historicalValue: Number(selectedHistoricalRow?.[i + 1]) || 0,
  }));

  const paletteColors =
    ColorPalettes[state.colorPalette]?.colors || ColorPalettes.vibrant.colors;

  const parseCustomColors = (input) => {
    const result = {};
    if (!input) return result;
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) {
        result[label] = color;
      }
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

  const customColorMap = parseCustomColors(state.customColors);
  const colorMap = headers.reduce((map, header, i) => {
    map[header] =
      customColorMap[header] || paletteColors[i % paletteColors.length];
    return map;
  }, {});

  const generateTooltipContent = (party, value, total) => {
    if (!state.showAnnotations) return "";
    if (state.customAnnotation && state.customAnnotation.trim() !== "") {
      let content = state.customAnnotation;
      content = content.replace(/\{name\}/g, party);
      content = content.replace(/\{region\}/g, selectedRegion);
      content = content.replace(
        /\{percentage\}/g,
        ((value / total) * 100).toFixed(1)
      );
      content = content.replace(/\{votes\}/g, value.toLocaleString());
      content = content.replace(/\{total\}/g, total.toLocaleString());

      headers.forEach((header, index) => {
        const columnValue = selectedRow?.[index + 1] || 0;
        content = content.replace(
          new RegExp(`\\{value${index + 1}\\}`, "g"),
          Number(columnValue).toLocaleString()
        );
        content = content.replace(
          new RegExp(`\\{${header}\\}`, "g"),
          Number(columnValue).toLocaleString()
        );
      });

      return content;
    }
    return `${party}<br/>${value.toLocaleString()} votes (${(
      (value / total) *
      100
    ).toFixed(1)}%)`;
  };

  const showTooltip = (party, value, total, event) => {
    if (!state.showAnnotations || !tooltipRef.current) return;
    const tooltip = tooltipRef.current;
    tooltip.innerHTML = generateTooltipContent(party, value, total);
    tooltip.style.display = "block";
    tooltip.style.opacity = "1";
    updateTooltipPosition(event);
  };

  const hideTooltip = () => {
    if (!tooltipRef.current) return;
    tooltipRef.current.style.display = "none";
    tooltipRef.current.style.opacity = "0";
  };

  const updateTooltipPosition = (event) => {
    if (!tooltipRef.current || !wrapperRef.current) return;
    const tooltip = tooltipRef.current;
    const wrapper = wrapperRef.current;
    const rect = wrapper.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const tooltipRect = tooltip.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    let left = x + 10;
    let top = y - 10;

    if (left + tooltipRect.width > wrapperRect.width) {
      left = x - tooltipRect.width - 10;
    }

    if (top < 0) {
      top = y + 20;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const createArrowPath = (direction) => {
    if (direction === "up") {
      return "M0,8 L4,0 L8,8 Z"; // Upward arrow
    } else {
      return "M0,0 L4,8 L8,0 Z"; // Downward arrow
    }
  };

  useEffect(() => {
    if (!state || !dimensions.width || !dimensions.height) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const fontFamily = state.font || "Arial, sans-serif";
    const titleFontSize = state.titleSize || 20;
    const articleFontSize = state.articleSize || 14;
    const textColor = state.textColor || "#000000";

    let topOffset = 0;
    if (state.title) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", titleFontSize)
        .style("font-size", `${titleFontSize}px`)
        .style("font-weight", "bold")
        .style("font-family", fontFamily)
        .style("fill", textColor)
        .text(state.title);
      topOffset += titleFontSize + 10;
    }

    if (state.article) {
      const articleHeight = articleFontSize * 2.5;
      svg
        .append("foreignObject")
        .attr("x", 10)
        .attr("y", topOffset)
        .attr("width", dimensions.width - 20)
        .attr("height", articleHeight)
        .append("xhtml:div")
        .style("font-size", `${articleFontSize}px`)
        .style("font-family", fontFamily)
        .style("color", textColor)
        .style("line-height", `${articleFontSize * 1.5}px`)
        .style("text-align", "left")
        .html(state.article);
      topOffset += articleHeight + 10;
    }

    const bottomOffset = state.isFooter ? articleFontSize * 3 + 10 : 0;
    const margin = {
      top: topOffset + 10,
      right: 30,
      bottom: bottomOffset + 10,
      left: 30,
    };

    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const total = d3.sum(values, (d) => d.value);
    const x = d3.scaleLinear().domain([0, total]).range([0, width]);

    let xOffset = 0;
    values.forEach((d, index) => {
      if (!d.value || d.value <= 0) return;

      const barWidth = x(d.value);
      const barGroup = g.append("g");
      const barColor = colorMap[d.party];
      const textColor = getContrastingTextColor(barColor);

      const bar = barGroup
        .append("rect")
        .attr("x", xOffset)
        .attr("y", height)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", barColor)
        .attr("opacity", 0.9)
        .style("cursor", state.showAnnotations ? "pointer" : "default")
        .transition()
        .duration(600)
        .ease(d3.easeBackOut.overshoot(1.2))
        .attr("y", 0)
        .attr("height", height);

      if (state.showAnnotations) {
        const hoverRect = barGroup
          .append("rect")
          .attr("x", xOffset)
          .attr("y", 0)
          .attr("width", barWidth)
          .attr("height", height)
          .attr("fill", "transparent")
          .style("cursor", "pointer");

        hoverRect
          .on("mouseenter", (event) => {
            showTooltip(d.party, d.value, total, event);
            const targetBar = d3.select(hoverRect.node().previousSibling);
            targetBar
              .attr("opacity", 1)
              .attr("stroke", "#333")
              .attr("stroke-width", 2);
          })
          .on("mousemove", (event) => updateTooltipPosition(event))
          .on("mouseleave", () => {
            hideTooltip();
            const targetBar = d3.select(hoverRect.node().previousSibling);
            targetBar
              .transition()
              .duration(200)
              .attr("opacity", 0.9)
              .attr("stroke", "none")
              .attr("stroke-width", 0);
          });
      }

      const labelY = height * 0.2 + 5;
      const lineSpacing = 14;

      barGroup
        .append("text")
        .attr("x", xOffset + barWidth / 2)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("fill", textColor)
        .style("font-size", "13px")
        .style("opacity", 0)
        .text(d.party)
        .transition()
        .duration(400)
        .delay(300)
        .style("opacity", 1);

      barGroup
        .append("text")
        .attr("x", xOffset + barWidth / 2)
        .attr("y", labelY + lineSpacing)
        .attr("text-anchor", "middle")
        .attr("fill", textColor)
        .style("font-size", "13px")
        .style("opacity", 0)
        .text(`${((d.value / total) * 100).toFixed(1)}%`)
        .transition()
        .duration(400)
        .delay(400)
        .style("opacity", 1);

      // Add trend arrow if historical data exists and is different
      if (d.historicalValue > 0 && d.historicalValue !== d.value) {
        const arrowDirection = d.historicalValue > d.value ? "down" : "up";
        const arrowColor = arrowDirection === "up" ? "#22c55e" : "#ef4444"; // Green for up, red for down

        barGroup
          .append("path")
          .attr("d", createArrowPath(arrowDirection))
          .attr(
            "transform",
            `translate(${xOffset + barWidth / 2 - 4}, ${
              labelY + lineSpacing * 2
            })`
          )
          .attr("fill", arrowColor)
          .style("opacity", 0)
          .transition()
          .duration(400)
          .delay(500)
          .style("opacity", 1);
      }

      xOffset += barWidth;
    });

    if (state.isFooter) {
      svg
        .append("foreignObject")
        .attr("x", 10)
        .attr("y", dimensions.height - bottomOffset + 10)
        .attr("width", dimensions.width - 20)
        .attr("height", articleFontSize * 3)
        .append("xhtml:div")
        .style("font-size", `${articleFontSize}px`)
        .style("font-family", fontFamily)
        .style("color", textColor)
        .style("line-height", `${articleFontSize * 1.5}px`)
        .style("text-align", "left")
        .html(state.footerText);
    }
  }, [state, dimensions, selectedRegion, customColorMap, colorMap]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={wrapperRef}
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: state.backgroundColor || "transparent",
      }}
    >
      <Select
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          backgroundColor: "white",
        }}
      >
        {rows.map((row, i) => (
          <MenuItem key={i} value={row[0]}>
            {row[0]}
          </MenuItem>
        ))}
      </Select>

      <svg ref={svgRef} width="100%" height="100%" />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          pointerEvents: "auto",
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "6px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          maxWidth: "250px",
          display: "none",
          zIndex: 100,
          opacity: 0,
          transition: "opacity 0.2s",
          lineHeight: 1.4,
          border: "1px solid #ccc",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        onMouseLeave={hideTooltip}
      />
    </Box>
  );
};

export default ElectionResultsRenderer;
