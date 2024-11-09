// src/BoxPlot.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BoxPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + "/data.csv").then((data) => {
      // Parse Fire Risk Index as numeric
      data.forEach(d => {
        d["Fire_Risk_Index"] = +d["Fire_Risk_Index"];
      });

      // Group data by Health Status and calculate statistics for the box plot
      const groupedData = d3.groups(data, d => d.Health_Status);
      const stats = groupedData.map(([status, values]) => {
        const fireRisk = values.map(d => d["Fire_Risk_Index"]);
        return {
          status,
          q1: d3.quantile(fireRisk, 0.25),
          median: d3.median(fireRisk),
          q3: d3.quantile(fireRisk, 0.75),
          min: d3.min(fireRisk),
          max: d3.max(fireRisk)
        };
      });

      // SVG setup
      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };

      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#f9f9f9");

      svg.selectAll("*").remove();

      // X-axis scale
      const xScale = d3.scaleBand()
        .domain(stats.map(d => d.status))
        .range([margin.left, width - margin.right])
        .padding(0.3);

      // Y-axis scale
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(stats, d => d.max)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Draw X-axis
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      // Draw Y-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

      // Draw boxes and whiskers for each status
      svg.selectAll("g.box")
        .data(stats)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${xScale(d.status)}, 0)`)
        .each(function(d) {
          const g = d3.select(this);

          // Draw box
          g.append("rect")
            .attr("y", yScale(d.q3))
            .attr("height", yScale(d.q1) - yScale(d.q3))
            .attr("width", xScale.bandwidth())
            .attr("fill", "#69b3a2");

          // Median line
          g.append("line")
            .attr("y1", yScale(d.median))
            .attr("y2", yScale(d.median))
            .attr("x1", 0)
            .attr("x2", xScale.bandwidth())
            .attr("stroke", "black");

          // Whiskers
          g.append("line")
            .attr("y1", yScale(d.min))
            .attr("y2", yScale(d.q1))
            .attr("x1", xScale.bandwidth() / 2)
            .attr("x2", xScale.bandwidth() / 2)
            .attr("stroke", "black");

          g.append("line")
            .attr("y1", yScale(d.q3))
            .attr("y2", yScale(d.max))
            .attr("x1", xScale.bandwidth() / 2)
            .attr("x2", xScale.bandwidth() / 2)
            .attr("stroke", "black");
        });
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default BoxPlot;
