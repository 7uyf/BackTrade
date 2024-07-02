import React from 'react';
import { Button, TextField, Box, Select, OutlinedInput, ToggleButtonGroup, SelectChangeEvent, Chip, ToggleButton, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import './SimulationBuilder.css';

interface SimulationBuilderProps {
    onSimulationStart: () => void; // Define prop for handling simulation start
}

const SimulationBuilder: React.FC<SimulationBuilderProps> = ({ onSimulationStart }) => {

    const [selectedDates, setSelectedDates] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof selectedDates>) => {
        const {
            target: { value },
        } = event;
        setSelectedDates(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    const handleStartSimulating = () => {
        // Perform any necessary actions before closing the dialog
        onSimulationStart(); // Close the dialog
    };

    return (
        <div className="simulation-builder">
            <FormControl component="fieldset" fullWidth margin="normal">
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    aria-label="MarketDataGenerator Type"
                    defaultValue="Test"
                    value={'Test'}
                >
                    <ToggleButton value="Test">Test</ToggleButton>
                    <ToggleButton value="Practice">Practice</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
            <FormControl component="fieldset" fullWidth margin="normal">
                <InputLabel>Select Dates</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedDates}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    <MenuItem value="13.3.2024">13.3.2024</MenuItem>
                    <MenuItem value="14.3.2024">14.3.2024</MenuItem>
                    <MenuItem value="15.3.2024">15.3.2024</MenuItem>
                    <MenuItem value="17.3.2024">17.3.2024</MenuItem>
                </Select>
            </FormControl>
            <FormControl component="fieldset" fullWidth margin="normal">
                <InputLabel sx={{fontSize: '1vw'}}>Start Date</InputLabel>
                <TextField
                    aria-label="MarketDataGenerator Start"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={selectedDates[0]!}
                />
            </FormControl>
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
        </div>
    );
};

export default SimulationBuilder;
