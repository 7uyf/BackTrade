import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  TextField,
  Select,
  Autocomplete,
  ToggleButtonGroup,
  CircularProgress,
  ToggleButton,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import "./SimulationBuilder.css";

interface SimulationBuilderProps {

    onSimulationStart: (simulationId: string) => void; // Define prop for handling simulation start

}

const pattern = /\/(-?\d+)dte\//;

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({
  onSimulationStart,
}) => {
  const [datesOptions, setDatesOptions] = useState<string[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedDte, setSelectedDte] = useState<string>("");
  const [dtesOptions, setDtesOptions] = useState<string[]>([]);
  const [selectedSimType, setSelectedSimType] = useState<string>("Test");
  // const [initialCapital, setInitialCapital] = useState(10000);
  //const [universeSelection, setUniverseSelection] = useState('BTC/JPY');
  // const [includeIndicator, setIncludeIndicator] = useState(false);

  const handleStartSimulating = async () => {
    try {
      const response = await axios.post("http://localhost:8000/simulation", {
        user_id: "user123",
        simulation_type: "Practice",
        start_date_time: new Date(2016, 1, 12, 9, 30).toISOString(),
        initial_capital: 100000.0,
        universe_selection: [
          {
            file_url: "ivol/all_dte_raw_data/0dte/2016-01-12.csv",
            today_date: new Date(2016, 1, 12).toISOString(),
            stock_symbol: "SPX",
            expiration_date: new Date(2016, 1, 22).toISOString(),
            dte: 10,
          },
        ],
      });
      console.log("Simulation created:", response.data);
      onSimulationStart();
    } catch (error) {
      console.error("Error creating simulation:", error);
    }
  };

    const handleStartSimulating = async () => {
        try {
            const response = await axios.post('http://localhost:8000/simulation', {
                user_id: 'user123',
                simulation_type: 'Practice',
                start_date_time: new Date(2016, 1, 12, 9, 30).toISOString(),
                initial_capital: 100000.0,
                universe_selection: [
                    {
                        file_url: 'ivol/all_dte_raw_data/0dte/2016-01-12.csv',
                        today_date: new Date(2016, 1, 12).toISOString(),
                        stock_symbol: 'SPX',
                        expiration_date: new Date(2016, 1, 22).toISOString(),
                        dte: 10
                    }
                ]
            });
            console.log('Simulation created:', response.data);
            onSimulationStart(response.data['_id'])
        } catch (error) {
            console.error('Error creating simulation:', error);
        }
    };


    filePaths.forEach((path) => {
      const match = path.match(datePattern);
      if (match) {
        datesSet.add(match[0]);
      }
    });

    return Array.from(datesSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  };

  const getAvailableDates = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/available-data",
        {}
      );
      const filePaths: string[] = response.data.files;
      const uniqueDates = extractDates(filePaths);
      setDatesOptions(uniqueDates);
    } catch (error) {
      console.error("Error fetching available data:", error);
    }
  }, []);

  const getAvailableDtes = async (selectedStartDate: string) => {
    try {
      const response = await axios.get("http://localhost:5001/available-data", {
        params: {
          start_date: selectedStartDate,
          end_date: selectedStartDate,
        },
      });
      const filePaths: string[] = response.data.files;
      console.log(filePaths);
      setDtesOptions(filePaths);
      setSelectedDte(filePaths[0]);
    } catch (error) {
      console.error("Error fetching available data:", error);
    }
  };

  useEffect(() => {
    getAvailableDates();
  }, [getAvailableDates]);

  useEffect(() => {
    if (selectedStartDate !== "") {
      setDtesOptions([]);
      getAvailableDtes(selectedStartDate);
    }
  }, [selectedStartDate]);

  const handleSimTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: string | null
  ) => {
    if (newType !== null) {
      setSelectedSimType(newType);
    }
  };

  return (
    <div className="simulation-builder">
      <FormControl component="fieldset" fullWidth margin="normal">
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={selectedSimType}
          onChange={handleSimTypeChange}
          aria-label="Simulation Type"
        >
          <ToggleButton value="Test">Test</ToggleButton>
          <ToggleButton value="Practice">Practice</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      {
        datesOptions.length === 0 ? (
          <CircularProgress />
        ) : (
          <FormControl fullWidth margin="normal">
            <Autocomplete
              id="date-select"
              options={datesOptions}
              value={selectedStartDate}
              onChange={(e, value) => setSelectedStartDate(value!)}
              renderInput={(params) => (
                <TextField {...params} label="Start Date" />
              )}
            />
          </FormControl>
        )
        /* <FormControl fullWidth>
                    <InputLabel id="date-select-label">Start Date</InputLabel>
                    <Select
                        labelId="date-select-label"
                        id="date-select"
                        value={selectedStartDate}
                        onChange={(e) => setSelectedStartDate(e.target.value)}
                    >
                        {datesOptions.map((date, index) => (
                            <MenuItem key={index} value={date}>
                                {date}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */
      }
      {dtesOptions.length === 0 && selectedStartDate ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth>
          <InputLabel>DTE</InputLabel>
          <Select
            labelId="date-select-label"
            id="date-select"
            value={selectedDte}
            onChange={(e) => setSelectedDte(e.target.value)}
          >
            {dtesOptions.map((dte, index) => (
              <MenuItem key={index} value={dte}>
                {dte.match(pattern) != null ? dte.match(pattern)![1] : dte}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <FormControl component="fieldset" fullWidth margin="normal">
        <InputLabel className="select-label">Select Symbol</InputLabel>
        <Select defaultValue="SPY">
          <MenuItem value="SPY">SPY</MenuItem>
          <MenuItem value="QQQ">QQQ</MenuItem>
          {/* Add other options here */}
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Switch name="includeIndicator" />}
        label="Include Indicator"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleStartSimulating}
      >
        Start Simulating
      </Button>
    </div>
  );
};

export default SimulationBuilder;
