import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Select, OutlinedInput, Autocomplete, ToggleButtonGroup, CircularProgress, SelectChangeEvent, Chip, ToggleButton, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';
import './SimulationBuilder.css';

interface SimulationBuilderProps {
    onSimulationStart: () => void; // Define prop for handling simulation start
}

const pattern = /\/(-?\d+)dte\//;

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({ onSimulationStart }) => {

    const [datesOptions, setDatesOptions] = useState<string[]>([]);
    const [selectedStartDate, setSelectedStartDate] = useState<string>('')
    const [selectedDte, setSelectedDte] = useState<string>('')
    const [dtesOptions, setDtesOptions] = useState<string[]>([]);

    const handleStartSimulating = () => {
        onSimulationStart(); // Close the dialog
    };

    const extractDates = (filePaths: string[]): string[] => {
        const datePattern = /\d{4}-\d{2}-\d{2}/; // Pattern to match dates in the format YYYY-MM-DD
        const datesSet = new Set<string>();

        filePaths.forEach(path => {
            const match = path.match(datePattern);
            if (match) {
                datesSet.add(match[0]);
            }
        });

        return Array.from(datesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    };

    const getAvailableDates = async () => {
        try {
            const response = await axios.get('http://localhost:5001/available-data', {
            });
            const filePaths: string[] = response.data.files;
            const uniqueDates = extractDates(filePaths);
            setDatesOptions(uniqueDates);
        } catch (error) {
            console.error('Error fetching available data:', error);
        }
    };

    const getAvailableDtes = async (selectedStartDate: string) => {
        try {
            const response = await axios.get('http://localhost:5001/available-data', {
                params: {
                    start_date: selectedStartDate,
                    end_date: selectedStartDate,
                },
            });
            const filePaths: string[] = response.data.files;
            console.log(filePaths)
            setDtesOptions(filePaths)
            setSelectedDte(filePaths[0])
        } catch (error) {
            console.error('Error fetching available data:', error);
        }
    };

    useEffect(() => {
        getAvailableDates()
    }, [])

    useEffect(() => {
        if (selectedStartDate != '') {
            setDtesOptions([])
            getAvailableDtes(selectedStartDate)
        }
    }, [selectedStartDate])

    return (
        <div className="simulation-builder">
            <FormControl component="fieldset" fullWidth margin="normal">
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    aria-label="Simulation Type"
                    defaultValue="Test"
                    value={'Test'}
                >
                    <ToggleButton value="Test">Test</ToggleButton>
                    <ToggleButton value="Practice">Practice</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
            {datesOptions.length == 0 ?
                <CircularProgress />
                :
                <FormControl fullWidth margin="normal">
                    <Autocomplete
                        id="date-select"
                        options={datesOptions}
                        value={selectedStartDate}
                        onChange={(e, value) => setSelectedStartDate(value!)}
                        renderInput={(params) => <TextField {...params} label="Start Date" />}
                    />
                </FormControl>
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
                </FormControl> */}
            {dtesOptions.length == 0 && selectedStartDate ?
                <CircularProgress />
                : <FormControl fullWidth>
                    <InputLabel id="date-select-label">DTE</InputLabel>
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
                </FormControl>}
            <FormControl component="fieldset" fullWidth margin="normal">
                <InputLabel>Select Symbol</InputLabel>
                <Select defaultValue="BTC/JPY">
                    <MenuItem value="BTC/JPY">BTC/JPY</MenuItem>
                    {/* Add other options here */}
                </Select>
            </FormControl>
            <FormControlLabel
                control={<Switch name="includeIndicator" />}
                label="Include Indicator"
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleStartSimulating}>
                Start Simulating
            </Button>
        </div >
    );
};

export default SimulationBuilder;
