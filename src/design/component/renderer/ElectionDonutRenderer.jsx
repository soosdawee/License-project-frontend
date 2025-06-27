import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, MenuItem, Select } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const ElectionDonutRenderer = ({ state }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const headers = state.data?.[0]?.slice(1) || [];
  const allRows = state.data?.slice(1) || [];

  const rows = allRows.filter((row) => {
    const hasValidName = row[0] && row[0].toString().trim() !== "";
    const hasValidValues = headers.some((_, i) => {
      const val = Number(row[i + 1]);
      return !isNaN(val) && val > 0;
    });
    return hasValidName && hasValidValues;
  });

  const [selectedRegion, setSelectedRegion] = useState(rows[0]?.[0] || "");
  const [visibleParties, setVisibleParties] = useState(new Set(headers));
  const selectedRow = rows.find((row) => row[0] === selectedRegion);

  const allPartiesWithData = headers.filter((header, i) => {
    const val = Number(selectedRow?.[i + 1]);
    return !isNaN(val) && val > 0;
  });

  const values = headers
    .map((header, i) => ({
      party: header,
      value: Number(selectedRow?.[i + 1]) || 0,
    }))
    .filter((d) => visibleParties.has(d.party));

  const paletteColors =
    ColorPalettes[state.colorPalette]?.colors || ColorPalettes.vibrant.colors;

  const parseCustomColors = (input) => {
    const result = {};
    if (!input) return result;
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) {
        result[label] = color;
        console.log(label);
      }
    });

    console.log(result["Party 1"]);
    return result;
  };

  const getContrastingTextColor = (hexColor) => {
    hexColor = hexColor?.replace("#", "");
    if (hexColor?.length === 3) {
      hexColor = hexColor
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(hexColor?.substr(0, 2), 16) / 255;
    const g = parseInt(hexColor?.substr(2, 2), 16) / 255;
    const b = parseInt(hexColor?.substr(4, 2), 16) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const customColorMap = parseCustomColors(state.customColors);
  const colorMap = headers.reduce((map, header, i) => {
    map[header] =
      customColorMap[header?.replace(/\s+/g, "")] ||
      paletteColors[i % paletteColors.length];
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
      content = content.replace(/\{value\}/g, value.toLocaleString());

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
      top: topOffset + 20,
      right: 30,
      bottom: bottomOffset + 20,
      left: 30,
    };

    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate donut dimensions - half circle centered and maximized
    const centerX = width / 2; // Center horizontally
    const centerY = height; // Position near bottom to maximize semicircle size
    const radius = Math.min(width / 2, height - 40); // Maximum radius that fits
    const innerRadius = radius * 0.4;

    const total = d3.sum(values, (d) => d.value);
    const filteredValues = values.filter((d) => d.value > 0);

    // Create pie generator for half donut (semicircle) centered and maximized
    const pie = d3
      .pie()
      .value((d) => d.value)
      .startAngle(-Math.PI / 2) // Start at top (-90 degrees)
      .endAngle(Math.PI / 2) // End at bottom (90 degrees) - half circle
      .sort(null);

    // Create arc generator
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const arcHover = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius + 5);

    // Create the donut segments
    const arcs = g
      .selectAll(".arc")
      .data(pie(filteredValues))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Add the segments
    const paths = arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorMap[d.data.party])
      .attr("opacity", 0.9)
      .style("cursor", state.showAnnotations ? "pointer" : "default")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add animations
    paths
      .transition()
      .duration(800)
      .ease(d3.easeBackOut.overshoot(1.1))
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(
          { startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 },
          d
        );
        return function (t) {
          return arc(interpolate(t));
        };
      });

    // Add labels
    arcs.each(function (d) {
      const arcGroup = d3.select(this);
      const [labelX, labelY] = arc.centroid(d);
      const segmentColor = colorMap[d.data.party];
      const labelColor = getContrastingTextColor(segmentColor);

      // Only add labels if segment is large enough
      const segmentAngle = d.endAngle - d.startAngle;
      if (segmentAngle > 0.1) {
        // Minimum angle threshold

        // Party name
        arcGroup
          .append("text")
          .attr("transform", `translate(${labelX}, ${labelY - 7})`)
          .attr("text-anchor", "middle")
          .attr("fill", labelColor)
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .style("opacity", 0)
          .text(d.data.party)
          .transition()
          .duration(400)
          .delay(600)
          .style("opacity", 1);

        // Percentage
        arcGroup
          .append("text")
          .attr("transform", `translate(${labelX}, ${labelY + 7})`)
          .attr("text-anchor", "middle")
          .attr("fill", labelColor)
          .style("font-size", "11px")
          .style("opacity", 0)
          .text(`${((d.data.value / total) * 100).toFixed(1)}%`)
          .transition()
          .duration(400)
          .delay(700)
          .style("opacity", 1);
      }
    });

    // Add hover effects and tooltips
    if (state.showAnnotations) {
      arcs
        .on("mouseenter", function (event, d) {
          d3.select(this)
            .select("path")
            .transition()
            .duration(200)
            .attr("d", arcHover)
            .attr("opacity", 1);

          showTooltip(d.data.party, d.data.value, total, event);
        })
        .on("mousemove", function (event) {
          updateTooltipPosition(event);
        })
        .on("mouseleave", function (event, d) {
          d3.select(this)
            .select("path")
            .transition()
            .duration(200)
            .attr("d", arc)
            .attr("opacity", 0.9);

          hideTooltip();
        });
    }

    // Add interactive legend for filtering parties (only if showLegend is enabled)
    if (state.showLegend) {
      const legend = g
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(0, -10)`);

      const legendItems = legend
        .selectAll(".legend-item")
        .data(allPartiesWithData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * 100}, 0)`)
        .style("cursor", "pointer");

      legendItems
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d) => colorMap[d])
        .attr("opacity", (d) => (visibleParties.has(d) ? 0.9 : 0.3))
        .attr("stroke", (d) => (visibleParties.has(d) ? "none" : "#666"))
        .attr("stroke-width", 1);

      legendItems
        .append("text")
        .attr("x", 20)
        .attr("y", 6)
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .style("font-family", fontFamily)
        .style("fill", (d) => (visibleParties.has(d) ? textColor : "#999"))
        .style("font-weight", (d) =>
          visibleParties.has(d) ? "normal" : "lighter"
        )
        .text((d) => {
          const partyValue = selectedRow?.[headers.indexOf(d) + 1] || 0;
          return `${d} (${Number(partyValue).toLocaleString()})`;
        });

      // Add click handlers for legend items
      legendItems.on("click", function (event, d) {
        const newVisibleParties = new Set(visibleParties);
        if (newVisibleParties.has(d)) {
          newVisibleParties.delete(d);
        } else {
          newVisibleParties.add(d);
        }
        setVisibleParties(newVisibleParties);
      });
    }

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
  }, [
    state,
    dimensions,
    selectedRegion,
    customColorMap,
    colorMap,
    visibleParties,
  ]);

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

export default ElectionDonutRenderer;
