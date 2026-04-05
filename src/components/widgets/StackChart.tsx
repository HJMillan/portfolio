import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import type { LanguageStat } from '@/types';

interface StackChartProps {
  readonly languages: LanguageStat[];
  readonly loading: boolean;
}

export function StackChart({ languages, loading }: StackChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <Card padding="lg">
        <Skeleton height="14px" width="40%" className="mb-4" />
        <Skeleton height="200px" className="rounded-full mx-auto" width="200px" />
      </Card>
    );
  }

  // Take top 8 languages, group rest as "Otros"
  const top = languages.slice(0, 8);
  const rest = languages.slice(8);
  const data =
    rest.length > 0
      ? [
          ...top,
          {
            language: 'Otros',
            bytes: rest.reduce((a, b) => a + b.bytes, 0),
            percentage: rest.reduce((a, b) => a + b.percentage, 0),
            color: '#6B7280',
          },
        ]
      : top;

  const SIZE = 200;
  const CENTER = SIZE / 2;
  const RADIUS = 80;
  const INNER_RADIUS = 50;
  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Stack Tecnológico
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* SVG Donut Chart */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative">
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="transform -rotate-90"
            >
              {data.map((entry, index) => {
                const { offset, dashArray } = getSegment(data, index, RADIUS);
                const isHovered = hoveredIndex === index;
                return (
                  <circle
                    key={entry.language}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={entry.color}
                    strokeWidth={RADIUS - INNER_RADIUS}
                    strokeDasharray={dashArray}
                    strokeDashoffset={offset}
                    className="transition-opacity duration-200"
                    style={{
                      opacity: hoveredIndex === null || isHovered ? 1 : 0.35,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {hovered ? (
                <>
                  <span className="text-xs font-semibold text-text-primary font-mono">
                    {hovered.percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    {hovered.language}
                  </span>
                </>
              ) : (
                <span className="text-xs text-text-muted font-mono">
                  {data.length} langs
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-2">
          {data.map((lang, index) => (
            <div
              key={lang.language}
              className="flex items-center justify-between text-xs group cursor-default"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-text-secondary group-hover:text-text-primary transition-colors font-mono">
                  {lang.language}
                </span>
              </div>
              <span className="text-text-muted font-mono">
                {lang.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Calculate SVG stroke-dasharray and stroke-dashoffset for a donut segment.
 */
function getSegment(
  data: LanguageStat[],
  index: number,
  radius: number
): { dashArray: string; offset: number } {
  const circumference = 2 * Math.PI * radius;
  const percentage = data[index].percentage;
  const segmentLength = (percentage / 100) * circumference;
  const gapLength = circumference - segmentLength;

  // Calculate offset: sum of all previous segments' percentages
  let previousPercentages = 0;
  for (let i = 0; i < index; i++) {
    previousPercentages += data[i].percentage;
  }
  const offset = -(previousPercentages / 100) * circumference;

  return {
    dashArray: `${segmentLength} ${gapLength}`,
    offset,
  };
}
