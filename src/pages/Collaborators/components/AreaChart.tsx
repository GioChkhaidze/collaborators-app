import { useState, useRef } from 'react';
import type { DailyDataPoint } from '../types';

interface AreaChartProps {
  data: DailyDataPoint[];
  dataKey: 'clicks' | 'orders';
  color: string;
  gradientId?: string;
  height?: number;
  showLabels?: boolean;
  showDots?: boolean;
  showSecondary?: boolean;
}

// Smooth bezier curve helper
function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    
    // Catmull-Rom to Bezier conversion
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  return path;
}

export const AreaChart = ({ 
  data, 
  dataKey, 
  color, 
  gradientId = 'areaGradient',
  height = 200,
  showLabels = true,
  showDots = true,
  showSecondary = false,
}: AreaChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<number | null>(null);

  if (!data.length) return null;

  const values = data.map(d => d[dataKey]);
  const secondaryValues = data.map(d => d.orders);
  const allValues = showSecondary ? [...values, ...secondaryValues] : values;
  const max = Math.max(...allValues, 1);
  const min = 0;
  const range = max - min || 1;

  const padding = { top: 15, right: 5, bottom: 25, left: 25 };
  const chartWidth = 200;
  const chartHeight = 80;

  const points = values.map((value, index) => {
    const x = padding.left + (index / Math.max(values.length - 1, 1)) * (chartWidth - padding.left - padding.right);
    const y = padding.top + (1 - (value - min) / range) * (chartHeight - padding.top - padding.bottom);
    return { x, y, value };
  });

  const secondaryPoints = secondaryValues.map((value, index) => {
    const x = padding.left + (index / Math.max(secondaryValues.length - 1, 1)) * (chartWidth - padding.left - padding.right);
    const y = padding.top + (1 - (value - min) / range) * (chartHeight - padding.top - padding.bottom);
    return { x, y, value };
  });

  // Handle point hover to show tooltip
  const handlePointHover = (index: number) => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear any pending fade-out timeout
    if (tooltipTimeoutRef.current !== null) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }

    const svg = svgRef.current;
    const container = containerRef.current;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    // Show tooltip for hovered point
    setHoveredIndex(index);
    
    // Convert the point's SVG coordinates to screen coordinates
    const point = points[index];
    const pointScreen = svg.createSVGPoint();
    pointScreen.x = point.x;
    pointScreen.y = point.y;
    const screenPoint = pointScreen.matrixTransform(ctm);
    
    const containerRect = container.getBoundingClientRect();
    
    // Calculate tooltip position relative to container
    const tooltipX = screenPoint.x - containerRect.left;
    const tooltipY = screenPoint.y - containerRect.top - 45; // Position above the point
    
    setTooltipPosition({ x: tooltipX, y: tooltipY });
    
    // Trigger fade-in animation
    requestAnimationFrame(() => {
      setIsTooltipVisible(true);
    });
  };

  // Close tooltip when mouse leaves the point
  const handlePointLeave = () => {
    // Start fade-out animation
    setIsTooltipVisible(false);
    
    // Delay unmounting to allow fade-out animation to complete
    tooltipTimeoutRef.current = window.setTimeout(() => {
      setHoveredIndex(null);
      setTooltipPosition(null);
      tooltipTimeoutRef.current = null;
    }, 200); // Match animation duration
  };

  const linePath = createSmoothPath(points);
  const secondaryLinePath = createSmoothPath(secondaryPoints);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;
  const secondaryAreaPath = `${secondaryLinePath} L ${secondaryPoints[secondaryPoints.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  // Show only a few labels - spread evenly
  const labelCount = 6;
  const labelIndices = data.length <= labelCount 
    ? data.map((_, i) => i) 
    : Array.from({ length: labelCount }, (_, i) => Math.floor(i * (data.length - 1) / (labelCount - 1)));

  // Y-axis values
  const yAxisValues = [0, Math.round(max * 0.5), Math.round(max)];

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ height }}
    >
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        preserveAspectRatio="none" 
        className="w-full h-full"
      >
      <defs>
        {/* Primary gradient - horizontal warm gradient */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB800" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FF6B6B" stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.25" />
        </linearGradient>
        {showSecondary && (
          <linearGradient id={`${gradientId}-secondary`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
          </linearGradient>
        )}
      </defs>

      {/* Grid lines - horizontal */}
      {[0, 0.5, 1].map((ratio, i) => {
        const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
        return (
          <line
            key={i}
            x1={padding.left}
            y1={y}
            x2={chartWidth - padding.right}
            y2={y}
            stroke="#f0f0f0"
            strokeWidth="0.3"
          />
        );
      })}

      {/* Y-axis labels */}
      {yAxisValues.map((value, i) => {
        const y = padding.top + (1 - value / max) * (chartHeight - padding.top - padding.bottom);
        return (
          <text
            key={i}
            x={padding.left - 4}
            y={y + 2}
            textAnchor="end"
            fill="#9ca3af"
            style={{ fontSize: '5px', fontFamily: 'system-ui' }}
          >
            {value}
          </text>
        );
      })}

      {/* Secondary Area + Line (if enabled) - draw first so primary is on top */}
      {showSecondary && (
        <>
          <path 
            d={secondaryAreaPath} 
            fill={`url(#${gradientId}-secondary)`}
            key={`sec-area-${data.length}`}
            style={{
              transition: 'd 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <path
            d={secondaryLinePath}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            key={`sec-line-${data.length}`}
            style={{
              transition: 'd 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </>
      )}

      {/* Primary Area */}
      <path 
        d={areaPath} 
        fill={`url(#${gradientId})`}
        key={`area-${data.length}`}
        style={{
          transition: 'd 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      
      {/* Primary Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        key={`line-${data.length}`}
        style={{
          transition: 'd 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* All interactive points on primary line */}
      {showDots && points.map((point, index) => {
        const isSelected = hoveredIndex === index;
        return (
          <circle
            key={`point-${index}-${data.length}`}
            cx={point.x}
            cy={point.y}
            r={isSelected ? "3" : "2"}
            fill={isSelected ? "#E31837" : "white"}
            stroke="#E31837"
            strokeWidth={isSelected ? "2" : "1"}
            className="cursor-pointer"
            style={{
              transition: 'r 0.2s ease-out, fill 0.2s ease-out, stroke-width 0.2s ease-out',
            }}
            onMouseEnter={() => handlePointHover(index)}
            onMouseLeave={handlePointLeave}
          />
        );
      })}

      {/* All interactive points on secondary line */}
      {showSecondary && showDots && secondaryPoints.map((point, index) => {
        const isSelected = hoveredIndex === index && showSecondary;
        return (
          <circle
            key={`sec-point-${index}-${data.length}`}
            cx={point.x}
            cy={point.y}
            r={isSelected ? "3" : "2"}
            fill={isSelected ? "#E31837" : "white"}
            stroke="#E31837"
            strokeWidth={isSelected ? "2" : "1"}
            className="cursor-pointer"
            style={{
              transition: 'r 0.2s ease-out, fill 0.2s ease-out, stroke-width 0.2s ease-out',
            }}
            onMouseEnter={() => handlePointHover(index)}
            onMouseLeave={handlePointLeave}
          />
        );
      })}

      {/* Vertical indicator line at selected point */}
      {hoveredIndex !== null && (
        <line
          x1={points[hoveredIndex].x}
          y1={padding.top}
          x2={points[hoveredIndex].x}
          y2={chartHeight - padding.bottom}
          stroke="#E31837"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.4"
          className="pointer-events-none"
        />
      )}


      {/* X-axis labels */}
      {showLabels && labelIndices.map((idx) => (
        <text
          key={idx}
          x={points[idx].x}
          y={chartHeight - padding.bottom + 8}
          textAnchor="middle"
          fill="#9ca3af"
          style={{ fontSize: '4.5px', fontFamily: 'system-ui' }}
        >
          {data[idx].date}
        </text>
      ))}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && tooltipPosition && (
        <div
          className="absolute pointer-events-none z-50 bg-white border border-snoonu-red rounded-lg shadow-lg p-2.5 min-w-[140px] transition-all duration-200 ease-out"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: isTooltipVisible 
              ? 'translateX(-50%) translateY(-8px) scale(1)' 
              : 'translateX(-50%) translateY(-4px) scale(0.95)',
            opacity: isTooltipVisible ? 1 : 0,
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          }}
        >
          {/* Tooltip arrow */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #E31837',
            }}
          />
          
          <div className="text-[10px] font-semibold text-snoonu-red mb-2 pb-1.5 border-b border-gray-100">
            {data[hoveredIndex].date}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-gray-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-snoonu-red"></span>
                Clicks
              </span>
              <span className="text-xs font-bold text-gray-900">{data[hoveredIndex].clicks}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-gray-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Orders
              </span>
              <span className="text-xs font-bold text-gray-900">{data[hoveredIndex].orders}</span>
            </div>
            {data[hoveredIndex].clicks > 0 && (
              <div className="flex items-center justify-between gap-3 pt-1.5 border-t border-gray-100">
                <span className="text-[10px] text-gray-600">Conversion</span>
                <span className="text-xs font-bold text-snoonu-red">
                  {((data[hoveredIndex].orders / data[hoveredIndex].clicks) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
