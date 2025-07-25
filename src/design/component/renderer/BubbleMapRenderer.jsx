import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import europeGeoData from "../ui/europegeo.json";
import africaGeoData from "../ui/africageo.json";
import asiaGeoData from "../ui/asiageo.json";
import northAmericaGeoData from "../ui/northamericageo.json";
import southAmericaGeoData from "../ui/southamericageo.json";
import ColorPalettes from "../ui/ColorPalettes";

const worstCaseColors = ["#B9EDDD", "#87CBB9", "#569DAA", "#577D86"];

const BubbleMapRenderer = ({ state }) => {
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHieght, setContainerHeight] = useState(400);

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
        setContainerHeight(height);
        setContainerWidth(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerWidth || !containerHieght) return;

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
      bubbleColor = "#3498db",
      bubbleOpacity = 0.7,
      maxBubbleRadius = 12,
      minBubbleRadius = 2,
    } = state;

    const titleMargin = title ? titleSize * 1.5 : 0;
    const articleMargin = article ? 80 : 0;
    const footerMargin = isFooter && footerText ? 40 : 0;

    const topOffset = 20 + titleMargin + articleMargin;
    const bottomOffset = footerMargin;

    const width = containerWidth;
    const height = containerHieght;

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

    g.selectAll("path")
      .data(customGeoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("class", "country")
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5)
      .on("click", handleZoom);

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
    const maxValue = valueExtent[1];

    const radiusScale = d3
      .scalePow()
      .exponent(0.3)
      .domain([0, maxValue])
      .range([minBubbleRadius, maxBubbleRadius]);

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

    const colors = ColorPalettes[paletteKey]?.colors || worstCaseColors;

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain(valueExtent);

    let tooltip = d3.select(containerRef.current).select(".tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select(containerRef.current)
        .append("div")
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("color", "#fff")
        .style("padding", "8px 10px")
        .style("background", "rgba(0,0,0,0.8)")
        .style("pointer-events", "none")
        .style("visibility", "hidden")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("z-index", "1000");
    }

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
      .attr("r", (d) => radiusScale(d.value))
      .attr("cy", (d) => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[1] : 0;
      })
      .attr("fill", (d) => {
        if (customColorOverrides[d.name]) {
          return customColorOverrides[d.name];
        }
        return state.barColor || bubbleColor || colorScale(d.value);
      })
      .attr("opacity", bubbleOpacity)
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
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

      bubbles
        .transition()
        .duration(750)
        .attr("r", (d) => radiusScale(d.value))
        .attr("stroke-width", 0.5);
    }

    const zoom = d3.zoom().on("zoom", (event) => {
      const { transform } = event;
      g.attr("transform", `translate(0, ${topOffset}) ${transform}`);

      bubbles
        .attr("r", (d) => radiusScale(d.value) / transform.k)
        .attr("stroke-width", 0.5 / transform.k);
    });

    svg.call(zoom);

    svg
      .append("rect")
      .attr("height", height)
      .attr("width", width)
      .attr("fill", "transparent")
      .attr("class", "background")
      .lower()
      .on("click", resetZoom);

    if (title) {
      svg
        .append("text")
        .style("fill", textColor)
        .attr("text-anchor", "start")
        .style("font-family", font)
        .style("font-size", `${titleSize}px`)
        .style("font-weight", "bold")
        .attr("x", 20)
        .attr("y", titleSize)
        .style("z-index", "1000")
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
        .style("z-index", "1000")
        .append("xhtml:div")
        .style("font-family", font)
        .style("font-size", `${articleSize}px`)
        .style("padding", "5px")
        .style("color", textColor)
        .style("text-align", "left")
        .style("line-height", `${articleSize * 1.4}px`)
        .style("border-radius", "3px")
        .html(article);
    }

    if (isFooter && footerText) {
      svg
        .append("text")
        .style("font-weight", "normal")
        .style("font-family", font)
        .style("font-size", "14px")
        .attr("text-anchor", "start")
        .style("fill", textColor)
        .attr("x", 20)
        .attr("y", height - 15)
        .style("z-index", "1000")
        .text(footerText);
    }
  }, [state, containerHieght, containerWidth, customGeoData]);

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
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Legend</div>
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
                opacity: state.bubbleOpacity || 0.7,
                backgroundColor:
                  state.barColor || state.bubbleColor || "#3498db",
                borderRadius: "50%",
                width: "8px",
                height: "8px",
              }}
            />
            <span>Min: {valueExtent[0]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                opacity: state.bubbleOpacity || 0.7,
                backgroundColor:
                  state.barColor || state.bubbleColor || "#3498db",
                width: "16px",
                height: "16px",

                borderRadius: "50%",
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
