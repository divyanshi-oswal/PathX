'use client';

import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const emissionFactors = {
  'truck': 0.15, // kg CO2 per km
  'train': 0.08, // kg CO2 per km
  'ship': 0.02, // kg CO2 per km
  'electricVehicle': 0.05, // kg CO2 per km
  'bicycle': 0.01, // kg CO2 per km
};

const truckModels = [
    {value: 'smallTruck', label: 'Small Truck'},
    {value: 'mediumTruck', label: 'Medium Truck'},
    {value: 'largeTruck', label: 'Large Truck'},
];

const trainModels = [
    {value: 'freightTrain', label: 'Freight Train'},
    {value: 'passengerTrain', label: 'Passenger Train'},
];

const shipModels = [
    { value: 'containerShip', label: 'Container Ship' },
    { value: 'tankerShip', label: 'Tanker Ship' },
    { value: 'cruiseShip', label: 'Cruise Ship' },
];

const electricVehicleModels = [
    { value: 'electricCar', label: 'Electric Car' },
    { value: 'electricTruck', label: 'Electric Truck' },
    { value: 'electricBus', label: 'Electric Bus' },
];

export const Calculator: React.FC = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [transportMode, setTransportMode] = useState<string>('truck');
  const [carbonFootprint, setCarbonFootprint] = useState<number>(0);
  const [greenDeliverySuggestion, setGreenDeliverySuggestion] = useState<string>('');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>('');

  const calculate = () => {
    if (distance !== null && transportMode) {
      const emissionFactor = emissionFactors[transportMode as keyof typeof emissionFactors];
      const calculatedFootprint = distance * emissionFactor;
      setCarbonFootprint(calculatedFootprint);

      // Suggest green delivery options based on the selected transport mode
      if (transportMode === 'truck' || transportMode === 'ship') {
        setGreenDeliverySuggestion(
          'Consider using electric vehicles or bicycles for shorter distances. Also, opt for eco-friendly packaging.'
        );
      } else {
        setGreenDeliverySuggestion('This is already a green option!');
      }
    }
  };

  const renderVehicleModels = () => {
    switch (transportMode) {
      case 'truck':
        return truckModels.map(model => (
          <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
        ));
      case 'train':
        return trainModels.map(model => (
          <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
        ));
        case 'ship':
            return shipModels.map(model => (
                <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
            ));
        case 'electricVehicle':
            return electricVehicleModels.map(model => (
                <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
            ));
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="distance">Distance (km)</Label>
        <Input
          type="number"
          id="distance"
          placeholder="Enter distance"
          onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="transportMode">Transport Mode</Label>
        <Select onValueChange={setTransportMode}>
          <SelectTrigger id="transportMode">
            <SelectValue placeholder="Select transport mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="train">Train</SelectItem>
            <SelectItem value="ship">Ship</SelectItem>
            <SelectItem value="electricVehicle">Electric Vehicle</SelectItem>
            <SelectItem value="bicycle">Bicycle</SelectItem>
          </SelectContent>
        </Select>
      </div>

        {transportMode !== 'bicycle' && transportMode !== '' && (
            <div>
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Select onValueChange={setSelectedVehicleModel}>
                    <SelectTrigger id="vehicleModel">
                        <SelectValue placeholder="Select vehicle model" />
                    </SelectTrigger>
                    <SelectContent>
                        {renderVehicleModels()}
                    </SelectContent>
                </Select>
            </div>
        )}


      <div>
        <Label>Estimated Carbon Footprint</Label>
        <p>{carbonFootprint.toFixed(2)} kg</p>
      </div>
      {greenDeliverySuggestion && (
        <div>
          <Label>Green Delivery Suggestion</Label>
          <p>{greenDeliverySuggestion}</p>
        </div>
      )}
      <div className="flex justify-end">
        <Button onClick={calculate}>Calculate</Button>
      </div>
    </div>
  );
};

