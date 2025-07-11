import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, MenuItem, Select } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const ElectionResultsRenderer = ({ state }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHieght, setContainerHeight] = useState(400);

  const columnHeaders = state.data?.[0]?.slice(1) || [];
  const content = state.data?.slice(1) || [];
  const allHistoricalRows = state.historical?.slice(1) || [];

  const rows = content.filter((row) => {
    const areValuesValid = columnHeaders.some((_, i) => {
      const val = Number(row[i + 1]);
      return !isNaN(val) && val > 0;
    });
    const isNameValid = row[0] && row[0].toString().trim() !== "";
    return isNameValid && areValuesValid;
  });

  const [selectedRegion, setSelectedRegion] = useState(rows[0]?.[0] || "");
  const selectedRow = rows.find((row) => row[0] === selectedRegion);
  const selectedHistoricalRow = allHistoricalRows.find(
    (row) => row[0] === selectedRegion
  );

  const values = columnHeaders.map((header, i) => ({
    party: header,
    value: Number(selectedRow?.[i + 1]) || 0,
    historicalValue: Number(selectedHistoricalRow?.[i + 1]) || 0,
  }));

  const paletteColors =
    ColorPalettes[state.colorPalette]?.colors || ColorPalettes.vibrant.colors;

  const customColorOverrides = (input) => {
    if (!input) {
      return {};
    }

    const result = {};

    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) {
        result[label] = color;
      }
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

  const colors = customColorOverrides(state.customColors);
  const colorMap = columnHeaders.reduce((map, header, i) => {
    map[header] = colors[header] || paletteColors[i % paletteColors.length];
    return map;
  }, {});

  const handleAnnotation = (party, value, total) => {
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

      columnHeaders.forEach((header, index) => {
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
    tooltip.innerHTML = handleAnnotation(party, value, total);
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
      return "M0,8 L4,0 L8,8 Z";
    } else {
      return "M0,0 L4,8 L8,0 Z";
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerHeight(height);
      setContainerWidth(width);
    });
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!state || !containerWidth || !containerHieght) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const font = state.font || "Arial, sans-serif";
    const textColor = state.textColor || "#000000";
    const titleSzie = state.titleSize || 20;
    const articelSize = state.articleSize || 14;

    let topOffset = 0;
    if (state.title) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", titleSzie)
        .style("font-size", `${titleSzie}px`)
        .style("fill", textColor)
        .style("font-family", font)
        .style("font-weight", "bold")
        .text(state.title);
      topOffset += titleSzie + 10;
    }

    if (state.article) {
      const articleHeight = articelSize * 2.5;
      svg
        .append("foreignObject")
        .attr("x", 10)
        .attr("y", topOffset)
        .attr("width", containerWidth - 20)
        .attr("height", articleHeight)
        .append("xhtml:div")
        .style("color", textColor)
        .style("line-height", `${articelSize * 1.5}px`)
        .style("font-family", font)
        .style("font-size", `${articelSize}px`)
        .style("text-align", "left")
        .html(state.article);
      topOffset += articleHeight + 10;
    }

    const bottomOffset = state.isFooter ? articelSize * 2 + 5 : 0;
    const margin = {
      top: topOffset + 10,
      right: 30,
      bottom: bottomOffset + 10,
      left: 30,
    };

    const width = containerWidth - margin.left - margin.right;
    const height = containerHieght - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const total = d3.sum(values, (d) => d.value);
    const x = d3.scaleLinear().domain([0, total]).range([0, width]);

    let xOffset = 0;
    values.forEach((d, index) => {
      if (!d.value || d.value <= 0) return;

      const rectangleWidth = x(d.value);
      const rectangleGroup = g.append("g");
      const regtangleColor = colorMap[d.party];
      const textColor = findContrast(regtangleColor);

      const bar = rectangleGroup
        .append("rect")
        .attr("x", xOffset)
        .attr("y", height)
        .attr("width", rectangleWidth)
        .attr("height", 0)
        .attr("fill", regtangleColor)
        .attr("opacity", 0.9)
        .style("cursor", state.showAnnotations ? "pointer" : "default")
        .transition()
        .duration(600)
        .ease(d3.easeBackOut.overshoot(1.2))
        .attr("y", 0)
        .attr("height", height);

      if (state.showAnnotations) {
        const hoverRect = rectangleGroup
          .append("rect")
          .attr("x", xOffset)
          .attr("y", 0)
          .attr("fill", "transparent")
          .attr("width", rectangleWidth)
          .attr("height", height)
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

      rectangleGroup
        .append("text")
        .attr("fill", textColor)
        .attr("x", xOffset + rectangleWidth / 2)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("opacity", 0)
        .text(d.party)
        .transition()
        .duration(400)
        .delay(300)
        .style("opacity", 1);

      rectangleGroup
        .append("text")
        .attr("fill", textColor)
        .attr("x", xOffset + rectangleWidth / 2)
        .attr("y", labelY + lineSpacing)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("opacity", 0)
        .text(`${((d.value / total) * 100).toFixed(1)}%`)
        .transition()
        .duration(400)
        .delay(400)
        .style("opacity", 1);

      if (d.historicalValue > 0 && d.historicalValue !== d.value) {
        const arrowDirection = d.historicalValue > d.value ? "down" : "up";
        const arrowColor = arrowDirection === "up" ? "#22c55e" : "#ef4444";

        rectangleGroup
          .append("path")
          .attr("d", createArrowPath(arrowDirection))
          .attr(
            "transform",
            `translate(${xOffset + rectangleWidth / 2 - 4}, ${
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

      xOffset += rectangleWidth;
    });

    if (state.isFooter) {
      svg
        .append("foreignObject")
        .attr("x", 10)
        .attr("y", containerHieght - bottomOffset + 10)
        .attr("width", containerWidth - 20)
        .attr("height", articelSize * 3)
        .append("xhtml:div")
        .style("color", textColor)
        .style("font-size", `${articelSize}px`)
        .style("font-family", font)
        .style("line-height", `${articelSize * 1.5}px`)
        .style("text-align", "left")
        .html(state.footerText);
    }
  }, [
    state,
    containerHieght,
    containerWidth,
    selectedRegion,
    colors,
    colorMap,
  ]);

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
