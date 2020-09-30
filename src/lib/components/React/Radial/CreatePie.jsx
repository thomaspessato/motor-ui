/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo, useEffect } from "react";
import ChartProvider from "../visx/components/providers/ChartProvider";
import XYChart from "../visx/components/XYChart";
import ChartPattern from "../visx/components/ChartPattern";
import EventProvider from "../visx/components/providers/TooltipProvider";
import Tooltip from "../visx/components/Tooltip";
import Legend from "../visx/components/Legend";
import CustomLegendShape from "../visx/components/CustomLegendShape";
import Title from "../visx/components/titles/Title";
import ChartBackground from "../visx/components/aesthetic/Gradient";
import { timeParse, timeFormat } from "d3-time-format";

import { roundNumber } from "../visx/utils/roundNumber";
import { PatternLines } from "../visx/components/aesthetic/Patterns";
import { colorByExpression, selectColor } from "../../../utils";
import { valueIfUndefined, isDefined } from "../visx/utils/chartUtils";

const legendLabelFormat = (d) => d;

const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };

export default function CreatePie({
  width,
  height,
  events = false,
  data,
  keys,
  dataKeys,
  qLayout: {
    qHyperCube,
    qHyperCube: { qMeasureInfo: measureInfo, qDimensionInfo: dimensionInfo },
  },
  beginSelections,
  select,
  setCurrentSelectionIds,
  currentSelectionIds,
  theme,
  padding,
  colorPalette,
  type,
  size,
  renderHorizontally,
  includeZero,
  xAxisOrientation,
  showLegend,
  legendLeftRight,
  legendTopBottom,
  legendDirection,
  legendShape,
  backgroundPattern,
  backgroundStyle,
  fillStyle,
  showLabels,
  showPoints,
  dualAxis,
  roundNum,
  precision,
  selectionMethod,
  enableBrush,
  showBrush,
  showAsPercent,
  singleMeasure,
  singleDimension,
  dimensionCount,
  measureCount,
  title,
  subTitle,
  legendLabelStyle,
  valueLabelStyle,
  showClosestItem,
  useSingleColor,
  parseDateFormat,
  formatAxisDate,
  formatTooltipDate,
  strokeWidth,
  showTooltip,
  snapToDataX,
  snapToDataY,
  shiftTooltipTop,
  shiftTooltipLeft,
  valueOnly,
  valueWithText,
}) {
  // const showTitles = true; // resize height of chart if title shown
  const getChartType = () =>
    type ? type : singleDimension && singleMeasure ? "bar" : "groupedbar";

  const chartType = [getChartType()];

  const [currData, setCurrData] = useState(data);

  //  const formatDate = timeFormat("%d %B, %Y");
  const formatDate = timeFormat(formatAxisDate);

  const dateFormatter = (d) => formatDate(timeParse(parseDateFormat)(d));

  const getDimension = (d) => d[0].qText;
  const getSeriesValues = (d, colIndex) =>
    isDefined(d[colIndex]) ? Number(d[colIndex].qNum) : 0;
  const getElementNumber = (d) => d[0].qElemNumber;

  /** memoize the accessor functions to prevent re-registering data. */
  function useAccessors(valueAccessor, column, renderHorizontally) {
    return useMemo(
      () => ({
        xAccessor: (d) =>
          renderHorizontally ? valueAccessor(d, column) : getDimension(d),
        yAccessor: (d) =>
          renderHorizontally ? getDimension(d) : valueAccessor(d, column),
        elAccessor: (d) => getElementNumber(d),
      }),
      [renderHorizontally, valueAccessor]
    );
  }

  const canSnapTooltipToDataX = valueIfUndefined(
    snapToDataX,
    (chartType.includes("groupedbar") && renderHorizontally) ||
      (chartType.includes("stackedbar") && !renderHorizontally) ||
      (chartType.includes("combo") && !renderHorizontally) ||
      chartType.includes("bar")
  );

  const canSnapTooltipToDataY = valueIfUndefined(
    snapToDataY,
    (chartType.includes("groupedbar") && !renderHorizontally) ||
      (chartType.includes("stackedbar") && renderHorizontally) ||
      (chartType.includes("combo") && !renderHorizontally) ||
      chartType.includes("bar")
  );

  useEffect(() => {
    setCurrData(data);
  }, [data]);

  const dateScaleConfig = useMemo(() => ({ type: "band", padding }), []);

  const valueScaleConfig = useMemo(
    () => ({
      type: "linear",
      clamp: true,
      nice: true,
      domain: undefined,
      includeZero,
    }),
    [includeZero]
  );

  const colorScaleConfig = useMemo(
    () => ({
      domain: dataKeys ? dataKeys : measureInfo.map((d) => d.qFallbackTitle),
    }),
    [chartType]
  );

  const dataAccessors =
    dimensionCount <= 1
      ? measureInfo.map((measure, index) =>
          useAccessors(
            getSeriesValues,
            dimensionCount + index,
            renderHorizontally
          )
        )
      : keys.map((measure, index) =>
          useAccessors(
            getSeriesValues,
            dimensionCount - 1 + index,
            renderHorizontally
          )
        );

  // Check if conditionalColors and if so get the returned color pallette
  const colors = colorByExpression(qHyperCube, data, colorPalette);

  const { xyChart } = theme;

  const themeObj = {
    ...theme.xyChart,
    colors,
  };

  const legend = showLegend ? (
    <Legend
      labelFormat={legendLabelFormat}
      alignLeft={legendLeftRight === "left"}
      direction={legendDirection}
      shape={
        legendShape === "auto"
          ? undefined
          : legendShape === "custom"
          ? CustomLegendShape
          : legendShape
      }
    />
  ) : null;

  const formatValue = (val) => {
    // if (val === 0) return roundNumber(Math.abs(val), 0);

    const valPrecision = valueIfUndefined(precision, xyChart.precision);
    const valRoundNum = valueIfUndefined(roundNum, xyChart.roundNum);

    if (showAsPercent) return `${(val * 100).toFixed(valPrecision ? 2 : 0)}%`;
    let formattedValue = valRoundNum
      ? roundNumber(Math.abs(val), valPrecision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  return (
    // <div className="container">

    <ChartProvider
      theme={themeObj}
      chartType={chartType}
      xScale={renderHorizontally ? valueScaleConfig : dateScaleConfig}
      yScale={renderHorizontally ? dateScaleConfig : valueScaleConfig}
      colorScale={colorScaleConfig}
      showLabels={valueIfUndefined(showLabels, xyChart.showLabels)}
      showPoints={valueIfUndefined(showPoints, xyChart.showPoints)}
      roundNum={valueIfUndefined(roundNum, xyChart.roundNum)}
      precision={valueIfUndefined(precision, xyChart.precision)}
      size={size}
      dimensionInfo={dimensionInfo}
      measureInfo={measureInfo}
      dataKeys={dataKeys}
      beginSelections={beginSelections}
      select={select}
      setCurrentSelectionIds={setCurrentSelectionIds}
      currentSelectionIds={currentSelectionIds}
      singleDimension={singleDimension}
      singleMeasure={singleMeasure}
      formatValue={formatValue}
      legendLabelStyle={legendLabelStyle}
      valueLabelStyle={valueLabelStyle}
      parseDateFormat={parseDateFormat}
      formatTooltipDate={formatTooltipDate}
    >
      <EventProvider>
        {title && <Title title={title} subTitle={subTitle} size={size} />}
        {legendTopBottom === "top" && legend}
        <div
          className="container"
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <XYChart
            height={height}
            // width={autoWidth ? undefined : width}
            margin={
              xAxisOrientation === "top" ? axisTopMargin : axisBottomMargin
            }
            dualAxis={dualAxis}
            captureEvents={selectionMethod === "none"}
            onMouseDown={selectionMethod === "brush" ? enableBrush : null}
          >
            <ChartBackground
              style={backgroundStyle.style}
              id="area-background-gradient"
              from={backgroundStyle.styleFrom}
              to={backgroundStyle.styleTo}
            />
            <ChartPattern backgroundPattern={backgroundPattern} />
            {showBrush && (
              <PatternLines
                id="brush_pattern"
                height={xyChart?.brush.patternHeight ?? 12}
                width={xyChart?.brush.patternWidth ?? 12}
                stroke={
                  selectColor(xyChart?.brush.patternStroke, theme) ?? "#a3daff"
                }
                strokeWidth={1}
                orientation={["diagonal"]}
              />
            )}
          </XYChart>
          {showTooltip && (
            <Tooltip
              snapToDataX={canSnapTooltipToDataX}
              snapToDataY={canSnapTooltipToDataY}
              showClosestItem={valueIfUndefined(
                showClosestItem,
                xyChart.tooltip.showClosestItem
              )}
              valueOnly={valueIfUndefined(valueOnly, xyChart.tooltip.valueOnly)}
              valueWithText={valueIfUndefined(
                valueWithText,
                xyChart.tooltip.valueWithText
              )}
              shiftTooltipTop={shiftTooltipTop}
              shiftTooltipLeft={shiftTooltipLeft}
              useSingleColor={valueIfUndefined(
                useSingleColor,
                xyChart.tooltip.useSingleColor
              )}
            />
          )}
          {legendTopBottom === "bottom" && legend}
        </div>
      </EventProvider>
    </ChartProvider>
  );
}
