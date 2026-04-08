import { useState, useRef, useEffect, useCallback } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const SHAPE_DEFAULTS = {
  rect: { w: 120, h: 50 },
  rounded: { w: 130, h: 50 },
  diamond: { w: 100, h: 70 },
  parallelogram: { w: 130, h: 50 },
};
const GRID_STEP = 20;

// ── ID counters ───────────────────────────────────────────────────────────────
let _nodeId = 1;
let _connId = 1;
let _labelId = 1;
const nextNid = () => "n" + _nodeId++;
const nextCid = () => "c" + _connId++;
const nextLid = () => "l" + _labelId++;

function snap(v, step = 10) {
  return Math.round(v / step) * step;
}

// ── Factories ─────────────────────────────────────────────────────────────────
function makeNode(shape, cx, cy) {
  const sz = SHAPE_DEFAULTS[shape] ?? { w: 120, h: 50 };
  return {
    id: nextNid(),
    shape,
    x: snap(cx - sz.w / 2),
    y: snap(cy - sz.h / 2),
    w: sz.w,
    h: sz.h,
    label: shape.charAt(0).toUpperCase() + shape.slice(1),
    fill: "#ffffff",
    stroke: "#444441",
    strokeWidth: 1,
    opacity: 1,
    fontSize: 13,
  };
}
function makeLabel(cx, cy) {
  return {
    id: nextLid(),
    x: snap(cx),
    y: snap(cy),
    text: "Label",
    fontSize: 14,
  };
}

// ── Port helpers ──────────────────────────────────────────────────────────────
function getPortPositions(node) {
  const { x, y, w, h } = node;
  return [
    { side: "top", px: x + w / 2, py: y },
    { side: "right", px: x + w, py: y + h / 2 },
    { side: "bottom", px: x + w / 2, py: y + h },
    { side: "left", px: x, py: y + h / 2 },
  ];
}
function getPort(node, side) {
  return (
    getPortPositions(node).find((p) => p.side === side) ?? {
      px: node.x + node.w / 2,
      py: node.y + node.h / 2,
    }
  );
}

