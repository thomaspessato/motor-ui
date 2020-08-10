import React, { useMemo } from "react";
import { BarGroup } from "@vx/shape";
import { Group } from "@vx/group";
import { GradientTealBlue } from "@vx/gradient";
import letterFrequency, {
  LetterFrequency,
} from "@vx/mock-data/lib/mocks/letterFrequency";
import { scaleBand, scaleLinear } from "@vx/scale";

const data = letterFrequency.slice(5);
const verticalMargin = 120;

// accessors
const getLetter = (d: LetterFrequency) => d.letter;
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100;

export type BarGroupProps = {
  width: number;
  height: number;
  events?: boolean;
};

export default function Example({
  width,
  height,
  events = false,
}: BarGroupProps) {
  // bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getLetter),
        padding: 0.4,
      }),
    [xMax]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getLetterFrequency))],
      }),
    [yMax]
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <GradientTealBlue id="teal" />
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const letter = getLetter(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(getLetterFrequency(d));
          const barX = xScale(letter);
          const barY = yMax - barHeight;
          return (
            <BarGroup
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(23, 233, 217, .5)"
              onClick={() => {
                if (events)
                  alert(`clicked: ${JSON.stringify(Object.values(d))}`);
              }}
            />
          );
        })}
      </Group>
    </svg>
  );
}