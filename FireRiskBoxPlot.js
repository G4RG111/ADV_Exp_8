// src/FireRiskBoxPlot.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const FireRiskBoxPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + "/data.csv").then((data) => {
      const groupedData = d3.groups(data, (d) => d.Health_Status);
      const boxPlotData = groupedData.map(([status, values]) => ({
        status,
        fireRiskValues: values.map((d) => +d.Fire_Risk_Index),
      }));

      // Set up dimensions
      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 70, left: 50 };

      // Create SVG and clear previous content
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#f9f9f9")
        .style("margin", "0 auto");
      svg.selectAll("*").remove();

      const xScale = d3.scaleBand()
        .domain(boxPlotData.map((d) => d.status))
        .range([margin.left, width - margin.right])
        .padding(0.3);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => +d.Fire_Risk_Index)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Draw axes
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

      // Draw box plots
      boxPlotData.forEach((d) => {
        const q1 = d3.quantile(d.fireRiskValues, 0.25);
        const median = d3.quantile(d.fireRiskValues, 0.5);
        const q3 = d3.quantile(d.fireRiskValues, 0.75);
        const iqr = q3 - q1;
        const min = Math.max(d3.min(d.fireRiskValues), q1 - 1.5 * iqr);
        const max = Math.min(d3.max(d.fireRiskValues), q3 + 1.5 * iqr);

        const xPos = xScale(d.status) + xScale.bandwidth() / 2;

        svg.append("line")
          .attr("x1", xPos)
          .attr("x2", xPos)
          .attr("y1", yScale(min))
          .attr("y2", yScale(max))
          .attr("stroke", "black");

        svg.append("rect")
          .attr("x", xScale(d.status))
          .attr("y", yScale(q3))
          .attr("width", xScale.bandwidth())
          .attr("height", yScale(q1) - yScale(q3))
          .attr("fill", "#69b3a2");

        svg.append("line")
          .attr("x1", xScale(d.status))
          .attr("x2", xScale(d.status) + xScale.bandwidth())
          .attr("y1", yScale(median))
          .attr("y2", yScale(median))
          .attr("stroke", "black");
      });
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default FireRiskBoxPlot;
