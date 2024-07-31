import React from "react";
import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import "./OrderEntry.css";
import { OrderEntryData } from "../types";
import IconText from "./IconText";

interface OrderEntryProps {
  selectedOptions: OrderEntryData[];
  onOptionsChange: (updatedOptions: OrderEntryData[]) => void;
  onPlaceOrder: (
    orders: OrderEntryData[],
    orderType: string,
    limitPrice: number
  ) => void;
  scale?: number;
}

const OrderEntry: React.FC<OrderEntryProps> = ({
  selectedOptions,
  onOptionsChange,
  onPlaceOrder,
  scale = 1,
}) => {
  const [orderType, setOrderType] = React.useState<string>("Market");
  const [limitPrice, setLimitPrice] = React.useState<number>(0);

  const handleQuantityChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].quantity = Math.max(Number(event.target.value), 1);
    onOptionsChange(updatedOptions);
  };

  const handleActionChange = (
    index: number,
    event: SelectChangeEvent<"Buy" | "Sell">
  ) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].action = event.target.value as "Buy" | "Sell";
    onOptionsChange(updatedOptions);
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = selectedOptions.filter((_, i) => i !== index);
    onOptionsChange(updatedOptions);
  };

  const handleOrderTypeChange = (event: SelectChangeEvent<string>) => {
    setOrderType(event.target.value as string);
  };

  const handlePlaceOrderClick = () => {
    onPlaceOrder(selectedOptions, orderType, limitPrice);
    onOptionsChange([]); // Clear the orders after placing them
    setOrderType("Market");
    setLimitPrice(0);
  };

  const handleReset = () => {
    onOptionsChange([]);
    setOrderType("Market");
    setLimitPrice(0);
  };

  return (
    <Paper
      className="order-entry"
      style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      <IconText text="Order Entry" iconSize="24px" textSize="22px" />
      {selectedOptions.length === 0 ? (
        <Typography color="white">
          There are no values. You can enter one by clicking on the option
          chain.
        </Typography>
      ) : (
        <TableContainer className="table-container">
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="header-cell"></TableCell>
                <TableCell className="header-cell">Action</TableCell>
                <TableCell className="header-cell">Quantity</TableCell>
                <TableCell
                  className="header-cell"
                  style={{ minWidth: "100px" }}
                >
                  DTE
                </TableCell>
                <TableCell className="header-cell">Strike</TableCell>
                <TableCell className="header-cell">Type</TableCell>
                <TableCell className="header-cell">Vega</TableCell>
                <TableCell className="header-cell">Delta</TableCell>
                <TableCell className="header-cell">Gamma</TableCell>
                <TableCell className="header-cell">Theta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOptions.map((selected, index) => (
                <TableRow key={index}>
                  <TableCell className="value-cell">
                    <IconButton onClick={() => handleDeleteOption(index)}>
                      <Delete className="icon-button" />
                    </IconButton>
                  </TableCell>
                  <TableCell className="value-cell">
                    <Select
                      value={selected.action}
                      onChange={(event) => handleActionChange(index, event)}
                      className="select-input"
                    >
                      <MenuItem value="Buy">Buy</MenuItem>
                      <MenuItem value="Sell">Sell</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell className="value-cell">
                    <TextField
                      type="number"
                      value={selected.quantity}
                      onChange={(event) => handleQuantityChange(index, event)}
                      inputProps={{ style: { textAlign: "center" }, min: 1 }}
                      className="number-textfield"
                    />
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    style={{ minWidth: "100px" }}
                  >
                    {selected.dte}
                  </TableCell>
                  <TableCell className="value-cell">
                    {selected.strike}
                  </TableCell>
                  <TableCell className="value-cell">{selected.type}</TableCell>
                  <TableCell className="value-cell">{selected.vega}</TableCell>
                  <TableCell className="value-cell">{selected.delta}</TableCell>
                  <TableCell className="value-cell">{selected.gamma}</TableCell>
                  <TableCell className="value-cell">{selected.theta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedOptions.length > 0 && (
        <>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <FormControl>
              <InputLabel className="input-label">Order Type</InputLabel>
              <Select
                value={orderType}
                onChange={handleOrderTypeChange}
                className="select-input"
              >
                <MenuItem value="Market">Market</MenuItem>
                <MenuItem value="Limit">Limit</MenuItem>
              </Select>
            </FormControl>
            {orderType === "Limit" && (
              <TextField
                label="Limit Price"
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                inputProps={{ min: 0 }}
                className="number-textfield"
              />
            )}
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrderClick}
              className="confirm-button buy-button"
              disabled={selectedOptions.length === 0}
            >
              Place Order
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReset}
              className="confirm-button sell-button"
            >
              Cancel
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default OrderEntry;