"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * props:
 * chordName: "C Major"
 * positions: [null, 3, 2, 0, 1, 0]   // 6 strings, EADGBE
 * stringStates: ["neutral", "correct", "incorrect", ...] // one per string
 */

export default function GuitarChordDiagram({ chordName, positions, stringStates }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 220;
    const height = 260;
    const stringSpacing = width / 6;
    const fretSpacing = height / 6;

    // Draw background
    svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "white")
      .style("border-radius", "12px");

    // Draw strings
    const strings = svg
      .selectAll(".string")
      .data(d3.range(6))
      .enter()
      .append("line")
      .attr("x1", (d) => stringSpacing / 2 + d * stringSpacing)
      .attr("y1", 30)
      .attr("x2", (d) => stringSpacing / 2 + d * stringSpacing)
      .attr("y2", height - 40)
      .attr("stroke", (d) => {
        const state = stringStates?.[d];
        if (state === "correct") return "#22c55e"; // green
        if (state === "incorrect") return "#ef4444"; // red
        return "#555"; // neutral
      })
      .attr("stroke-width", 3);

    // Draw frets
    svg
      .selectAll(".fret")
      .data(d3.range(5))
      .enter()
      .append("line")
      .attr("x1", stringSpacing / 2)
      .attr("x2", width - stringSpacing / 2)
      .attr("y1", (d) => 40 + d * fretSpacing)
      .attr("y2", (d) => 40 + d * fretSpacing)
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Draw finger dots
    positions.forEach((fret, i) => {
      if (fret === null) return; // open string
      const x = stringSpacing / 2 + i * stringSpacing;
      const y = 40 + (fret - 0.5) * fretSpacing;
      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("fill", "#1d4ed8");
    });

    // Add chord name
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#1e293b")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      // .text(chordName);
  }, [chordName, positions, stringStates]);

  return <svg ref={ref}></svg>;
}
