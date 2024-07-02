import React from "react";
import {
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  IconButton,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import "./OrderEntry.css";
import { OptionChainData } from "../types";

interface OrderEntryProps {
  selectedOption: OptionChainData | null;
  selectedOptionAction: "Call" | "Put" | null;
}

const OrderEntry: React.FC<OrderEntryProps> = ({
  selectedOption,
  selectedOptionAction,
}) => {
  const [strikePrice, setStrikePrice] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(1000);
  const [type, setType] = React.useState<string>("");
  const [symbol, setSymbol] = React.useState<string>("");
  const [expirationDate, setExpirationDate] = React.useState<string>("");

  React.useEffect(() => {
    if (selectedOption && selectedOptionAction) {
      setStrikePrice(selectedOption.strike);
      setType(selectedOptionAction);
      setSymbol(selectedOption.symbol);
      setExpirationDate(selectedOption.dte);
    }
  }, [selectedOption, selectedOptionAction]);

  const handleIncrementStrikePrice = () => {
    setStrikePrice((prev) => prev + 1);
  };

  const handleDecrementStrikePrice = () => {
    setStrikePrice((prev) => prev - 1);
  };

  const handleIncrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrementQuantity = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handleSymbolChange = (event: SelectChangeEvent) => {
    setSymbol(event.target.value);
  };

  const handleExpirationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExpirationDate(event.target.value);
  };

  return (
    <Paper className="box-background order-entry">
      <Typography variant="h6" className="header-text">
        Order Entry
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel className="input-label">Symbol</InputLabel>
        <Select
          value={symbol}
          onChange={handleSymbolChange}
          className="select-input"
        >
          <MenuItem value="AAPL">AAPL</MenuItem>
          <MenuItem value="GOOGL">GOOGL</MenuItem>
          <MenuItem value="TSLA">TSLA</MenuItem>
          {/* Add other options here */}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Expiration Date"
          type="date"
          value={expirationDate}
          onChange={handleExpirationChange}
          className="date-input"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Box>
          <div className="strike-title">Strike Price</div>
          <div className="number-input">
            <IconButton
              className="icon-button"
              onClick={handleDecrementStrikePrice}
            >
              <Remove />
            </IconButton>
            <TextField
              type="number"
              value={strikePrice}
              onChange={(e) =>
                setStrikePrice(Math.max(Number(e.target.value), 0))
              }
              className="number-textfield"
              inputProps={{ style: { textAlign: "center" } }}
            />
            <IconButton
              className="icon-button"
              onClick={handleIncrementStrikePrice}
            >
              <Add />
            </IconButton>
          </div>
        </Box>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Box>
          <div className="strike-title">Quantity</div>
          <div className="number-input">
            <IconButton
              className="icon-button"
              onClick={handleDecrementQuantity}
            >
              <Remove />
            </IconButton>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(Number(e.target.value), 0))}
              className="number-textfield"
              inputProps={{ style: { textAlign: "center" }, min: 0 }}
            />
            <IconButton
              className="icon-button"
              onClick={handleIncrementQuantity}
            >
              <Add />
            </IconButton>
          </div>
        </Box>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel className="input-label">Type</InputLabel>
        <Select
          value={type}
          onChange={handleTypeChange}
          className="select-input"
        >
          <MenuItem value="Call">Call</MenuItem>
          <MenuItem value="Put">Put</MenuItem>
        </Select>
      </FormControl>
      <Box className="order-buttons">
        <Button className="confirm-button buy-button" variant="contained">
          Buy
        </Button>
        <Button className="confirm-button sell-button" variant="contained">
          Sell
        </Button>
      </Box>
    </Paper>
  );
};

export default OrderEntry;
