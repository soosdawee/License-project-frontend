import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import europeGeoData from "../ui/europegeo.json";
import africaGeoData from "../ui/africageo.json";
import asiaGeoData from "../ui/asiageo.json";
import northAmericaGeoData from "../ui/northamericageo.json";
import southAmericaGeoData from "../ui/southamericageo.json";
import ColorPalettes from "../ui/ColorPalettes";

const fallbackColorScale = ["#B9EDDD", "#87CBB9", "#569DAA", "#577D86"];

const BubbleMapRenderer = ({ state }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const getGeoData = () => {
    if (state.vizType === "ASIA_BUBBLE" || state.visualizationModelId === 45) {
      return asiaGeoData;
    } else if (
      state.vizType === "NORTH_AMERICA_BUBBLE" ||
      state.visualizationModelId === 46
    ) {
      return northAmericaGeoData;
    } else if (
      state.vizType === "SOUTH_AMERICA_BUBBLE" ||
      state.visualizationModelId === 47
    ) {
      return southAmericaGeoData;
    } else if (
      state.vizType === "AFRICA_BUBBLE" ||
      state.visualizationModelId === 48
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
      customColors = "",
      bubbleColor = "#3498db", // Default bubble color
      barColor = "#3498db", // Default bar color (used for bubble coloring)
      bubbleOpacity = 0.7,
      maxBubbleRadius = 12, // Reduced maximum bubble radius
      minBubbleRadius = 2, // Reduced minimum bubble radius
    } = state;

    const titleMargin = title ? titleSize * 1.5 : 0;
    const articleMargin = article ? 80 : 0;
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

    const mapHeight = height - topOffset - bottomOffset;

    const g = svg.append("g").attr("transform", `translate(0, ${topOffset})`);

    const projection = d3
      .geoMercator()
      .fitSize([width, mapHeight], customGeoData);
    const pathGenerator = d3.geoPath().projection(projection);
    let active = d3.select(null);

    // Render the base map (all countries)
    g.selectAll("path")
      .data(customGeoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("class", "country")
      .attr("fill", "#f0f0f0") // Light gray for all countries
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5)
      .on("click", handleZoom);

    const data = state?.data || [];

    // Parse the bubble data (name, value, latitude, longitude, note)
    const bubbleData = data
      .map((row) => ({
        name: row[0],
        value: parseFloat(row[1]) || 0,
        latitude: parseFloat(row[2]) || 0,
        longitude: parseFloat(row[3]) || 0,
        note: row[4] || "",
      }))
      .filter((d) => d.value > 0 && d.latitude && d.longitude);

    // Create size scale for bubbles with more compressed range for uniformity
    const valueExtent = d3.extent(bubbleData, (d) => d.value);
    const maxValue = valueExtent[1];

    // Use a more compressed scale that makes all bubbles more similar in size
    const radiusScale = d3
      .scalePow()
      .exponent(0.3) // Lower exponent makes sizes more uniform
      .domain([0, maxValue]) // Always use 0 to max for consistent relative sizing
      .range([minBubbleRadius, maxBubbleRadius]);

    // Parse custom colors
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

    // Get default color palette
    const colors = ColorPalettes[paletteKey]?.colors || fallbackColorScale;

    // Create color scale based on values
    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain(valueExtent);

    // Create tooltip
    let tooltip = d3.select(containerRef.current).select(".tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select(containerRef.current)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "8px 10px")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("visibility", "hidden")
        .style("z-index", "1000");
    }

    // Add bubbles
    const bubbles = g
      .selectAll(".bubble")
      .data(bubbleData)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", (d) => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[0] : 0;
      })
      .attr("cy", (d) => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[1] : 0;
      })
      .attr("r", (d) => radiusScale(d.value))
      .attr("fill", (d) => {
        // Check if there's a custom color for this specific bubble
        if (customColorOverrides[d.name]) {
          return customColorOverrides[d.name];
        }
        // Use barColor if available, otherwise use bubbleColor or color scale
        return state.barColor || bubbleColor || colorScale(d.value);
      })
      .attr("opacity", bubbleOpacity)
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5) // Thinner stroke for smaller bubbles
      .style("cursor", "pointer")
      .on("mousemove", (event, d) => {
        if (!showAnnotations) return;

        let annotationText = `Name: ${d.name}<br/>Value: ${d.value}<br/>Location: ${d.latitude}, ${d.longitude}`;
        if (d.note) {
          annotationText += `<br/>Note: ${d.note}`;
        }

        if (customAnnotation) {
          annotationText = customAnnotation
            .replace(/{name}/g, d.name)
            .replace(/{value}/g, d.value)
            .replace(/{latitude}/g, d.latitude)
            .replace(/{longitude}/g, d.longitude)
            .replace(/{note}/g, d.note || "");
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
        .style("stroke-width", `${0.5 / scale}px`);

      // Scale bubbles inversely to maintain visual consistency
      bubbles
        .transition()
        .duration(750)
        .attr("r", (d) => radiusScale(d.value) / scale)
        .attr("stroke-width", 0.5 / scale);
    }

    function resetZoom() {
      active.classed("active", false);
      active = d3.select(null);
      g.transition()
        .duration(750)
        .attr("transform", `translate(0, ${topOffset})`)
        .style("stroke-width", "0.5px");

      // Reset bubble sizes
      bubbles
        .transition()
        .duration(750)
        .attr("r", (d) => radiusScale(d.value))
        .attr("stroke-width", 0.5);
    }

    const zoom = d3.zoom().on("zoom", (event) => {
      const { transform } = event;
      g.attr("transform", `translate(0, ${topOffset}) ${transform}`);

      // Adjust bubble sizes and stroke width based on zoom
      bubbles
        .attr("r", (d) => radiusScale(d.value) / transform.k)
        .attr("stroke-width", 0.5 / transform.k);
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

    // Add title, article, and footer AFTER bubbles to ensure they're on top
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
        .style("z-index", "1000") // Ensure it's on top
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
        .style("z-index", "1000") // Ensure it's on top
        .append("xhtml:div")
        .style("font-size", `${articleSize}px`)
        .style("font-family", font)
        .style("color", textColor)
        .style("line-height", `${articleSize * 1.4}px`)
        .style("text-align", "left")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .html(article);
    }

    // Add footer
    if (isFooter && footerText) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", height - 15)
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-family", font)
        .style("fill", textColor)
        .style("font-weight", "normal")
        .style("z-index", "1000") // Ensure it's on top
        .text(footerText);
    }
  }, [state, dimensions, customGeoData]);

  const data = state?.data || [];
  const bubbleData = data
    .map((row) => ({
      name: row[0],
      value: parseFloat(row[1]) || 0,
      latitude: parseFloat(row[2]) || 0,
      longitude: parseFloat(row[3]) || 0,
      note: row[4] || "",
    }))
    .filter((d) => d.value > 0 && d.latitude && d.longitude);

  const valueExtent = d3.extent(bubbleData, (d) => d.value);

  return (
    <div
      ref={containerRef}
      className="viz"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg />
      {state.showLegend && bubbleData.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px 15px",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontFamily: state.font || "Arial",
            fontSize: 12,
            color: state.textColor || "#000",
            userSelect: "none",
            zIndex: 100,
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Bubble Size Legend
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor:
                  state.barColor || state.bubbleColor || "#3498db",
                borderRadius: "50%",
                opacity: state.bubbleOpacity || 0.7,
              }}
            />
            <span>Min: {valueExtent[0]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor:
                  state.barColor || state.bubbleColor || "#3498db",
                borderRadius: "50%",
                opacity: state.bubbleOpacity || 0.7,
              }}
            />
            <span>Max: {valueExtent[1]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleMapRenderer;
