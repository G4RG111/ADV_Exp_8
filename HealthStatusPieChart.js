// src/HealthStatusPieChart.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const HealthStatusPieChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Load CSV data
    d3.csv(process.env.PUBLIC_URL + "/data.csv").then((data) => {
      // Count occurrences of each unique Health_Status
      const healthStatusCounts = d3.rollups(
        data,
        (v) => v.length,
        (d) => d.Health_Status
      ).map(([status, count]) => ({ status, count }));

      // Calculate total count for percentage calculation
      const total = d3.sum(healthStatusCounts, (d) => d.count);

      // Convert counts to percentages
      const pieData = healthStatusCounts.map((d) => ({
        status: d.status,
        percentage: (d.count / total) * 100,
      }));

      // Set up SVG dimensions and margins
      const width = 300;
      const height = 300;
      const radius = Math.min(width, height) / 2;

      // Set up color scale
      const color = d3.scaleOrdinal()
        .domain(pieData.map((d) => d.status))
        .range(d3.schemeCategory10);

      // Clear previous content
      d3.select(svgRef.current).selectAll("*").remove();

      // Set up pie generator
      const pie = d3.pie()
        .value((d) => d.percentage);

      // Set up arc generator
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      // Create an SVG container
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Create pie chart segments
      svg.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.status))
        .attr("stroke", "#fff")
        .style("stroke-width", "2px");

      // Add labels to pie segments
      svg.selectAll("text")
        .data(pie(pieData))
        .enter()
        .append("text")
        .text((d) => `${d.data.status}: ${d.data.percentage.toFixed(1)}%`)
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "10px");
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default HealthStatusPieChart;
