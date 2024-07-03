import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts";

// Extended mock data points (every 5 minutes)
const generateMockData = (start: number, length: number): number[] =>
  Array.from({ length }, (_, i) => start - i * 5);

// Initial premium data to swivel between the lines
const initialUData = [
  6300, 6250, 6200, 6150, 6100, 6050, 6000, 5950, 5900, 5850, 5800, 5750, 5700,
  5650, 5600, 5550, 5500, 5450, 5400, 5350, 5300, 5250, 5200, 5150, 5100, 5050,
  5000, 4950, 4900, 4850, 4800, 4750, 4700, 4650, 4600, 4550, 4500, 4450, 4400,
  4350, 4300, 4250, 4200, 4150, 4100, 4050, 4000, 3950, 3900, 3850, 3800, 3750,
  3700, 3650, 3600, 3550, 3500, 3450, 3400, 3350, 3300, 3250, 3200, 3150, 3100,
  3050, 3000, 2950, 2900, 2850, 2800, 2750, 2700, 2650, 2600, 2550, 2500, 2450,
  2400, 2350, 2300, 2250, 2200, 2150, 2100, 2050, 2000, 1950, 1900, 1850, 1800,
  1750, 1700, 1650, 1600, 1550, 1500, 1450, 1400, 1350, 1300, 1250, 1200,
];
const initialPData = [
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
  6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300, 6300,
];

const generateXLabels = (length: number): string[] =>
  Array.from({ length }, (_, i) =>
    new Date(2024, 6, 1, 13, 35 + i * 5).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

const xLabels = generateXLabels(100);

const generateStraightLine = (
  start: number,
  end: number,
  length: number
): number[] =>
  Array.from({ length }, (_, i) => start + ((end - start) / (length - 1)) * i);

const pct10Line: number[] = generateStraightLine(6300, 5900, xLabels.length);
const pct50Line: number[] = generateStraightLine(6300, 5500, xLabels.length);
const pct90Line: number[] = generateStraightLine(6300, 4800, xLabels.length);

const minValue = Math.min(...pct10Line, ...pct50Line, ...pct90Line);

const UnderlyingIndex: React.FC = () => {
  const [uData, setUData] = useState<number[]>([]);
  const [pData, setPData] = useState<number[]>([]);
  const [dataIndex, setDataIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUData((prevData) => {
        const newData = [
          ...prevData,
          initialUData[dataIndex % initialUData.length],
        ];
        return newData;
      });

      setPData((prevData) => {
        let newData = [];
        if (prevData.length < xLabels.length) {
          newData = [
            ...prevData,
            initialPData[dataIndex % initialPData.length],
          ];
        } else {
          newData = prevData;
        }
        return newData;
      });

      setDataIndex((prevIndex) => prevIndex + 1);
    }, 600); // Update every minute

    return () => clearInterval(interval);
  }, [dataIndex]);

  return (
    <Paper className="box-background even-margin">
      <LineChart
        sx={{
          // Change left yAxis label styles
          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
            strokeWidth: "0.4",
            fill: "white",
          },
          // Change bottom label styles
          "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
            strokeWidth: "0.5",
            fill: "white",
          },
          // BottomAxis line styles
          "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
            stroke: "white",
            strokeWidth: 0.4,
          },
          // LeftAxis line styles
          "& .MuiChartsAxis-left .MuiChartsAxis-line": {
            stroke: "white",
            strokeWidth: 0.4,
          },
          "& .MuiChartsAxis-left .MuiChartsAxis-tick, & .MuiChartsAxis-bottom .MuiChartsAxis-tick":
            {
              stroke: "white",
            },
          "& .MuiChartsLegend-series text tspan": {
            fill: "white",
          },
        }}
        width={1000}
        height={300}
        series={[
          {
            data: pData,
            label: "Premium",
            color: "blue",
            curve: "linear",
            showMark: false,
          },
          {
            data: pct10Line,
            label: "Pct10",
            color: "red",
            curve: "linear",
            showMark: false,
          },
          {
            data: pct50Line,
            label: "Pct50",
            color: "yellow",
            curve: "linear",
            showMark: false,
          },
          {
            data: pct90Line,
            label: "Pct90",
            color: "green",
            curve: "linear",
            showMark: false,
          },
        ]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
        yAxis={[{ min: minValue }]}
      />
    </Paper>
  );
};

export default UnderlyingIndex;
