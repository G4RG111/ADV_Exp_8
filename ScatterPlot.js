// src/ScatterPlot.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ScatterPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Load data from CSV
    d3.csv(process.env.PUBLIC_URL + "/data.csv").then((data) => {
      // Parse data for numeric values
      data.forEach((d) => {
        d.DBH = +d.DBH;
        d.Tree_Height = +d.Tree_Height;
      });

      // Set up SVG dimensions and margins
      const width = 500;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };

      // Set up scales
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.DBH)]).nice()
        .range([margin.left, width - margin.right]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.Tree_Height)]).nice()
        .range([height - margin.bottom, margin.top]);

      // Clear previous content
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Create and set up SVG container
      svg
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#f9f9f9");

      // X-axis
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text("DBH");

      // Y-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text("Tree Height");

      // Scatter plot points
      svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.DBH))
        .attr("cy", (d) => yScale(d.Tree_Height))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlot;
