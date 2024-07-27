import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  InputAdornment,
  styled,
} from "@mui/material";
import "./ChooseCommand.css";

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputAdornment-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});

const ChooseCommand: React.FC = () => {
  const [command, setCommand] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [positionStructure, setPositionStructure] = useState<string>("");
  const [positionSize, setPositionSize] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [gamma, setGamma] = useState<string>("");
  const [hedgeDirection, setHedgeDirection] = useState<string>("");
  const [portfolioDelta, setPortfolioDelta] = useState<string>("");
  const [optionDelta, setOptionDelta] = useState<string>("10");
  const [sizingDirection, setSizingDirection] = useState<string>("");
  const [sizingMethod, setSizingMethod] = useState<string>("");
  const [marginOption, setMarginOption] = useState<string>("");
  const [marginAmount, setMarginAmount] = useState<string>("");
  const [exitOption, setExitOption] = useState<string>("");

  const handleCommandChange = (event: SelectChangeEvent) => {
    setCommand(event.target.value);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPositionStructure("");
    setPositionSize("");
    setAmount("");
    setGamma("");
    setHedgeDirection("");
    setPortfolioDelta("");
    setOptionDelta("10");
    setSizingDirection("");
    setSizingMethod("");
    setMarginOption("");
    setMarginAmount("");
    setExitOption("");
  };

  const handlePositionStructureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPositionStructure((event.target as HTMLInputElement).value);
  };

  const handlePositionSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPositionSize((event.target as HTMLInputElement).value);
    if ((event.target as HTMLInputElement).value !== "By absolute amount") {
      setAmount("");
    }
    if ((event.target as HTMLInputElement).value !== "By absolute gamma") {
      setGamma("");
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleGammaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGamma(event.target.value);
  };

  const handleExitOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedValue = (event.target as HTMLInputElement).value;
    setExitOption(exitOption === selectedValue ? "" : selectedValue);
  };

  const handleSizingDirectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSizingDirection((event.target as HTMLInputElement).value);
  };

  const handleSizingMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSizingMethod((event.target as HTMLInputElement).value);
    if ((event.target as HTMLInputElement).value !== "By margin size") {
      setMarginOption("");
      setMarginAmount("");
    }
  };

  const handleMarginOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarginOption((event.target as HTMLInputElement).value);
  };

  const handleMarginAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarginAmount(event.target.value);
  };

  const handleHedgeDirectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHedgeDirection((event.target as HTMLInputElement).value);
  };

  const handlePortfolioDeltaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPortfolioDelta(event.target.value);
  };

  const handleOptionDeltaChange = (event: SelectChangeEvent<string>) => {
    setOptionDelta(event.target.value);
  };

  return (
    <div>
      <FormControl
        fullWidth
        margin="normal"
        sx={{ marginTop: 2, width: "47%" }}
      >
        <InputLabel className="input-label">Choose Command</InputLabel>
        <Select
          value={command}
          onChange={handleCommandChange}
          className="select-input"
        >
          <MenuItem value="Entry">Entry</MenuItem>
          <MenuItem value="Hedge">Hedge</MenuItem>
          <MenuItem value="Sizing">Sizing</MenuItem>
          <MenuItem value="Exit">Exit</MenuItem>
        </Select>
      </FormControl>

      {/* Entry Dialog */}
      <Dialog
        open={openDialog && command === "Entry"}
        onClose={handleCloseDialog}
      >
        <DialogTitle className="dialog-title">Entry Command</DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="h6">Position Structure</Typography>
          <RadioGroup
            aria-label="positionStructure"
            name="positionStructure"
            value={positionStructure}
            onChange={handlePositionStructureChange}
            sx={{ color: "white" }}
          >
            <FormControlLabel
              value="Buy"
              control={<Radio sx={{ color: "white" }} />}
              label="Buy"
            />
            <FormControlLabel
              value="Sell"
              control={<Radio sx={{ color: "white" }} />}
              label="Sell"
            />
          </RadioGroup>
          <Typography variant="h6" sx={{ color: "white" }}>
            Position Size
          </Typography>
          <RadioGroup
            aria-label="positionSize"
            name="positionSize"
            value={positionSize}
            onChange={handlePositionSizeChange}
            sx={{ color: "white" }}
          >
            <Box display="flex" alignItems="center">
              <FormControlLabel
                value="By absolute amount"
                control={<Radio sx={{ color: "white" }} />}
                label="By absolute amount"
              />
              {positionSize === "By absolute amount" && (
                <CustomTextField
                  value={amount}
                  onChange={handleAmountChange}
                  className="text-field"
                  type="Number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <span style={{ color: "white" }}>$</span>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: "5rem", ml: 2 }}
                />
              )}
            </Box>
            <Box display="flex" alignItems="center">
              <FormControlLabel
                value="By absolute gamma"
                control={<Radio sx={{ color: "white" }} />}
                label="By absolute gamma"
              />
              {positionSize === "By absolute gamma" && (
                <CustomTextField
                  value={gamma}
                  onChange={handleGammaChange}
                  className="text-field"
                  type="Number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <span style={{ color: "white" }}>%</span>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: "5rem", ml: 2 }}
                />
              )}
            </Box>
          </RadioGroup>
        </DialogContent>
        <DialogActions className="dialog-content">
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hedge Dialog */}
      <Dialog
        open={openDialog && command === "Hedge"}
        onClose={handleCloseDialog}
      >
        <DialogTitle className="dialog-title">Hedge Command</DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="h6" sx={{ color: "white" }}>
            Direction
          </Typography>
          <RadioGroup
            aria-label="hedgeDirection"
            name="hedgeDirection"
            value={hedgeDirection}
            onChange={handleHedgeDirectionChange}
            sx={{ color: "white" }}
          >
            <FormControlLabel
              value="Buy"
              control={<Radio sx={{ color: "white" }} />}
              label="Buy"
            />
            <FormControlLabel
              value="Sell"
              control={<Radio sx={{ color: "white" }} />}
              label="Sell"
            />
          </RadioGroup>
          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ color: "white" }}>
              % of portfolio delta
            </Typography>
            <CustomTextField
              value={portfolioDelta}
              onChange={handlePortfolioDeltaChange}
              type="Number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <span style={{ color: "white" }}>%</span>
                  </InputAdornment>
                ),
              }}
              sx={{ width: "5rem", ml: 2 }}
            />
          </Box>
          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ color: "white" }}>
              Option delta
            </Typography>
            <FormControl sx={{ width: "5rem", ml: 2 }}>
              <Select
                value={optionDelta}
                onChange={handleOptionDeltaChange}
                sx={{ color: "white", ".MuiSvgIcon-root": { color: "white" } }}
              >
                {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map(
                  (value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-content">
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sizing Dialog */}
      <Dialog
        open={openDialog && command === "Sizing"}
        onClose={handleCloseDialog}
      >
        <DialogTitle className="dialog-title">Sizing Command</DialogTitle>
        <DialogContent className="dialog-content">
          <RadioGroup
            aria-label="sizingDirection"
            name="sizingDirection"
            value={sizingDirection}
            onChange={handleSizingDirectionChange}
            sx={{ color: "white" }}
          >
            <FormControlLabel
              value="Increase"
              control={<Radio sx={{ color: "white" }} />}
              label="Increase"
            />
            <FormControlLabel
              value="Decrease"
              control={<Radio sx={{ color: "white" }} />}
              label="Decrease"
            />
          </RadioGroup>
          <RadioGroup
            aria-label="sizingMethod"
            name="sizingMethod"
            value={sizingMethod}
            onChange={handleSizingMethodChange}
            sx={{ color: "white" }}
          >
            <Box display="flex" alignItems="center">
              <FormControlLabel
                value="By option gamma"
                control={<Radio sx={{ color: "white" }} />}
                label="By option gamma"
              />
              {sizingMethod === "By option gamma" && (
                <CustomTextField
                  value={gamma}
                  onChange={handleGammaChange}
                  className="text-field"
                  type="Number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <span style={{ color: "white" }}>%</span>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: "5rem", ml: 2 }}
                />
              )}
            </Box>
            <Box display="flex" alignItems="center">
              <FormControlLabel
                value="By margin size"
                control={<Radio sx={{ color: "white" }} />}
                label="By margin size"
              />
            </Box>
          </RadioGroup>
          {sizingMethod === "By margin size" && (
            <Box sx={{ pl: 4 }}>
              <RadioGroup
                aria-label="marginOption"
                name="marginOption"
                value={marginOption}
                onChange={handleMarginOptionChange}
                sx={{ color: "white" }}
              >
                <Box display="flex" alignItems="center">
                  <FormControlLabel
                    value="By absolute margin"
                    control={<Radio sx={{ color: "white" }} />}
                    label="By absolute margin"
                  />
                  {marginOption === "By absolute margin" && (
                    <CustomTextField
                      value={marginAmount}
                      onChange={handleMarginAmountChange}
                      className="text-field"
                      type="Number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <span style={{ color: "white" }}>$</span>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: "5rem", ml: 2 }}
                    />
                  )}
                </Box>
                <Box display="flex" alignItems="center">
                  <FormControlLabel
                    value="By % of margin"
                    control={<Radio sx={{ color: "white" }} />}
                    label="By % of margin"
                  />
                  {marginOption === "By % of margin" && (
                    <TextField
                      value={marginAmount}
                      onChange={handleMarginAmountChange}
                      className="text-field"
                      type="Number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <span style={{ color: "white" }}>%</span>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: "5rem", ml: 2 }}
                    />
                  )}
                </Box>
              </RadioGroup>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="dialog-content">
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Dialog */}
      <Dialog
        open={openDialog && command === "Exit"}
        onClose={handleCloseDialog}
      >
        <DialogTitle className="dialog-title">Exit Command</DialogTitle>
        <DialogContent className="dialog-content">
          <RadioGroup
            aria-label="exitOption"
            name="exitOption"
            value={exitOption}
            onChange={handleExitOptionChange}
            sx={{ color: "white" }}
          >
            <FormControlLabel
              value="Exit all positions"
              control={<Radio sx={{ color: "white" }} />}
              label="Exit all positions"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions className="dialog-content">
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChooseCommand;
