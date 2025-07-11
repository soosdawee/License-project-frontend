import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import ColorPalettes from "../ui/ColorPalettes";

const AreaChartRenderer = ({ state }) => {
  const ref = useRef();
  const parentRef = useRef();
  const [disabledAreas, setDisabledAreas] = useState(new Set());
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHieght, setContainerHeight] = useState(400);

  const handleAnnotation = (t, d, c = {}) =>
    t
      .replace(/{name}/g, d.data?.name ?? d.label)
      .replace(/{value}/g, d.data?.value ?? d.value)
      .replace(/{title}/g, c.title || "");

  const toggleArea = (name) => {
    setDisabledAreas((prev) => {
      const result = new Set(prev);
      if (result.has(name)) {
        result.delete(name);
      } else {
        result.add(name);
      }
      return result;
    });
  };

  const cutomColorOverrides = (input) => {
    const result = {};
    if (!input) {
      return result;
    }
    input.split(",").forEach((entry) => {
      const [label, color] = entry.split(":").map((s) => s.trim());
      if (label && /^#[0-9A-Fa-f]{3,6}$/.test(color)) result[label] = color;
    });
    return result;
  };

  useEffect(() => {
    if (!parentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
          setContainerHeight(entry.contentRect.height);
        }
      }
    });
    observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!state.data || state.data?.length < 2) return;

    const opacity = Math.min(Math.max(state.opacity / 100, 0), 1);
    const font = state.font || "Arial, sans-serif";
    const textColor = state.textColor || "#000000";
    const titleSize = state.titleSize || 40;
    const articleSize = state.articleSize || 16;

    const margin = {
      top:
        0.05 * containerHieght +
        (state.title ? titleSize + 20 : 0) +
        (state.article ? articleSize * 2 + 10 : 0) +
        (state.showLegend ? 40 : 0),
      right: 0.05 * containerWidth,
      bottom:
        0.1 * containerHieght +
        (state.areLabelsVisible ? 20 : 0) +
        (state.isFooter ? 40 : 0),
      left: 0.1 * containerWidth + (state.areLabelsVisible ? 30 : 0),
    };

    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHieght - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    svg.attr("width", containerWidth).attr("height", containerHieght);

    svg
      .append("rect")
      .attr("width", containerWidth)
      .attr("height", containerHieght)
      .attr(
        "fill",
        state.backgroundColor === "transparent" ? "none" : state.backgroundColor
      )
      .lower();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const columnHeaders = state.data[0];
    const series = columnHeaders.slice(1);

    const data = state.data
      .slice(1)
      .filter((row) => row.length > 1)
      .map((row) => {
        const obj = { label: row[0] };
        series.forEach((line, i) => {
          obj[line] = +row[i + 1];
        });
        return obj;
      });

    const filteredData = data.filter((d) =>
      series.some((key) => !disabledAreas.has(key) && d[key] !== 0)
    );

    const x = d3
      .scalePoint()
      .domain(filteredData.map((d) => d.label))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(series, (key) => d[key]))])
      .nice()
      .range([innerHeight, 0]);

    const colors = cutomColorOverrides(state.customColors);
    const selectedPalette =
      ColorPalettes[state.colorPalette] || ColorPalettes.vibrant;
    const colorScaleWorstCase = d3
      .scaleOrdinal(selectedPalette.colors)
      .domain(series);

    const yAxis = d3
      .axisLeft(y)
      .tickSize(state.showGrids ? -innerWidth : 0)
      .tickPadding(10);

    g.append("g")
      .call(yAxis)
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line")
          .attr("stroke", textColor)
          .attr("stroke-opacity", state.showGrids ? 0.2 : 0);
        g.selectAll(".tick text").attr("fill", textColor);
      });

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickPadding(10))
      .call((g) => {
        g.select(".domain").attr("stroke", textColor);
        g.selectAll(".tick line").attr("stroke", textColor);
        g.selectAll(".tick text").attr("fill", textColor);
      });

    if (state.areLabelsVisible) {
      g.append("text")
        .attr("text-anchor", "middle")
        .style("fill", textColor)
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .style("font-family", font)
        .style("font-size", "14px")
        .text(state.xAxisLabel || "X Axis");

      g.append("text")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${-margin.left + 30},${innerHeight / 2}) rotate(-90)`
        )
        .style("fill", textColor)
        .style("font-family", font)
        .style("font-size", "14px")
        .text(state.yAxisLabel || "Y Axis");
    }

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("padding", "8px")
      .style("background", "#ffffff")
      .style("border", "1px solid #ccc")
      .style("font-family", font)
      .style("font-size", "0.9rem")
      .style("color", "#000000")
      .style("border-radius", "4px")
      .style("display", "none");

    series.forEach((key) => {
      if (disabledAreas.has(key)) {
        return;
      }
      const filteredData = data.filter((d) => d[key] !== 0);
      if (filteredData.length === 0) return;

      const color = colors[key] || colorScaleWorstCase(key);

      const area = d3
        .area()
        .x((d) => x(d.label))
        .y0(innerHeight)
        .y1((d) => y(d[key]));

      const path = g
        .append("path")
        .datum(filteredData)
        .attr("fill", color)
        .attr("fill-opacity", opacity * 0.6)
        .attr("d", area);

      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke", color)
        .attr("stroke-opacity", opacity)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(state.transitionTime || 750)
        .attr("stroke-dashoffset", 0);

      if (state.showLegend) {
        const legend = svg
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top - 30})`);

        const legendItems = series
          .filter((k) => {
            return data.some((d) => d[k] !== 0 && d[k] !== undefined);
          })
          .map((k) => ({
            name: k,
            color: colors[key] || colorScaleWorstCase(k),
          }));

        let xOffset = -90;
        const padding = 0;
        const fontSize = 12;

        legendItems.forEach((item) => {
          const group = legend
            .append("g")
            .attr("transform", `translate(${xOffset}, 0)`)
            .style("cursor", "pointer")
            .on("click", () => toggleArea(item.name));

          group
            .append("rect")
            .attr("x", 0)
            .attr("y", -fontSize + 2)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", item.color)
            .attr("opacity", disabledAreas.has(item.name) ? 0.3 : 1);

          const text = group
            .append("text")
            .attr("x", 16)
            .attr("y", 2)
            .style("font-family", font)
            .style("font-size", `${fontSize}px`)
            .style("fill", textColor)
            .text(item.name)
            .attr("opacity", disabledAreas.has(item.name) ? 0.3 : 1);

          xOffset += text.node().getComputedTextLength() + 12 + padding + 8;
        });
      }

      filteredData.forEach((d) => {
        g.append("circle")
          .attr("cx", x(d.label))
          .attr("cy", y(d[key]))
          .attr("r", 3)
          .attr("fill", color)
          .attr("opacity", opacity)
          .on("mouseover", (event) => {
            if (state.showAnnotations) {
              tooltip
                .html(
                  `<div>${handleAnnotation(
                    state.customAnnotation || "{name}: {value}",
                    {
                      data: {
                        name: d.label,
                        value: d[key],
                      },
                    },
                    { title: key }
                  )}</div>`
                )
                .style("display", "block");
            }
          })
          .on("mousemove", (event) => {
            tooltip
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px");
          })
          .on("mouseout", () => tooltip.style("display", "none"));
      });
    });

    if (state.title) {
      svg
        .append("text")
        .attr("x", 60)
        .attr("y", titleSize)
        .attr("text-anchor", "middle")
        .style("font-size", `${titleSize}px`)
        .style("font-weight", "bold")
        .style("font-family", font)
        .style("fill", textColor)
        .text(state.title);
    }

    if (state.article) {
      const articleY = state.title ? titleSize + 10 : 20;
      const maxArticleWidth = containerWidth - 40;
      const lineHeight = articleSize * 1.5;

      svg
        .append("foreignObject")
        .attr("x", 20)
        .attr("y", articleY)
        .attr("width", maxArticleWidth)
        .attr("height", articleSize * 3)
        .append("xhtml:div")
        .style("font-size", `${articleSize}px`)
        .style("font-family", font)
        .style("color", textColor)
        .style("line-height", `${lineHeight}px`)
        .style("display", "block")
        .style("text-align", "left")
        .html(state.article);
    }

    if (state.isFooter && state.footerText) {
      svg
        .append("text")
        .attr("x", 35)
        .attr("y", containerHieght - 10)
        .style("font-family", font)
        .style("fill", textColor)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(state.footerText);
    }

    return () => tooltip.remove();
  }, [state, containerHieght, containerWidth, disabledAreas]);

  return (
    <Box
      ref={parentRef}
      sx={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg
        ref={ref}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default AreaChartRenderer;
