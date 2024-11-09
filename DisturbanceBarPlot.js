// src/DisturbanceBarPlot.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DisturbanceBarPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + "/data.csv").then((data) => {
      // Randomly sample 10 entries from the data
      const randomSample = d3.shuffle(data).slice(0, 10); // Shuffle and take first 10 entries

      // Group the sampled data by Disturbance Level and calculate the average Soil AP
      const groupedData = d3.rollups(
        randomSample,
        (v) => d3.mean(v, (d) => +d.Soil_AP),
        (d) => d.Disturbance_Level
      );

      const barData = groupedData.map(([level, avgSoilAP]) => ({
        level,
        avgSoilAP,
      }));

      // Set up SVG dimensions and margins
      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 70, left: 50 };

      // Set up scales
      const xScale = d3.scaleBand()
        .domain(barData.map((d) => d.level))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(barData, (d) => d.avgSoilAP)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Create SVG and clear previous content
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#f9f9f9")
        .style("margin", "0 auto");
      svg.selectAll("*").remove();

      // Add axes
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

      // Create bars
      svg.selectAll(".bar")
        .data(barData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.level))
        .attr("y", (d) => yScale(d.avgSoilAP))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - margin.bottom - yScale(d.avgSoilAP))
        .attr("fill", "#69b3a2");
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default DisturbanceBarPlot;
