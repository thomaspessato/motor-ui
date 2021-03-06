// components
export { default as AnimatedAxis } from "./components/axis/AnimatedAxis";
export { default as AnimatedGrid } from "./components/grid/AnimatedGrid";
export { default as Axis } from "./components/axis/Axis";
export { default as Grid } from "./components/grid/Grid";
export { default as Tooltip } from "./components/tooltip/Tooltip";
export { default as XYChart } from "./components/XYChart";
// export { default as Pie } from "./components/Pie";
export { default as Title } from "./components/titles/Title";

// series components
export { default as AreaSeries } from "./components/series/AreaSeries";
export { default as BarGroup } from "./components/series/BarGroup";
export { default as BarSeries } from "./components/series/BarSeries";
export { default as BarStack } from "./components/series/BarStack";
export { default as GlyphSeries } from "./components/series/GlyphSeries";
export { default as LineSeries } from "./components/series/LineSeries";

// animated series components
export { default as AnimatedAreaSeries } from "./components/series/AnimatedAreaSeries";
export { default as AnimatedBarSeries } from "./components/series/AnimatedBarSeries";
export { default as AnimatedBarStack } from "./components/series/AnimatedBarStack";
export { default as AnimatedBarGroup } from "./components/series/AnimatedBarGroup";
// export { default as AnimatedGlyphSeries } from "./components/series/AnimatedGlyphSeries";
export { default as AnimatedLineSeries } from "./components/series/AnimatedLineSeries";

// Legend
export { default as Legend } from "./components/legend/Legend";

// Brush
export { default as Brush } from "./components/brush/Brush";

// context
export { default as DataContext } from "./context/DataContext";
export { default as EventEmitterContext } from "./context/EventEmitterContext";
// export { default as ThemeContext } from "./context/ThemeContext";
export { default as TooltipContext } from "./context/TooltipContext";

// providers
export { default as DataProvider } from "./providers/DataProvider";
export { default as EventEmitterProvider } from "./providers/EventEmitterProvider";
// export { default as ThemeProvider } from "./providers/ThemeProvider";
export { default as TooltipProvider } from "./providers/TooltipProvider";

// hooks
export { default as useEventEmitter } from "./hooks/useEventEmitter";

// themes
// export { default as lightTheme } from "./theme/themes/light";
// export { default as darkTheme } from "./theme/themes/dark";
export { chartTheme } from "./theme/themes/theme";
export { default as buildChartTheme } from "./theme/buildChartTheme";
// export { allColors, grayColors, defaultColors } from "./theme/colors";

// types
export * from "./types";
