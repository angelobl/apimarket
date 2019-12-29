import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const width = 450;
const height = 450;
const margin = 40;

var radius = Math.min(width, height) / 2 - margin;


const PieChart = props => {
  const ref = useRef();

  useEffect(() => {
    //Format svg element
    const svgElement = d3.select(ref.current);
    svgElement
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(500,500)");

    //Set color scale
    var color = d3
      .scaleOrdinal()
      .domain(props.productData)
      .range(d3.schemeSet2);

    var pie = d3.pie().value(function(d) {
      return d.value;
    });
    var data_ready = pie(d3.entries(props.productData));

    // shape helper to build arcs:
    var arcGenerator = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius);

    //Build the pie chart
    svgElement
      .selectAll("mySlices")

      .data(data_ready)
      .enter()
      .append("path")
      .attr("transform", "translate(200,200)")
      .attr("d", arcGenerator)
      .attr("fill", function(d) {
        return color(d.data.key);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svgElement
      .selectAll("mySlices")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function(d) {
        return d.data.key;
      })
      .attr("transform", function(d) {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x + 200},${y + 200})`;
      })
      .style("text-anchor", "middle")
      .style("font-size", 17);
  }, [props.productData]);
  return (
    <div style={{ width: "auto",marginTop:"80px" }}>
      <svg ref={ref} />
    </div>
  );
};

export default PieChart;
