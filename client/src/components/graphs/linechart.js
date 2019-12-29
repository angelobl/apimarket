import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const LineChart = props => {
  const ref = useRef();
  const divRef = useRef();


  useEffect(() => {
    //Create tooltip
    var Tooltip = d3.select(divRef.current);

    var mouseover = function(d) {
      Tooltip.style("opacity", 1);
    };
    var mousemove = function(d) {
      Tooltip.html("Exact value: " + d.value)
        .style("left", d3.mouse(this)[0] + 15 + "px")
        .style("top", d3.mouse(this)[1] + 200 + "px");
    };
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0);
    };
    //Format svg element
    const svgElement = d3.select(ref.current);
    svgElement
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    svgElement
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Add X axis
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(props.data, d => d.date))
      .range([0, width]);
    svgElement
      .append("g")
      .attr("transform", "translate(50," + (height + 10) + ")")
      .call(d3.axisBottom(xScale));

    //Add Y axis
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        Math.max.apply(
          Math,
          props.data.map(d => d.value)
        )
      ])
      .range([height, 0]);
    svgElement
      .append("g")
      .attr("transform", "translate(50,10)")
      .call(d3.axisLeft(yScale));

    //Add Lines
    svgElement
      .append("path")
      .datum(props.data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function(d) {
            return xScale(d.date) + 50;
          })
          .y(function(d) {
            return yScale(d.value) + 10;
          })
      );

    //Add dots
    svgElement
      .append("g")
      .selectAll("dot")
      .data(props.data)
      .enter()
      .append("circle")
      .attr("class", "myCircle")
      .attr("cx", function(d) {
        return xScale(d.date) + 50;
      })
      .attr("cy", function(d) {
        return yScale(d.value) + 10;
      })
      .attr("r", 8)
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 3)
      .attr("fill", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }, [props.data]);
  return (
    <div
      style={{ width: "auto", position: "relative",marginTop:"80px" }}
    >
      <svg ref={ref} />
      <div ref={divRef} className="tooltip" />
    </div>
  );
};

export default LineChart;
