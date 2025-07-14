import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, MenuItem, Select } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const ElectionDonutRenderer = ({ state }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHieght, setContainerHeight] = useState(400);

  const columnHeaders = state.data?.[0]?.slice(1) || [];
  const data = state.data?.slice(1) || [];

  const rows = data.filter((row) => {
    const hasValidValues = columnHeaders.some((_, i) => {
      const val = Number(row[i + 1]);
      return !isNaN(val) && val > 0;
    });
    const areValuesValid = row[0]?.toString().trim() !== "" && row[0];
    return areValuesValid && hasValidValues;
  });

  const [selectedRegion, setSelectedRegion] = useState(rows[0]?.[0] || "");
  const [visibleEntities, setVisibleEntities] = useState(
    new Set(columnHeaders)
  );
  const selectedRow = rows.find((row) => row[0] === selectedRegion);

  const allPartiesWithData = columnHeaders.filter((header, i) => {
    const val = Number(selectedRow?.[i + 1]);
    return !isNaN(val) && val > 0;
  });

  const values = columnHeaders
    .map((header, i) => ({
      party: header,
      value: Number(selectedRow?.[i + 1]) || 0,
    }))
    .filter((d) => visibleEntities.has(d.party));

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
        console.log(label);
      }
    });

    console.log(result["Party 1"]);
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
    map[header] =
      colors[header?.replace(/\s+/g, "")] ||
      paletteColors[i % paletteColors.length];
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
      content = content.replace(/\{value\}/g, value.toLocaleString());

      return content;
    }
    return `${party}<br/>${value.toLocaleString()} votes (${(
      (value / total) *
      100
    ).toFixed(1)}%)`;
  };

  const showTooltip = (party, value, total, event) => {
    if (!state.showAnnotations || !tooltipRef.current) {
      return;
    }
    const tooltip = tooltipRef.current;
    tooltip.innerHTML = handleAnnotation(party, value, total);
    tooltip.style.display = "block";
    tooltip.style.opacity = "1";
    updateTooltipPosition(event);
  };

  const hideTooltip = () => {
    if (!tooltipRef.current) {
      return;
    }
    tooltipRef.current.style.opacity = "0";
    tooltipRef.current.style.display = "none";
  };

  const updateTooltipPosition = (event) => {
    if (!tooltipRef.current || !wrapperRef.current) {
      return;
    }
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

    const textColor = state.textColor || "#000000";
    const font = state.font || "Arial, sans-serif";
    const titleSize = state.titleSize || 20;
    const articleSzie = state.articleSize || 14;

    let topOffset = 0;
    if (state.title) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", titleSize)
        .style("fill", textColor)
        .style("font-size", `${titleSize}px`)
        .style("font-family", font)
        .style("font-weight", "bold")
        .text(state.title);
      topOffset += titleSize + 10;
    }

    //SZITU
    if (state.article) {
      const articleHeight = articleSzie * 2.5;
      svg
        .append("foreignObject")
        .attr("x", 10)
        .attr("y", topOffset)
        .attr("width", containerWidth - 20)
        .attr("height", articleHeight)
        .append("xhtml:div")
        .style("color", textColor)
        .style("font-family", font)
        .style("line-height", `${articleSzie * 1.5}px`)
        .style("font-size", `${articleSzie}px`)
        .style("text-align", "left")
        .html(state.article);
      topOffset += articleHeight + 10;
    }

    const bottomOffset = state.isFooter ? articleSzie * 2 : 0;
    const margin = {
      top: topOffset + 20,
      right: 30,
      bottom: bottomOffset + 20,
      left: 30,
    };

    const width = containerWidth - margin.left - margin.right;
    const height = containerHieght - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const centerX = width / 2;
    const centerY = height;
    const radius = Math.min(width / 2, height - 40);
    const innerRadius = radius * 0.4;

    const total = d3.sum(values, (d) => d.value);
    const filteredValues = values.filter((d) => d.value > 0);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .sort(null);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const arcHover = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius + 5);

    const arcs = g
      .selectAll(".arc")
      .data(pie(filteredValues))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    const paths = arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorMap[d.data.party])
      .attr("opacity", 0.9)
      .style("cursor", state.showAnnotations ? "pointer" : "default")
      .attr("stroke-width", 2)
      .attr("stroke", "#fff");

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

    arcs.each(function (d) {
      const arcGroup = d3.select(this);
      const [labelX, labelY] = arc.centroid(d);
      const segmentColor = colorMap[d.data.party];
      const lableColour = findContrast(segmentColor);

      const segmentAngle = d.endAngle - d.startAngle;
      if (segmentAngle > 0.1) {
        arcGroup
          .append("text")
          .style("opacity", 0)
          .attr("transform", `translate(${labelX}, ${labelY - 7})`)
          .attr("text-anchor", "middle")
          .attr("fill", lableColour)
          .style("font-weight", "bold")
          .style("font-size", "12px")
          .text(d.data.party)
          .transition()
          .duration(400)
          .delay(600)
          .style("opacity", 1);

        arcGroup
          .append("text")
          .style("opacity", 0)
          .attr("text-anchor", "middle")
          .attr("transform", `translate(${labelX}, ${labelY + 7})`)
          .attr("fill", lableColour)
          .style("font-size", "11px")
          .text(`${((d.data.value / total) * 100).toFixed(1)}%`)
          .transition()
          .duration(400)
          .delay(700)
          .style("opacity", 1);
      }
    });

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
        .attr("transform", (d, i) => `translate(${i * 83}, 0)`)
        .style("cursor", "pointer");

      legendItems
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d) => colorMap[d])
        .attr("opacity", (d) => (visibleEntities.has(d) ? 0.9 : 0.3))
        .attr("stroke", (d) => (visibleEntities.has(d) ? "none" : "#666"))
        .attr("stroke-width", 1);

      legendItems
        .append("text")
        .attr("x", 15)
        .attr("y", 6)
        .attr("dy", "0.35em")
        .style("font-family", font)
        .style("font-size", "12px")
        .style("fill", (d) => (visibleEntities.has(d) ? textColor : "#999"))
        .style("font-weight", (d) =>
          visibleEntities.has(d) ? "normal" : "lighter"
        )
        .text((d) => {
          const partyValue = selectedRow?.[columnHeaders.indexOf(d) + 1] || 0;
          return `${d} (${Number(partyValue).toLocaleString()})`;
        });

      legendItems.on("click", function (event, d) {
        const newVisibleParties = new Set(visibleEntities);
        if (newVisibleParties.has(d)) {
          newVisibleParties.delete(d);
        } else {
          newVisibleParties.add(d);
        }
        setVisibleEntities(newVisibleParties);
      });
    }

    if (state.isFooter) {
      svg
        .append("foreignObject")
        .attr("x", 10)
        .attr("y", containerHieght - bottomOffset + 10)
        .attr("width", containerWidth - 20)
        .attr("height", articleSzie * 3)
        .append("xhtml:div")
        .style("font-family", font)
        .style("font-size", `${articleSzie - 3}px`)
        .style("line-height", `${articleSzie * 1.5}px`)
        .style("color", textColor)
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
    visibleEntities,
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

export default ElectionDonutRenderer;
