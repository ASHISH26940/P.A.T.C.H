"use client";
import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  importance: number;
  content: string;
}

interface GraphLink {
  source: string;
  target: string;
  relationship: string;
}

interface ForceGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

const TYPE_COLORS: Record<string, string> = {
  qa: "#f59e0b",
  extraction: "#8b5cf6",
  general: "#06b6d4",
  idea: "#10b981",
  note: "#f472b6",
};

function getColor(type: string): string {
  return TYPE_COLORS[type] || "#6b7280";
}

export const ForceGraph: React.FC<ForceGraphProps> = ({ nodes: nodeData, links: linkData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resize = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    svgRef.current.setAttribute("width", String(width));
    svgRef.current.setAttribute("height", String(height));
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    if (!svgRef.current || !nodeData.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = containerRef.current?.getBoundingClientRect() || { width: 800, height: 600 };

    const linkMap = new Map<string, number>();
    linkData.forEach((l) => {
      const k = `${l.source}|${l.target}`;
      linkMap.set(k, (linkMap.get(k) || 0) + 1);
    });

    const nodeMap = new Map(nodeData.map((n) => [n.id, n]));

    const simLinks = linkData
      .map((l) => ({
        source: l.source,
        target: l.target,
        relationship: l.relationship,
      }))
      .filter((l) => nodeMap.has(l.source) && nodeMap.has(l.target));

    const simulation = d3
      .forceSimulation(nodeData as any)
      .force(
        "link",
        d3
          .forceLink(simLinks)
          .id((d: any) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(40));

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);

    const g = svg.append("g");

    const defs = svg.append("defs");
    simLinks.forEach((l, i) => {
      const id = `marker-${i}`;
      defs
        .append("marker")
        .attr("id", id)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 28)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#353439");
    });

    const link = g
      .append("g")
      .selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", "#353439")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (_, i) => `url(#marker-${i})`);

    const linkLabel = g
      .append("g")
      .selectAll("text")
      .data(simLinks)
      .enter()
      .append("text")
      .text((d: any) => d.relationship)
      .attr("font-size", "9px")
      .attr("fill", "#f59e0b")
      .attr("text-anchor", "middle")
      .attr("dy", "-6")
      .style("pointer-events", "none");

    const node = g
      .append("g")
      .selectAll("g")
      .data(nodeData)
      .enter()
      .append("g")
      .style("cursor", "grab")
      .call(
        d3
          .drag<SVGGElement, any>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any,
      );

    node
      .append("circle")
      .attr("r", (d: any) => Math.max(8, d.importance * 20))
      .attr("fill", (d: any) => getColor(d.type))
      .attr("stroke", "#131317")
      .attr("stroke-width", 2)
      .style("transition", "r 0.2s")
      .on("mouseenter", function () {
        d3.select(this).attr("r", (d: any) => Math.max(12, d.importance * 24));
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).attr("r", Math.max(8, d.importance * 20));
      });

    node
      .append("text")
      .text((d: any) => d.label)
      .attr("dx", (d: any) => Math.max(12, d.importance * 24))
      .attr("dy", 4)
      .attr("font-size", "11px")
      .attr("fill", "#e0e0e0")
      .attr("font-family", "Space Mono, monospace")
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 4px rgba(0,0,0,0.8)")
      .each(function (d: any) {
        const text = d3.select(this);
        const label = d.label;
        if (label.length > 25) {
          text.text(label.slice(0, 24) + "…");
        }
      });

    node.append("title").text((d: any) => d.content);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodeData, linkData]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