// ── ShapeEl ───────────────────────────────────────────────────────────────────
function ShapeEl({ node, isSelected, onPortMouseDown, onMouseDown }) {
  const { x, y, w, h, shape, fill, stroke, strokeWidth, opacity } = node;
  const sw = strokeWidth ?? 1;
  const common = {
    fill,
    stroke,
    strokeWidth: sw,
    opacity,
    className: "node-shape",
  };

  let shapeEl;
  if (shape === "rect") {
    shapeEl = <rect x={x} y={y} width={w} height={h} rx={4} {...common} />;
  } else if (shape === "rounded") {
    shapeEl = (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={Math.min(h / 2, 20)}
        {...common}
      />
    );
  } else if (shape === "diamond") {
    const cx = x + w / 2,
      cy = y + h / 2;
    shapeEl = (
      <polygon
        points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`}
        {...common}
      />
    );
  } else if (shape === "parallelogram") {
    const sk = Math.min(w * 0.2, 20);
    shapeEl = (
      <polygon
        points={`${x + sk},${y} ${x + w},${y} ${x + w - sk},${y + h} ${x},${y + h}`}
        {...common}
      />
    );
  } else {
    shapeEl = <rect x={x} y={y} width={w} height={h} rx={4} {...common} />;
  }

  const lines = (node.label || "").split("\n");
  const fs = node.fontSize || 13;
  const lineH = fs * 1.4;
  const totalH = lines.length * lineH;
  const startY = y + h / 2 - totalH / 2 + lineH / 2;

  return (
    <g
      className={`node-group${isSelected ? " is-selected" : ""}`}
      onMouseDown={(e) => onMouseDown(e, node.id)}
      style={{ cursor: "move" }}
    >
      {shapeEl}
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={startY + i * lineH}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: fs,
            fontFamily: "inherit",
            fill: "#000000",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {line}
        </text>
      ))}
      {getPortPositions(node).map((p) => (
        <circle
          key={p.side}
          className="port-dot"
          cx={p.px}
          cy={p.py}
          r={5}
          onMouseDown={(e) => {
            e.stopPropagation();
            onPortMouseDown(e, node.id, p.side);
          }}
          style={{ cursor: "crosshair" }}
        />
      ))}
      {isSelected && (
        <rect
          className="resize-handle"
          x={x + w - 5}
          y={y + h - 5}
          width={10}
          height={10}
          rx={2}
          style={{ cursor: "nwse-resize" }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onMouseDown(e, node.id, "resize");
          }}
        />
      )}
    </g>
  );
}

// ── TextLabelEl ───────────────────────────────────────────────────────────────
function TextLabelEl({ label, isSelected, onMouseDown }) {
  const lines = (label.text || "").split("\n");
  const fs = label.fontSize || 14;
  const lineH = fs * 1.4;
  const maxChars = Math.max(...lines.map((l) => l.length), 1);
  const bw = maxChars * fs * 0.62 + 12;
  const bh = lines.length * lineH + 6;

  return (
    <g
      className="label-group"
      data-labelid={label.id}
      onMouseDown={(e) => onMouseDown(e, label.id)}
      style={{ cursor: "move" }}
    >
      <rect
        x={label.x - 4}
        y={label.y - fs - 2}
        width={bw}
        height={bh}
        fill="transparent"
      />
      {isSelected && (
        <rect
          x={label.x - 4}
          y={label.y - fs - 2}
          width={bw}
          height={bh}
          fill="none"
          stroke="var(--fc-accent)"
          strokeWidth={1}
          strokeDasharray="3,2"
          rx={3}
          style={{ pointerEvents: "none" }}
        />
      )}
      {lines.map((line, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y + i * lineH}
          dominantBaseline="auto"
          style={{
            fontSize: fs,
            fontFamily: "inherit",
            fill: "var(--fc-text)",
            userSelect: "none",
          }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// ── ConnEl ────────────────────────────────────────────────────────────────────
function ConnEl({ conn, nodes, isSelected, onClick }) {
  const from = nodes.find((n) => n.id === conn.fromId);
  const to = nodes.find((n) => n.id === conn.toId);
  if (!from || !to) return null;
  const fp = getPort(from, conn.fromPort);
  const tp = getPort(to, conn.toPort);
  const dx = tp.px - fp.px;
  const d = `M${fp.px},${fp.py} C${fp.px + dx * 0.35},${fp.py} ${tp.px - dx * 0.35},${tp.py} ${tp.px},${tp.py}`;
  const color = "#ffffff";
  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onClick(conn.id);
      }}
      style={{ cursor: "pointer" }}
    >
      <path d={d} fill="none" stroke="transparent" strokeWidth={12} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        markerEnd={`url(#${isSelected ? "ah-sel" : "ah-def"})`}
        className={isSelected ? "conn-sel" : ""}
        style={{ transition: "all 0.2s ease" }}
      />
    </g>
  );
}

// ── Sidebar shapes list ───────────────────────────────────────────────────────
const SHAPES = [
  {
    key: "rect",
    label: "Rectangle",
    icon: (
      <svg width={18} height={18} viewBox="0 0 18 18">
        <rect
          x={1}
          y={3}
          width={16}
          height={12}
          rx={2}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      </svg>
    ),
  },
  {
    key: "rounded",
    label: "Rounded",
    icon: (
      <svg width={18} height={18} viewBox="0 0 18 18">
        <rect
          x={1}
          y={3}
          width={16}
          height={12}
          rx={6}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      </svg>
    ),
  },
  {
    key: "diamond",
    label: "Diamond",
    icon: (
      <svg width={18} height={18} viewBox="0 0 18 18">
        <polygon
          points="9,1 17,9 9,17 1,9"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      </svg>
    ),
  },
  {
    key: "parallelogram",
    label: "Parallelogram",
    icon: (
      <svg width={18} height={18} viewBox="0 0 18 18">
        <polygon
          points="4,15 14,15 18,3 8,3"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      </svg>
    ),
  },
  {
    key: "textlabel",
    label: "Text label",
    icon: (
      <svg width={18} height={18} viewBox="0 0 18 18">
        <text
          x={3}
          y={14}
          style={{
            fontSize: 14,
            fontFamily: "sans-serif",
            fill: "currentColor",
            fontWeight: 700,
          }}
        >
          T
        </text>
      </svg>
    ),
  },
];

function Inspector({
  selectedNode,
  selectedConn,
  selectedLabel,
  onChange,
  onConnChange,
  onLabelChange,
}) {
  if (!selectedNode && !selectedConn && !selectedLabel) {
    return (
      <div
        style={{
          padding: "16px 12px",
          fontSize: 12,
          color: "var(--fc-muted)",
          lineHeight: 1.6,
        }}
      >
        Select a node, connection, or text label to edit properties.
      </div>
    );
  }

  // ── Text label ──
  if (selectedLabel) {
    return (
      <div>
        <InspSection title="Text label">
          <InspRow label="Text">
            <textarea
              className="insp-input"
              rows={3}
              style={{ resize: "none" }}
              value={selectedLabel.text || ""}
              onChange={(e) => onLabelChange("text", e.target.value)}
            />
          </InspRow>
        </InspSection>
      </div>
    );
  }

  // ── Connection ──
  if (selectedConn) {
    return (
      <div>
        <InspSection title="Connection">
          <div
            style={{ fontSize: 13, color: "var(--fc-muted)", padding: "4px 0" }}
          >
            No editable properties.
          </div>
        </InspSection>
      </div>
    );
  }

  // ── Node — label control only (no font-size) ──
  const n = selectedNode;
  return (
    <div>
      <InspSection title="Node">
        <InspRow label="Label">
          <textarea
            className="insp-input"
            rows={2}
            style={{ resize: "none" }}
            value={n.label || ""}
            onChange={(e) => onChange("label", e.target.value)}
          />
        </InspRow>
      </InspSection>
    </div>
  );
}

function InspSection({ title, children }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderBottom: "0.5px solid var(--fc-border)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--fc-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
function InspRow({ label, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--fc-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Grid dots ─────────────────────────────────────────────────────────────────
function GridDots({ panX, panY, zoom, width, height }) {
  const step = GRID_STEP * zoom;
  const ox = ((panX % step) + step) % step;
  const oy = ((panY % step) + step) % step;
  const dots = [];
  for (let x = ox; x < width; x += step)
    for (let y = oy; y < height; y += step)
      dots.push(
        <circle
          key={`${x.toFixed(1)},${y.toFixed(1)}`}
          cx={x}
          cy={y}
          r={0.8}
          fill="var(--fc-grid)"
        />,
      );
  return <>{dots}</>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FlowchartEditor() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConns] = useState([]);
  const [textLabels, setTextLabels] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConnId, setSelConn] = useState(null);
  const [selectedLabelId, setSelLabel] = useState(null);
  const [tool, setToolState] = useState("select");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 500 });
  const [tempConn, setTempConn] = useState(null);

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const panRef = useRef(null);
  const connectRef = useRef(null);

  // Resize observer
  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setCanvasSize({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const screenToWorld = useCallback(
    (sx, sy) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return { x: 0, y: 0 };
      return {
        x: (sx - r.left - pan.x) / zoom,
        y: (sy - r.top - pan.y) / zoom,
      };
    },
    [pan, zoom],
  );

  // Seed
  useEffect(() => {
    const n1 = makeNode("rounded", 200, 120);
    n1.label = "Start";
    n1.fill = "#e6f1fb";
    n1.stroke = "#185fa5";
    const n2 = makeNode("diamond", 200, 240);
    n2.label = "Decision?";
    const n3 = makeNode("rect", 340, 340);
    n3.label = "Yes";
    const n4 = makeNode("rect", 80, 340);
    n4.label = "No";
    const n5 = makeNode("rounded", 200, 460);
    n5.label = "End";
    n5.fill = "#e1f5ee";
    n5.stroke = "#0f6e56";
    setNodes([n1, n2, n3, n4, n5]);
    setConns([
      {
        id: nextCid(),
        fromId: n1.id,
        fromPort: "bottom",
        toId: n2.id,
        toPort: "top",
        label: "",
        lineStyle: "solid",
        color: "",
      },
      {
        id: nextCid(),
        fromId: n2.id,
        fromPort: "right",
        toId: n3.id,
        toPort: "top",
        label: "Yes",
        lineStyle: "solid",
        color: "",
      },
      {
        id: nextCid(),
        fromId: n2.id,
        fromPort: "left",
        toId: n4.id,
        toPort: "top",
        label: "No",
        lineStyle: "dashed",
        color: "",
      },
      {
        id: nextCid(),
        fromId: n3.id,
        fromPort: "bottom",
        toId: n5.id,
        toPort: "right",
        label: "",
        lineStyle: "solid",
        color: "",
      },
      {
        id: nextCid(),
        fromId: n4.id,
        fromPort: "bottom",
        toId: n5.id,
        toPort: "left",
        label: "",
        lineStyle: "solid",
        color: "",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fitView = useCallback(
    (ns = nodes) => {
      if (!ns.length) return;
      const minX = Math.min(...ns.map((n) => n.x));
      const minY = Math.min(...ns.map((n) => n.y));
      const maxX = Math.max(...ns.map((n) => n.x + n.w));
      const maxY = Math.max(...ns.map((n) => n.y + n.h));
      const cw = maxX - minX || 1,
        ch = maxY - minY || 1;
      const z = Math.min((canvasSize.w - 80) / cw, (canvasSize.h - 80) / ch, 2);
      setPan({
        x: (canvasSize.w - cw * z) / 2 - minX * z,
        y: (canvasSize.h - ch * z) / 2 - minY * z,
      });
      setZoom(z);
    },
    [canvasSize, nodes],
  );

  useEffect(() => {
    if (nodes.length === 5 && canvasSize.w > 100) fitView(nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, canvasSize.w]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearSel = () => {
    setSelectedId(null);
    setSelConn(null);
    setSelLabel(null);
  };

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleSvgMouseDown = useCallback(
    (e) => {
      if (
        e.target === svgRef.current ||
        e.target.id === "grid-layer" ||
        e.target.closest("#grid-layer")
      ) {
        clearSel();
        panRef.current = { startX: e.clientX, startY: e.clientY, origPan: pan };
      }
    },
    [pan],
  );

  const handleNodeMouseDown = useCallback(
    (e, nodeId, mode) => {
      e.stopPropagation();
      setSelectedId(nodeId);
      setSelConn(null);
      setSelLabel(null);
      const w = screenToWorld(e.clientX, e.clientY);
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
      dragRef.current =
        mode === "resize"
          ? {
              type: "resize",
              nodeId,
              startX: w.x,
              startY: w.y,
              origW: node.w,
              origH: node.h,
            }
          : {
              type: "move-node",
              nodeId,
              offX: w.x - node.x,
              offY: w.y - node.y,
            };
    },
    [nodes, screenToWorld],
  );

  const handleLabelMouseDown = useCallback(
    (e, labelId) => {
      e.stopPropagation();
      setSelLabel(labelId);
      setSelectedId(null);
      setSelConn(null);
      const w = screenToWorld(e.clientX, e.clientY);
      const lbl = textLabels.find((l) => l.id === labelId);
      if (!lbl) return;
      dragRef.current = {
        type: "move-label",
        labelId,
        offX: w.x - lbl.x,
        offY: w.y - lbl.y,
      };
    },
    [textLabels, screenToWorld],
  );

  const handlePortMouseDown = useCallback((e, nodeId, side) => {
    e.stopPropagation();
    connectRef.current = { fromId: nodeId, fromPort: side };
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const w = screenToWorld(e.clientX, e.clientY);
      if (connectRef.current) {
        const from = nodes.find((n) => n.id === connectRef.current.fromId);
        if (from) {
          const fp = getPort(from, connectRef.current.fromPort);
          setTempConn({ x1: fp.px, y1: fp.py, x2: w.x, y2: w.y });
        }
        return;
      }
      if (dragRef.current) {
        const { type } = dragRef.current;
        if (type === "move-node") {
          setNodes((p) =>
            p.map((n) =>
              n.id !== dragRef?.current?.nodeId
                ? n
                : {
                    ...n,
                    x: snap(w.x - dragRef.current.offX),
                    y: snap(w.y - dragRef.current.offY),
                  },
            ),
          );
        } else if (type === "resize") {
          setNodes((p) =>
            p.map((n) =>
              n.id !== dragRef?.current?.nodeId
                ? n
                : {
                    ...n,
                    w: Math.max(
                      40,
                      snap(
                        dragRef.current.origW + w.x - dragRef.current.startX,
                      ),
                    ),
                    h: Math.max(
                      30,
                      snap(
                        dragRef.current.origH + w.y - dragRef.current.startY,
                      ),
                    ),
                  },
            ),
          );
        } else if (type === "move-label") {
          setTextLabels((p) =>
            p.map((l) =>
              l.id !== dragRef.current.labelId
                ? l
                : {
                    ...l,
                    x: snap(w.x - dragRef.current.offX),
                    y: snap(w.y - dragRef.current.offY),
                  },
            ),
          );
        }
        return;
      }
      if (panRef.current) {
        setPan({
          x: panRef.current.origPan.x + e.clientX - panRef.current.startX,
          y: panRef.current.origPan.y + e.clientY - panRef.current.startY,
        });
      }
    },
    [nodes, screenToWorld],
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (connectRef.current) {
        const w = screenToWorld(e.clientX, e.clientY);
        let best = null,
          bestDist = 24;
        for (const node of nodes) {
          if (node.id === connectRef.current.fromId) continue;
          // Check each port by proximity
          for (const p of getPortPositions(node)) {
            const d = Math.hypot(w.x - p.px, w.y - p.py);
            if (d < bestDist) {
              bestDist = d;
              best = { nodeId: node.id, port: p.side };
            }
          }
          // Also accept a drop anywhere inside the node body
          if (
            !best &&
            w.x >= node.x &&
            w.x <= node.x + node.w &&
            w.y >= node.y &&
            w.y <= node.y + node.h
          ) {
            let nearestPort = "top",
              nearestD = Infinity;
            for (const p of getPortPositions(node)) {
              const d = Math.hypot(w.x - p.px, w.y - p.py);
              if (d < nearestD) {
                nearestD = d;
                nearestPort = p.side;
              }
            }
            best = { nodeId: node.id, port: nearestPort };
          }
        }
        // Snapshot before nulling — setConns updater runs in render phase, after ref is cleared
        const { fromId, fromPort } = connectRef.current;
        connectRef.current = null;
        setTempConn(null);
        if (best) {
          const dup = connections.find(
            (c) =>
              c.fromId === fromId &&
              c.toId === best.nodeId &&
              c.fromPort === fromPort &&
              c.toPort === best.port,
          );
          if (!dup)
            setConns((p) => [
              ...p,
              {
                id: nextCid(),
                fromId,
                fromPort,
                toId: best.nodeId,
                toPort: best.port,
                label: "",
                lineStyle: "solid",
                color: "",
              },
            ]);
        }
      }
      dragRef.current = null;
      panRef.current = null;
    },
    [connections, nodes, screenToWorld],
  );

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const r = svgRef.current.getBoundingClientRect();
    const ox = e.clientX - r.left,
      oy = e.clientY - r.top;
    setZoom((z) => {
      const nz = Math.min(3, Math.max(0.2, z * factor));
      setPan((p) => ({
        x: ox - (ox - p.x) * (nz / z),
        y: oy - (oy - p.y) * (nz / z),
      }));
      return nz;
    });
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleDblClick = useCallback(
    (e) => {
      if (
        e.target.closest("[data-nodeid]") ||
        e.target.closest("[data-labelid]")
      )
        return;
      const w = screenToWorld(e.clientX, e.clientY);
      if (tool === "text") {
        const l = makeLabel(w.x, w.y);
        setTextLabels((p) => [...p, l]);
        setSelLabel(l.id);
        setSelectedId(null);
        setSelConn(null);
      } else {
        const n = makeNode("rounded", w.x, w.y);
        setNodes((p) => [...p, n]);
        setSelectedId(n.id);
        setSelConn(null);
        setSelLabel(null);
      }
    },
    [screenToWorld, tool],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const shape = e.dataTransfer.getData("shape");
      if (!shape) return;
      const w = screenToWorld(e.clientX, e.clientY);
      if (shape === "textlabel") {
        const l = makeLabel(w.x, w.y);
        setTextLabels((p) => [...p, l]);
        setSelLabel(l.id);
        setSelectedId(null);
        setSelConn(null);
      } else {
        const n = makeNode(shape, w.x, w.y);
        setNodes((p) => [...p, n]);
        setSelectedId(n.id);
        setSelConn(null);
        setSelLabel(null);
      }
    },
    [screenToWorld],
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  const deleteSelected = useCallback(() => {
    if (selectedId) {
      setNodes((p) => p.filter((n) => n.id !== selectedId));
      setConns((p) =>
        p.filter((c) => c.fromId !== selectedId && c.toId !== selectedId),
      );
      setSelectedId(null);
    }
    if (selectedConnId) {
      setConns((p) => p.filter((c) => c.id !== selectedConnId));
      setSelConn(null);
    }
    if (selectedLabelId) {
      setTextLabels((p) => p.filter((l) => l.id !== selectedLabelId));
      setSelLabel(null);
    }
  }, [selectedId, selectedConnId, selectedLabelId]);

  const duplicateSelected = useCallback(() => {
    if (selectedId) {
      const node = nodes.find((n) => n.id === selectedId);
      if (node) {
        const n2 = { ...node, id: nextNid(), x: node.x + 20, y: node.y + 20 };
        setNodes((p) => [...p, n2]);
        setSelectedId(n2.id);
      }
    }
    if (selectedLabelId) {
      const lbl = textLabels.find((l) => l.id === selectedLabelId);
      if (lbl) {
        const l2 = { ...lbl, id: nextLid(), x: lbl.x + 20, y: lbl.y + 20 };
        setTextLabels((p) => [...p, l2]);
        setSelLabel(l2.id);
      }
    }
  }, [selectedId, selectedLabelId, nodes, textLabels]);

  const bringFront = useCallback(() => {
    if (!selectedId) return;
    setNodes((p) => {
      const i = p.findIndex((n) => n.id === selectedId);
      if (i < 0) return p;
      const a = [...p];
      a.push(a.splice(i, 1)[0]);
      return a;
    });
  }, [selectedId]);

  const clearAll = () => {
    if (!window.confirm("Clear all?")) return;
    setNodes([]);
    setConns([]);
    setTextLabels([]);
    clearSel();
  };

  // ── Key handler ───────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
      if (e.key === "Escape") clearSel();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  // ── Inspector callbacks ───────────────────────────────────────────────────
  const updateNode = (k, v) =>
    setNodes((p) => p.map((n) => (n.id === selectedId ? { ...n, [k]: v } : n)));
  const updateConn = (k, v) =>
    setConns((p) =>
      p.map((c) => (c.id === selectedConnId ? { ...c, [k]: v } : c)),
    );
  const updateLabel = (k, v) =>
    setTextLabels((p) =>
      p.map((l) => (l.id === selectedLabelId ? { ...l, [k]: v } : l)),
    );

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  const selectedConn = connections.find((c) => c.id === selectedConnId) ?? null;
  const selectedLabel =
    textLabels.find((l) => l.id === selectedLabelId) ?? null;
  const tf = `translate(${pan.x},${pan.y}) scale(${zoom})`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        :root {
          --fc-border: #DBE2EF; --fc-bg: #F9F7F7; --fc-surface: #ffffff;
          --fc-text: #112D4E; --fc-muted: #3F72AF; --fc-grid: #DBE2EF;
          --fc-conn: #112D4E; --fc-accent: #3F72AF;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --fc-border: #3F72AF; --fc-bg: #112D4E; --fc-surface: rgba(17, 45, 78, 0.8);
            --fc-text: #F9F7F7; --fc-muted: #DBE2EF; --fc-grid: #3F72AF;
            --fc-conn: #DBE2EF; --fc-accent: #DBE2EF;
          }
        }
        .fc-root { font-family: system-ui,-apple-system,sans-serif; box-sizing:border-box; }
        .fc-root * { box-sizing:border-box; }
        .insp-input { width:100%; padding:5px 8px; font-size:13px; border:0.5px solid var(--fc-border); border-radius:6px; background:var(--fc-surface); color:var(--fc-text); font-family:inherit; outline:none; }
        .insp-input:focus { border-color:var(--fc-accent); }
        select.insp-input { appearance:none; }
        .node-shape { transition:stroke 0.1s; }
        .node-group.is-selected .node-shape { stroke:var(--fc-accent) !important; stroke-width:2px !important; }
        .resize-handle { fill:var(--fc-accent); }
        .port-dot { fill:var(--fc-accent); stroke:var(--fc-surface); stroke-width:1.5; opacity:0; transition:opacity 0.15s; }
        .node-group:hover .port-dot { opacity:1; }
        .conn-sel { stroke:var(--fc-accent) !important; stroke-width:3px !important; filter: drop-shadow(0 0 4px rgba(63, 114, 175, 0.5)); transition:all 0.2s ease; }
        .label-group { cursor:move; }
        .tool-active { background:rgba(55,138,221,0.12) !important; color:var(--fc-accent) !important; border-color:var(--fc-accent) !important; }
        .sb-btn { display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:6px; cursor:grab; font-size:13px; color:var(--fc-text); border:0.5px solid var(--fc-border); background:var(--fc-surface); margin-bottom:5px; user-select:none; transition:background 0.12s; }
        .sb-btn:hover { background:var(--fc-bg); }
        .act-btn { padding:6px 10px; font-size:12px; border-radius:6px; border:0.5px solid var(--fc-border); background:var(--fc-surface); color:var(--fc-text); cursor:pointer; width:100%; text-align:left; margin-bottom:5px; transition:background 0.12s; }
        .act-btn:hover { background:var(--fc-bg); }
        .tb-btn { padding:4px 10px; font-size:12px; border-radius:6px; border:none; background:transparent; color:var(--fc-muted); cursor:pointer; transition:background 0.12s,color 0.12s; }
        .tb-btn:hover { background:var(--fc-bg); color:var(--fc-text); }
        input[type=range] { accent-color:var(--fc-accent); }
      `}</style>

      <div
        className="fc-root"
        style={{
          display: "flex",
          height: 620,
          border: "0.5px solid var(--fc-border)",
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--fc-surface)",
          color: "var(--fc-text)",
        }}
      >
        {/* ── Sidebar ── */}
        <div
          style={{
            width: 195,
            minWidth: 195,
            background: "var(--fc-bg)",
            borderRight: "0.5px solid var(--fc-border)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SbSection title="Shapes">
            {SHAPES.map((s) => (
              <div
                key={s.key}
                className="sb-btn"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("shape", s.key)}
              >
                {s.icon}
                <span style={{ fontSize: 12 }}>{s.label}</span>
              </div>
            ))}
          </SbSection>
          <SbSection title="Tools">
            {[
              ["select", "↖ Select"],
              ["text", "T Text label"],
            ].map(([t, l]) => (
              <button
                key={t}
                className={`act-btn${tool === t ? " tool-active" : ""}`}
                onClick={() => setToolState(t)}
              >
                {l}
              </button>
            ))}
          </SbSection>
        </div>

        {/* ── Canvas ── */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "var(--fc-surface)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 4,
              zIndex: 10,
              background: "var(--fc-surface)",
              border: "0.5px solid var(--fc-border)",
              borderRadius: 10,
              padding: "4px 6px",
            }}
          >
            {/* FIX: − zooms OUT, + zooms IN */}
            <button
              className="tb-btn"
              onClick={() => setZoom((z) => Math.max(0.2, z / 1.2))}
            >
              −
            </button>
            <span
              style={{
                fontSize: 12,
                color: "var(--fc-muted)",
                alignSelf: "center",
                minWidth: 42,
                textAlign: "center",
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              className="tb-btn"
              onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
            >
              +
            </button>
            <div
              style={{
                width: 0.5,
                background: "var(--fc-border)",
                margin: "2px 2px",
              }}
            />
            <button className="tb-btn" onClick={() => fitView()}>
              Fit
            </button>
            <button
              className="tb-btn"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
            >
              1:1
            </button>
          </div>

          <svg
            ref={svgRef}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              cursor: tool === "text" ? "text" : "default",
            }}
            onMouseDown={handleSvgMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDblClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <defs>
              <marker
                id="ah-def"
                markerWidth={8}
                markerHeight={8}
                refX={7}
                refY={3.5}
                orient="auto"
              >
                <path
                  d="M0,0.5 L7,3.5 L0,6.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
              <marker
                id="ah-sel"
                markerWidth={8}
                markerHeight={8}
                refX={7}
                refY={3.5}
                orient="auto"
              >
                <path
                  d="M0,0.5 L7,3.5 L0,6.5"
                  fill="none"
                  stroke="var(--fc-accent)"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>

            <g id="grid-layer">
              <GridDots
                panX={pan.x}
                panY={pan.y}
                zoom={zoom}
                width={canvasSize.w}
                height={canvasSize.h}
              />
            </g>

            {/* Connections */}
            <g transform={tf}>
              {connections.map((c) => (
                <ConnEl
                  key={c.id}
                  conn={c}
                  nodes={nodes}
                  isSelected={c.id === selectedConnId}
                  onClick={(id) => {
                    setSelConn(id);
                    setSelectedId(null);
                    setSelLabel(null);
                  }}
                />
              ))}
              {tempConn && (
                <path
                  d={`M${tempConn.x1},${tempConn.y1} L${tempConn.x2},${tempConn.y2}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  strokeDasharray="4,3"
                  markerEnd="url(#ah-def)"
                />
              )}
            </g>

            {/* Text labels */}
            <g transform={tf}>
              {textLabels.map((l) => (
                <TextLabelEl
                  key={l.id}
                  label={l}
                  isSelected={l.id === selectedLabelId}
                  onMouseDown={handleLabelMouseDown}
                />
              ))}
            </g>

            {/* Nodes */}
            <g transform={tf}>
              {nodes.map((n) => (
                <g key={n.id} data-nodeid={n.id}>
                  {getPortPositions(n).map((p) => (
                    <rect
                      key={p.side}
                      data-nodeid={n.id}
                      data-port={p.side}
                      x={p.px - 6}
                      y={p.py - 6}
                      width={12}
                      height={12}
                      fill="transparent"
                      style={{ pointerEvents: "all" }}
                    />
                  ))}
                  <ShapeEl
                    node={n}
                    isSelected={n.id === selectedId}
                    onMouseDown={handleNodeMouseDown}
                    onPortMouseDown={handlePortMouseDown}
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* ── Inspector ── */}
        <div
          style={{
            width: 200,
            minWidth: 200,
            background: "var(--fc-bg)",
            borderLeft: "0.5px solid var(--fc-border)",
            overflowY: "auto",
          }}
        >
          <Inspector
            selectedNode={selectedNode}
            selectedConn={selectedConn}
            selectedLabel={selectedLabel}
            onChange={updateNode}
            onConnChange={updateConn}
            onLabelChange={updateLabel}
          />
        </div>
      </div>
    </>
  );
}

function SbSection({ title, children, style }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderBottom: "0.5px solid var(--fc-border)",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--fc-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
