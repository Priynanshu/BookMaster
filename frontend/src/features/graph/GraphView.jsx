import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import { fetchGraphData } from "../../features/graph/graphSlice"; // Path check kar lena
import { Network, ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";

const TYPE_COLORS = {
  article: "#7C3AED",
  video: "#06B6D4",
  pdf: "#F59E0B",
  tweet: "#10B981",
  image: "#EC4899",
};

const GraphView = () => {
  const dispatch = useDispatch();
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const { nodes: rawNodes, edges: rawEdges, isLoading } = useSelector(
    (state) => state.graph
  );

  // ── Fetch Graph Data ──────────────────────────────
  useEffect(() => {
    dispatch(fetchGraphData());
  }, [dispatch]);

  // ── Resize Observer ───────────────────────────────
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // ── D3 Graph Logic ────────────────────────────────
  useEffect(() => {
    if (!rawNodes.length || !svgRef.current) return;

    // ✅ CRITICAL FIX: Clone data to prevent "Object not extensible" error
    const nodes = rawNodes.map((d) => ({ ...d }));
    const edges = rawEdges.map((d) => ({ ...d }));

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    const g = svg.append("g");

    // ── Zoom Logic ──
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    // ── Force Simulation ──
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(50));

    // ── Draw Edges ──
    const link = g.append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", "#1F1F2E")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4);

    // ── Draw Nodes ──
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "grab")
      .call(
        d3.drag()
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
          })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Outer Glow/Circle
    node.append("circle")
      .attr("r", 26)
      .attr("fill", (d) => `${TYPE_COLORS[d.type] || "#7C3AED"}15`)
      .attr("stroke", (d) => TYPE_COLORS[d.type] || "#7C3AED")
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-300");

    // Clip for Image
    node.append("clipPath")
      .attr("id", (d) => `clip-${d.id}`)
      .append("circle")
      .attr("r", 24);

    // Image Node
    node.append("image")
      .attr("href", (d) => d.thumbnail || "")
      .attr("x", -24)
      .attr("y", -24)
      .attr("width", 48)
      .attr("height", 48)
      .attr("clip-path", (d) => `url(#clip-${d.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .on("error", function() { d3.select(this).attr("opacity", 0); }); // Hide broken images

    // Label
    node.append("text")
      .text((d) => d.title.length > 15 ? d.title.substring(0, 15) + "..." : d.title)
      .attr("y", 42)
      .attr("text-anchor", "middle")
      .attr("fill", "#9CA3AF")
      .style("font-size", "10px")
      .style("font-weight", "500")
      .style("pointer-events", "none");

    // ── Tick Function ──
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Zoom Controls Linkage
    svgRef.current.zoomIn = () => svg.transition().duration(500).call(zoomBehavior.scaleBy, 1.5);
    svgRef.current.zoomOut = () => svg.transition().duration(500).call(zoomBehavior.scaleBy, 0.7);

    return () => simulation.stop();
  }, [rawNodes, rawEdges, dimensions]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Knowledge Graph</h1>
          <p className="text-gray-500 text-sm">Visualizing connections through shared tags.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 bg-[#13131A] p-3 rounded-2xl border border-[#1F1F2E]">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 bg-[#13131A] border border-[#1F1F2E] rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#13131A]/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#7C3AED] font-bold text-xs uppercase tracking-widest">Mapping Intelligence...</p>
            </div>
          </div>
        )}

        {/* The SVG Canvas */}
        <svg ref={svgRef} className="w-full h-full cursor-move" onClick={() => setSelectedNode(null)} />

        {/* Floating Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3">
          <button onClick={() => svgRef.current.zoomIn()} className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-[#7C3AED] transition-all active:scale-90">
            <ZoomIn size={20} />
          </button>
          <button onClick={() => svgRef.current.zoomOut()} className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-[#7C3AED] transition-all active:scale-90">
            <ZoomOut size={20} />
          </button>
        </div>

        {/* Stats Overlay */}
        <div className="absolute top-8 left-8 flex gap-2">
          <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {rawNodes.length} Nodes
          </div>
          <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {rawEdges.length} Links
          </div>
        </div>

        {/* Selected Node Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute top-0 right-0 h-full w-80 bg-[#0A0A0F]/90 backdrop-blur-2xl border-l border-[#1F1F2E] p-8 shadow-2xl z-20"
            >
              <button onClick={() => setSelectedNode(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X size={20} />
              </button>

              <div className="mt-10 space-y-6">
                <div className="h-40 w-full rounded-2xl overflow-hidden border border-[#1F1F2E]">
                  {selectedNode.thumbnail ? (
                    <img src={selectedNode.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#13131A] flex items-center justify-center"><Network className="text-gray-800" size={40} /></div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.2em]">
                    {selectedNode.type}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2 leading-tight">
                    {selectedNode.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Shared Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#13131A] border border-[#1F1F2E] rounded-lg text-xs text-gray-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all mt-8">
                  View Full Item
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GraphView;