import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";

const BarChartRenderer = ({ state }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHieght, setContainerHeight] = useState(400);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerWidth(width);
        setContainerHeight(height);
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAnnotation = (template, d) =>
    template
      .replace(/{name}/g, d.name)
      .replace(/{value}/g, d.value)
      .replace(/{note}/g, d.note || "");

  const customColorOverrides = (input) => {
    const result = {};
    if (!input) return result;
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) result[label] = color;
    });
    return result;
  };

  useEffect(() => {
    const width = Math.max(containerWidth, 300);
    const height = Math.max(containerHieght, 200);

    if (!state.data || state.data.length === 0 || width === 0 || height === 0) {
      return;
    }

    const textColor = state.textColor || "#000000";
    const font = state.font || "Arial, sans-serif";
    const titleSize = state.titleSize || 40;
    const articleSize = state.articleSize || 16;

    const formattedData = state.data
      .filter((row) => row[0] !== "" && row[0] !== null && !isNaN(row[1]))
      .map((row) => ({ name: row[0], value: +row[1], note: row[2] || "" }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
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
      .style("pointer-events", "none")
      .style("border-radius", "4px")
      .style("font-size", "0.9rem")
      .style("display", "none")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("font-family", font);

    const titleMargin = state.title ? titleSize * 1.5 : 0;
    const articleMargin = state.article ? 70 : 0;

    const marginYAxisLable =
      state.areLabelsVisible && state.yAxisLabel ? 15 : 0;
    const marginXAxisLabel =
      state.areLabelsVisible && state.xAxisLabel ? 15 : 0;

    const margin = {
      top: 20 + titleMargin + articleMargin,
      right: 60,
      bottom: 50 + marginXAxisLabel,
      left: 90 + marginYAxisLable,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const spacingPadding = Math.min(Math.max(state.barSpacing / 100, 0), 1);
    const defaultBarColor = state.barColor || "#60002";
    const barOpacity = Math.min(Math.max(state.opacity / 100, 0), 1);

    const colours = customColorOverrides(state.customBarColors);

    const x = d3
      .scaleBand()
      .domain(formattedData.map((d) => d.name))
      .range([0, innerWidth])
      .padding(spacingPadding);

    const maxValue = d3.max(formattedData, (d) => d.value) || 0;
    const y = d3.scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yAxis = d3.axisLeft(y).ticks(5);

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-family", font)
      .style("fill", textColor);

    if (state.showGrids) {
      const yTicks = y.ticks(5);
      g.append("g")
        .call(
          d3
            .axisLeft(y)
            .tickSize(-innerWidth)
            .tickFormat(() => "")
            .tickValues(yTicks.slice(1))
        )
        .selectAll("line")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2");
    }

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-family", font)
      .style("fill", textColor);

    g.selectAll("rect.bar")
      .data(formattedData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("y", innerHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => colours[d.name] || defaultBarColor)
      .attr("fill-opacity", barOpacity)
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
        if (state.showAnnotations) {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px");
        }
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      })
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerHeight - y(d.value));

    if (state.title) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", titleSize)
        .attr("text-anchor", "start")
        .style("font-size", `${titleSize}px`)
        .style("font-weight", "bold")
        .style("font-family", font)
        .style("fill", textColor)
        .text(state.title);
    }

    if (state.areLabelsVisible) {
      if (state.yAxisLabel)
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2)
          .attr("y", 30)
          .style("fill", textColor)
          .style("font-size", "12px")
          .style("font-family", font)
          .text(state.yAxisLabel);
      if (state.xAxisLabel)
        svg
          .append("text")
          .style("fill", textColor)
          .attr("x", width / 2)
          .attr("y", height - 20)
          .style("font-size", "12px")
          .attr("text-anchor", "middle")
          .style("font-family", font)
          .text(state.xAxisLabel);
    }

    if (state.article) {
      const articleY = state.title ? titleSize * 1.2 + 10 : 20;
      const maxArticleWidth = width - 40;
      const lineHeight = articleSize * 1.5;

      svg
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", articleY)
        .attr("width", maxArticleWidth)
        .attr("height", 100)
        .append("xhtml:div")
        .style("font-family", font)
        .style("display", "block")
        .style("font-size", `${articleSize}px`)
        .style("text-align", "left")
        .style("color", textColor)
        .style("line-height", `${lineHeight}px`)
        .html(state.article);
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", height - 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-family", font)
        .style("fill", textColor)
        .text(state.footerText);
    }

    return () => {
      tooltip.remove();
    };
  }, [state, containerHieght, containerWidth]);

  return (
    <Box sx={{ width: "100%", height: "100%" }} ref={wrapperRef}>
      <svg ref={svgRef} width={containerWidth} height={containerHieght} />
    </Box>
  );
};

export default BarChartRenderer;
