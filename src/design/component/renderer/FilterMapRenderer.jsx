import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import europeGeoData from "../ui/europegeo.json";
import africaGeoData from "../ui/africageo.json";
import asiaGeoData from "../ui/asiageo.json";
import northAmericaGeoData from "../ui/northamericageo.json";
import southAmericaGeoData from "../ui/southamericageo.json";
import ColorPalettes from "../ui/ColorPalettes";

const fallbackColorScale = ["#B9EDDD", "#87CBB9", "#569DAA", "#577D86"];

const FilterMapRenderer = ({ state }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeFilters, setActiveFilters] = useState(new Set());

  const getGeoData = () => {
    if (state.vizType === "ASIA_FILTER" || state.visualizationModelId === 40) {
      return asiaGeoData;
    } else if (
      state.vizType === "NORTH_AMERICA_FILTER" ||
      state.visualizationModelId === 41
    ) {
      return northAmericaGeoData;
    } else if (
      state.vizType === "SOUTH_AMERICA_FILTER" ||
      state.visualizationModelId === 42
    ) {
      return southAmericaGeoData;
    } else if (
      state.vizType === "AFRICA_FILTER" ||
      state.visualizationModelId === 43
    ) {
      return africaGeoData;
    }
    return europeGeoData;
  };

  const customGeoData = getGeoData();

  console.log(state);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!state.data) return;
    const allFilters = new Set(
      state.data.map((row) => row[1]).filter((val) => val && val.trim() !== "")
    );
    setActiveFilters(allFilters);
  }, [state.data]);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const {
      title = "",
      article = "",
      textColor = "#000000",
      font = "Arial",
      titleSize = 40,
      articleSize = 16,
      backgroundColor = "transparent",
      isFooter = false,
      footerText = "",
      colorPalette: paletteKey,
      showAnnotations = false,
      customAnnotation = "",
      customColors = "", // Added customColors parameter
    } = state;

    const titleMargin = title ? titleSize * 1.5 : 0;
    const articleMargin = article ? 80 : 0;
    // Increase footer margin to ensure better visibility
    const footerMargin = isFooter && footerText ? 40 : 0;

    const topOffset = 20 + titleMargin + articleMargin;
    const bottomOffset = footerMargin;

    const width = dimensions.width;
    const height = dimensions.height;

    const svg = d3.select(containerRef.current).select("svg");
    svg.selectAll("*").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("class", "center-container");

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr(
        "fill",
        backgroundColor === "transparent" ? "none" : backgroundColor
      )
      .lower();

    if (title) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", titleSize)
        .attr("text-anchor", "start")
        .style("font-size", `${titleSize}px`)
        .style("font-weight", "bold")
        .style("font-family", font)
        .style("fill", textColor)
        .text(title);
    }

    if (article) {
      const articleY = title ? titleSize + 10 : 10;
      svg
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", articleY)
        .attr("width", width - 40)
        .attr("height", articleMargin)
        .append("xhtml:div")
        .style("font-size", `${articleSize}px`)
        .style("font-family", font)
        .style("color", textColor)
        .style("line-height", `${articleSize * 1.4}px`)
        .style("text-align", "left")
        .html(article);
    }

    const mapHeight = height - topOffset - bottomOffset;

    const g = svg.append("g").attr("transform", `translate(0, ${topOffset})`);

    const projection = d3
      .geoMercator()
      .fitSize([width, mapHeight], customGeoData);
    const pathGenerator = d3.geoPath().projection(projection);
    let active = d3.select(null);

    const data = state?.data || [];

    const countryToInfo = new Map(
      data.map((row) => [row[0], { filter: row[1], note: row[2] }])
    );

    const uniqueFilters = Array.from(
      new Set(
        data.map((row) => row[1]).filter((val) => val && val.trim() !== "")
      )
    );

    const colors =
      ColorPalettes[paletteKey]?.colors &&
      ColorPalettes[paletteKey].colors.length >= uniqueFilters.length
        ? ColorPalettes[paletteKey].colors
        : fallbackColorScale;

    const filterToColor = new Map();
    uniqueFilters.forEach((filter, i) => {
      filterToColor.set(filter, colors[i % colors.length]);
    });

    // Parse custom colors using the same format as donut chart
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

    const customColorOverrides = parseCustomColors(customColors);

    // Apply custom color overrides to the filterToColor map
    Object.entries(customColorOverrides).forEach(([filter, color]) => {
      if (uniqueFilters.includes(filter)) {
        filterToColor.set(filter, color);
      }
    });

    const filteredFeatures = customGeoData.features.filter((feature) => {
      const info = countryToInfo.get(feature.properties.name);
      return info && activeFilters.has(info.filter);
    });

    let tooltip = d3.select(containerRef.current).select(".tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select(containerRef.current)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "6px 8px")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("visibility", "hidden")
        .style("z-index", "1000"); // Ensure tooltip appears above other elements
    }

    g.selectAll("path")
      .data(filteredFeatures)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("class", "country")
      .attr("fill", (d) => {
        const info = countryToInfo.get(d.properties.name);
        return info ? filterToColor.get(info.filter) || "#ccc" : "#ccc";
      })
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .on("click", handleZoom)
      .on("mousemove", (event, d) => {
        if (!showAnnotations) return;
        const name = d.properties.name;
        const info = countryToInfo.get(name);
        if (!info) return;

        let annotationText = `Name: ${name}<br/>Filter: ${info.filter}`;
        if (customAnnotation) {
          annotationText = customAnnotation
            .replace(/{name}/g, name)
            .replace(/{filter}/g, info.filter)
            .replace(/{note}/g, info.note || "");
        }

        const containerRect = containerRef.current.getBoundingClientRect();

        tooltip
          .html(annotationText)
          .style("visibility", "visible")
          .style("top", `${event.clientY - containerRect.top + 15}px`)
          .style("left", `${event.clientX - containerRect.left + 15}px`);
      })
      .on("mouseleave", () => {
        tooltip.style("visibility", "hidden");
      });

    function handleZoom(event, feature) {
      active.classed("active", false);
      active = d3.select(event.currentTarget).classed("active", true);

      const bounds = pathGenerator.bounds(feature);
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const scale = 0.9 / Math.max(dx / width, dy / mapHeight);
      const translate = [
        width / 2 - scale * x,
        mapHeight / 2 - scale * y + topOffset,
      ];

      g.transition()
        .duration(750)
        .attr("transform", `translate(${translate})scale(${scale})`)
        .style("stroke-width", `${1.5 / scale}px`);
    }

    function resetZoom() {
      active.classed("active", false);
      active = d3.select(null);
      g.transition()
        .duration(750)
        .attr("transform", `translate(0, ${topOffset})`)
        .style("stroke-width", "1.5px");
    }

    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", `translate(0, ${topOffset}) ${event.transform}`);
    });

    svg.call(zoom);

    svg
      .append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .lower()
      .on("click", resetZoom);

    // Fixed footer positioning and styling
    if (isFooter && footerText) {
      svg
        .append("text")
        .attr("x", 20) // Consistent left margin with title
        .attr("y", height - 15) // Better positioning from bottom
        .attr("text-anchor", "start")
        .style("font-size", "14px") // Slightly larger font for better visibility
        .style("font-family", font)
        .style("fill", textColor)
        .style("font-weight", "normal")
        .text(footerText);
    }
  }, [state, dimensions, activeFilters, customGeoData]);

  function toggleFilter(filter) {
    setActiveFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filter)) {
        newSet.delete(filter);
      } else {
        newSet.add(filter);
      }
      return newSet;
    });
  }

  const data = state?.data || [];
  const uniqueFilters = Array.from(
    new Set(data.map((row) => row[1]).filter((val) => val && val.trim() !== ""))
  );
  const colors =
    ColorPalettes[state.colorPalette]?.colors &&
    ColorPalettes[state.colorPalette].colors.length >= uniqueFilters.length
      ? ColorPalettes[state.colorPalette].colors
      : fallbackColorScale;

  // Apply custom color overrides for legend display
  const legendColors = [...colors];
  if (state.customColors && state.customColors.trim() !== "") {
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

    const overrides = parseCustomColors(state.customColors);
    uniqueFilters.forEach((filter, i) => {
      if (overrides[filter]) {
        legendColors[i] = overrides[filter];
      }
    });
  }

  return (
    <div
      ref={containerRef}
      className="viz"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg />
      {state.showLegend && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255, 255, 255, 0.9)", // Slightly more opaque
            padding: "8px 12px", // Increased padding
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)", // Better shadow
            fontFamily: state.font || "Arial",
            fontSize: 14,
            color: state.textColor || "#000",
            userSelect: "none",
            width: "40%",
            display: "flex",
            alignItems: "center",
            zIndex: 100, // Ensure legend appears above map
          }}
        >
          <div
            style={{
              marginTop: 6,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {uniqueFilters.map((filter, i) => (
              <div
                key={filter}
                onClick={() => toggleFilter(filter)}
                style={{
                  cursor: "pointer",
                  padding: "6px 10px", // Increased padding for better click area
                  borderRadius: 4,
                  backgroundColor: activeFilters.has(filter)
                    ? legendColors[i % legendColors.length]
                    : "#ddd",
                  color: activeFilters.has(filter) ? "#fff" : "#888",
                  border: activeFilters.has(filter) ? "none" : "1px solid #aaa",
                  userSelect: "none",
                  transition: "all 0.2s ease", // Smooth transition
                }}
                title={`Toggle filter: ${filter}`}
              >
                {filter}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMapRenderer;
