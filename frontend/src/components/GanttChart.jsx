import { useEffect, useState, useRef } from 'react';
import './styles/GanttChart.css';

// Vibrant color palette for process differentiation
const COLORS = [
  '#6366f1', // Indigo
  '#f43f5e', // Rose
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#ff6b35', // Orange
  '#84cc16', // Lime
  '#e879f9', // Fuchsia
  '#38bdf8', // Sky
  '#facc15', // Yellow
  '#fb923c', // Light Orange
  '#34d399', // Emerald
  '#c084fc'  // Violet
];

const IDLE_COLOR = '#374151';

function getColorForProcess(processId, colorMap) {
  if (processId === 'Idle') return IDLE_COLOR;
  if (!colorMap.current.has(processId)) {
    colorMap.current.set(processId, COLORS[colorMap.current.size % COLORS.length]);
  }
  return colorMap.current.get(processId);
}

function GanttChart({ ganttChart, title, animate = true, compact = false }) {
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : ganttChart.length);
  const colorMap = useRef(new Map());
  const containerRef = useRef(null);

  const totalTime = ganttChart.length > 0
    ? ganttChart[ganttChart.length - 1].end - ganttChart[0].start
    : 0;
  const startOffset = ganttChart.length > 0 ? ganttChart[0].start : 0;

  // Reset animation when ganttChart changes
  useEffect(() => {
    if (!animate) {
      setVisibleCount(ganttChart.length);
      return;
    }
    setVisibleCount(0);
    colorMap.current = new Map();

    // Stagger each block appearing
    const baseDelay = Math.max(80, 600 / ganttChart.length);
    const timers = ganttChart.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), baseDelay * (i + 1))
    );

    return () => timers.forEach(clearTimeout);
  }, [ganttChart, animate]);

  // Auto-scroll to latest block
  useEffect(() => {
    if (containerRef.current && visibleCount > 0) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [visibleCount]);

  if (!ganttChart || ganttChart.length === 0) {
    return <div className="gantt-empty">No Gantt chart data</div>;
  }

  // Collect unique time markers
  const timeMarkers = new Set();
  ganttChart.forEach((seg) => {
    timeMarkers.add(seg.start);
    timeMarkers.add(seg.end);
  });
  const sortedMarkers = [...timeMarkers].sort((a, b) => a - b);

  return (
    <div className={`gantt-wrapper ${compact ? 'gantt-compact' : ''}`}>
      {title && <h3 className="gantt-title">{title}</h3>}

      {/* Legend */}
      <div className="gantt-legend">
        {[...new Set(ganttChart.map((s) => s.processId).filter((id) => id !== 'Idle'))].map((pid) => (
          <div key={pid} className="legend-item">
            <span className="legend-color" style={{ background: getColorForProcess(pid, colorMap) }} />
            <span className="legend-label">{pid}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="gantt-scroll" ref={containerRef}>
        <div className="gantt-chart" style={{ minWidth: Math.max(totalTime * 60, 400) }}>
          {/* Bars */}
          <div className="gantt-bars">
            {ganttChart.map((seg, i) => {
              const width = ((seg.end - seg.start) / totalTime) * 100;
              const color = getColorForProcess(seg.processId, colorMap);
              const isVisible = i < visibleCount;

              return (
                <div
                  key={`${seg.processId}-${seg.start}-${i}`}
                  className={`gantt-block ${isVisible ? 'visible' : ''} ${seg.processId === 'Idle' ? 'idle' : ''}`}
                  style={{
                    width: `${width}%`,
                    backgroundColor: color,
                    animationDelay: animate ? `${i * 0.08}s` : '0s'
                  }}
                  title={`${seg.processId}: ${seg.start} - ${seg.end}`}
                >
                  <span className="block-label">
                    {seg.processId === 'Idle' ? 'Idle' : seg.processId}
                  </span>
                  <span className="block-duration">{seg.end - seg.start}</span>
                </div>
              );
            })}
          </div>

          {/* Time axis */}
          <div className="gantt-axis">
            {sortedMarkers.map((t) => {
              const left = ((t - startOffset) / totalTime) * 100;
              return (
                <div
                  key={t}
                  className="axis-marker"
                  style={{ left: `${left}%` }}
                >
                  <div className="axis-tick" />
                  <span className="axis-label">{t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GanttChart;
