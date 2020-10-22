import React, { useRef, useEffect, useState } from "react";
import useHyperCube from "../../hooks/useHyperCube";
import useOutsideClick from "../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import {
  XYChartWrapper,
  XYChartWrapperNoData,
  XYChartNoDataContent,
} from "./XYChartTheme";
import Spinner from "../Spinner";
import CreateXYChart from "./CreateXYChart";

import ParentSize from "@visx/responsive/lib/components/ParentSize";
// import { ParentSize } from "@visx/responsive";

import {
  numericSortDirection,
  isEmpty,
  validData,
  isNull,
  createColorArray,
} from "../../utils";

// import { valueIfUndefined, isDefined } from "../visx/utils/chartUtils";
import { XYChart } from "../visx";

let measureCount = null;
let dimensionCount = null;
let singleDimension = null;
let singleMeasure = null;
let dataKeys = null;
let keys = [];
// let dimensionTicks = null;

function StyledXYChart(props) {
  // Ref for d3 object
  // const d3Container = useRef(null);
  // const ref = useRef();
  // const [currentSelectionIds, setCurrentSelectionIds] = useState([]);
  // const [calcCond, setCalcCond] = useState(null);
  // const [dataError, setDataError] = useState(null);
  // const [isValid, setIsValid] = useState(null);
  // const [data, setData] = useState(null);

  // const [showBrush, setShowBrush] = useState(false);
  // const enableBrush = () => setShowBrush(true);

  // // props
  // const {
  //   engine,
  //   engineError,
  //   theme,
  //   cols,
  //   width,
  //   height,
  //   events,
  //   margin,
  //   size,
  //   border,
  //   borderRadius,
  //   backgroundColor,
  //   colorTheme,
  //   showLegend,
  //   selectionMethod,
  //   sortDirection,
  //   sortOrder,
  //   calcCondition,
  //   suppressZero,
  //   suppressMissing,
  //   otherTotalSpec,
  //   // tickSpacing,
  //   gridArea,
  //   type,
  //   padding,
  //   useAnimatedAxes,
  //   autoWidth,
  //   renderHorizontally,
  //   includeZero,
  //   backgroundPattern,
  //   backgroundStyle,
  //   multiColor,
  //   fillStyle,
  //   showBoxShadow,
  //   showAsPercent,
  //   numDimensionTicks,
  //   ...rest
  // } = props;

  // const {
  //   global: { colorTheme: globalColorTheme, chart },
  // } = theme;

  // // if the prop is undefined, use the base theme
  // const colorPalette = createColorArray(colorTheme || globalColorTheme, theme);

  // const refMargin = "10px";

  // // retrieve XYChart data from HyperCube
  // const {
  //   beginSelections,
  //   endSelections,
  //   qLayout,
  //   qData,
  //   selections,
  //   select,
  // } = useHyperCube({
  //   engine,
  //   cols,
  //   qSortByNumeric: numericSortDirection(sortDirection, -1),
  //   qSortByAscii: numericSortDirection(sortDirection, 1),
  //   qInterColumnSortOrder: sortOrder,
  //   qCalcCondition: calcCondition,
  //   qSuppressZero: suppressZero || chart.suppressZero,
  //   qSuppressMissing: suppressMissing || chart.suppressMissing,
  //   qOtherTotalSpec: otherTotalSpec || chart.otherTotalSpec,
  // });

  // const cancelCallback = () => {
  //   endSelections(false);
  //   setCurrentSelectionIds([]);
  //   setShowBrush(false);
  // };

  // const confirmCallback = async () => {
  //   await endSelections(true);
  //   setCurrentSelectionIds([]);
  //   setShowBrush(false);
  // };

  // useOutsideClick(ref, () => {
  //   if (
  //     event.target.classList.contains("cancelSelections") ||
  //     event.target.parentNode.classList.contains("cancelSelections")
  //   )
  //     return;
  //   if (!isEmpty(currentSelectionIds)) {
  //     const outsideClick = !ref.current.contains(event.target);
  //     if (outsideClick && selections) confirmCallback();
  //   }
  // });

  // const handleResize = () => {
  //   if (typeof calcCond === "undefined" && dataError.length === 0) {
  //     // CreateXYChart({ ...chartSettings, screenWidth: ref.current.offsetWidth });
  //   }
  // };

  // useEffect(() => {
  //   let valid;
  //   if (qLayout) {
  //     // setObjId(qLayout.qInfo.qId);
  //     setCalcCond(qLayout.qHyperCube.qCalcCondMsg);
  //     valid = validData(qLayout, theme);
  //     if (valid) {
  //       setIsValid(valid.isValid);
  //       setDataError(valid.dataError);
  //     }
  //   }

  //   // window.addEventListener("resize", handleResize);

  //   // return () => {
  //   //   window.removeEventListener("resize", handleResize);
  //   // qData && data && console.log(qData.qMatrix.length, data.length);
  //   // qData && setData(qData);

  //   if (
  //     // (qData && data === null) ||
  //     // (qData && data && qData.qMatrix.length !== data.length && isValid)
  //     (qData && data === null) ||
  //     (qData && data && isValid)
  //   ) {
  //     dimensionCount = qLayout.qHyperCube.qDimensionInfo.length;
  //     measureCount = qLayout.qHyperCube.qMeasureInfo.length;
  //     singleDimension = dimensionCount === 1;
  //     singleMeasure = measureCount === 1;

  //     let series = [];
  //     let dimID = null;
  //     let items = [];
  //     // let keys = [];

  //     if (!singleDimension && !type.includes("scatter")) {
  //       qData.qMatrix.forEach((d, i) => {
  //         if (isNull(dimID)) {
  //           dimID = d[0].qText;
  //           series.push(d[0]);
  //         }

  //         if (dimID !== d[0].qText) {
  //           items.push(series);
  //           series = [];
  //           series.push(d[0]);
  //           dimID = d[0].qText;
  //         }
  //         const measure = d[1];
  //         measure.qNum = isDefined(d[2]) ? d[2].qNum : 0;
  //         if (!keys.includes(measure.qText)) {
  //           keys.push(measure.qText);
  //         }
  //         series.push(measure);
  //       });

  //       items.push(series);
  //     }

  //     dataKeys =
  //       singleDimension && singleMeasure && type === "bar"
  //         ? qData.qMatrix.map((d) => d[0].qText)
  //         : !singleDimension
  //         ? keys
  //         : null;

  //     // dimensionTicks = Math.min(
  //     //   numDimensionTicks ||
  //     //     (singleDimension ? qData.qMatrix.length : items.length),
  //     //   singleDimension ? qData.qMatrix.length : items.length
  //     // );

  //     if (showAsPercent) {
  //       const percentageData = singleDimension ? qData.qMatrix : items;
  //       const keyItems = singleDimension
  //         ? qLayout.qHyperCube.qMeasureInfo
  //         : keys;

  //       percentageData.forEach((d, i) => {
  //         let positiveSum = 0;
  //         let negativeSum = 0;
  //         keyItems.forEach((m, mi) => {
  //           const value = d[mi + 1].qNum;
  //           value >= 0 ? (positiveSum += value) : (negativeSum += value);
  //         });
  //         keyItems.forEach((m, mi) => {
  //           const value = d[mi + 1].qNum;
  //           d[mi + 1].qNum =
  //             Math.abs(value) / (value >= 0 ? positiveSum : negativeSum);
  //         });
  //       });
  //     }

  //     setData(singleDimension ? qData.qMatrix : items);
  //   }
  // }, [qData, isValid]);

  return (
    <>
      <ParentSize>
        {({ width, height }) => <CreateXYChart width={width} height={height} />}
      </ParentSize>
    </>
  );
}

export default StyledXYChart;