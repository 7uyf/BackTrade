import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import "./OptionChain.css";
import { OptionChainData, OrderEntryData } from "../types";
import IconText from "./IconText";

interface OptionChainProps {
  title: string;
  values: OptionChainData[];
  onOptionSelect: (
    option: OptionChainData | null,
    type: "Call" | "Put" | null
  ) => void;
  scale: number;
  resetHighlightedRows: number;
  selectedOptions: OrderEntryData[];
  onOptionsChange: (updatedOptions: OrderEntryData[]) => void;
  removeHighlight: (key: string) => void;
}

const OptionChain: React.FC<OptionChainProps> = ({
  title,
  values,
  onOptionSelect,
  scale,
  resetHighlightedRows,
  selectedOptions,
  onOptionsChange,
  removeHighlight,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [symbols] = useState(["AAPL", "GOOGL", "TSLA", "BABA"]);
  const [highlightedRows, setHighlightedRows] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    setHighlightedRows({});
  }, [resetHighlightedRows]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSymbolChange = (event: SelectChangeEvent<string>) => {
    setSelectedSymbol(event.target.value as string);
    onOptionSelect(null, null); // Reset selections on symbol change
    setHighlightedRows({});
    onOptionsChange([]); // Reset selected options in OrderEntry
  };

  const handleRowClick = (option: OptionChainData, type: "Call" | "Put") => {
    const key = `${option.dte}-${option.strike}-${type}`;
    onOptionSelect(option, type); // Add the row if not highlighted, Remove the row if already highlighted
    if (highlightedRows[key]) {
      setHighlightedRows((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      removeHighlight(key); // Call removeHighlight here
    } else {
      setHighlightedRows((prev) => ({ ...prev, [key]: true }));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB").split("/").reverse().join("/");
  };

  const filteredData = values.filter(
    (option) => option.symbol === selectedSymbol
  );
  const currentDtes = Array.from(new Set(filteredData.map((data) => data.dte)));
  const currentData = filteredData.filter(
    (option) => option.dte === currentDtes[selectedTab]
  );

  return (
    <Paper
      className="option-chain"
      style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      <IconText text="Option Chain" iconSize="23px" textSize="21px" />
      <Box
        className="uprow"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="DTE Tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          {currentDtes.map((dte, index) => (
            <Tab
              label={formatDate(dte)}
              key={index}
              sx={{ color: selectedTab === index ? "black" : "lightgray" }}
            />
          ))}
        </Tabs>
        <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
          <InputLabel className="inputlabel">Symbol</InputLabel>
          <Select
            className="symbol-select"
            value={selectedSymbol}
            onChange={handleSymbolChange}
            label="Symbol"
          >
            {symbols.map((symbol) => (
              <MenuItem key={symbol} value={symbol}>
                {symbol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer
        sx={{ background: "transparent !important" }}
        component={Paper}
      >
        <Table
          sx={{ minWidth: 650, background: "transparent !important" }}
          aria-label="simple table"
        >
          <TableHead className="table-head">
            <TableRow>
              <TableCell colSpan={8} align="center">
                Calls
              </TableCell>
              <TableCell className="table-head" align="center"></TableCell>
              <TableCell colSpan={8} align="center">
                Puts
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="header-cell">Bid</TableCell>
              <TableCell className="header-cell">Ask</TableCell>
              <TableCell className="header-cell">Vega</TableCell>
              <TableCell className="header-cell">Delta</TableCell>
              <TableCell className="header-cell">Gamma</TableCell>
              <TableCell className="header-cell">Theta</TableCell>
              <TableCell className="header-cell">IV</TableCell>
              <TableCell className="header-cell">Quantity</TableCell>
              <TableCell className="strike-header">Strike</TableCell>
              <TableCell className="header-cell">Bid</TableCell>
              <TableCell className="header-cell">Ask</TableCell>
              <TableCell className="header-cell">Vega</TableCell>
              <TableCell className="header-cell">Delta</TableCell>
              <TableCell className="header-cell">Gamma</TableCell>
              <TableCell className="header-cell">Theta</TableCell>
              <TableCell className="header-cell">IV</TableCell>
              <TableCell className="header-cell">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
            {currentData.map((row: OptionChainData, index) => {
              const callKey = `${row.dte}-${row.strike}-Call`;
              const putKey = `${row.dte}-${row.strike}-Put`;

              return (
                <TableRow key={index}>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[callKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Call")}
                  >
                    {row.callBid}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[callKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Call")}
                  >
                    {row.callAsk}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[callKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Call")}
                  >
                    {row.callVega}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[callKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Call")}
                  >
                    {row.callDelta}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[callKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Call")}
                  >
                    {row.callGamma}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[callKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Call")}
                  >
                    {row.callTheta}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[callKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Call")}
                  >
                    {row.callIv}
                  </TableCell>
                  <TableCell className="value-cell quantity-cell">
                    {row.callQuantity || ""}
                  </TableCell>
                  <TableCell className="strike-cell">{row.strike}</TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[putKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Put")}
                  >
                    {row.putBid}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[putKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Put")}
                  >
                    {row.putAsk}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[putKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Put")}
                  >
                    {row.putVega}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[putKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Put")}
                  >
                    {row.putDelta}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[putKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Put")}
                  >
                    {row.putGamma}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[putKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Put")}
                  >
                    {row.putTheta}
                  </TableCell>
                  <TableCell
                    className={`value-cell ${
                      highlightedRows[putKey] ? "highlighted" : ""
                    }`}
                    onClick={() => handleRowClick(row, "Put")}
                  >
                    {row.putIv}
                  </TableCell>
                  <TableCell className="value-cell quantity-cell">
                    {row.putQuantity || ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OptionChain;
