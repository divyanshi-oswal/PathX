'use client';

import React, {useState, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';

interface RouteFormProps {
  onOptimize: (start: string, end: string) => void;
}

interface GeocodeResult {
  lat: number;
  lon: number;
}

export const RouteForm: React.FC<RouteFormProps> = ({onOptimize}) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startPredictions, setStartPredictions] = useState<string[]>([]);
  const [endPredictions, setEndPredictions] = useState<string[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  const handleInputChange = (setter: (value: string) => void, predictionSetter: (value: string[]) => void) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value);

    if (value) {
      try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${apiKey}`);
        const data = await response.json();
        if (data.features) {
          const predictions = data.features.map(feature => feature.properties.formatted);
          predictionSetter(predictions);
        } else {
          predictionSetter([]);
        }
      } catch (error) {
        console.error('Error fetching autocomplete predictions:', error);
        predictionSetter([]);
      }
    } else {
      predictionSetter([]);
    }
  };

  const getCoordinates = async (address: string): Promise<GeocodeResult | null> => {
    try {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${apiKey}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const {lat, lon} = data.features[0].geometry.coordinates;
        return {lat: lon, lon: lat};
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  const selectPrediction = (setter: (value: string) => void, predictionSetter: (value: string[]) => void) => (prediction: string) => {
    setter(prediction);
    predictionSetter([]);
  };

  const handleSubmit = async () => {
    if (!startLocation || !endLocation) {
      alert('Please enter start and end locations.');
      return;
    }

    const startCoords = await getCoordinates(startLocation);
    const endCoords = await getCoordinates(endLocation);

    if (startCoords && endCoords) {
      onOptimize(startLocation, endLocation);
    } else {
      alert('Could not find coordinates for the locations.');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="startLocation">Start Location</Label>
        <Input
          type="text"
          id="startLocation"
          placeholder="Enter start location"
          value={startLocation}
          onChange={handleInputChange(setStartLocation, setStartPredictions)}
        />
        {startPredictions.length > 0 && (
          <ul className="border rounded-md mt-1 py-1 bg-background">
            {startPredictions.map((prediction, index) => (
              <li
                key={index}
                className="px-3 py-1 hover:bg-secondary cursor-pointer"
                onClick={() => selectPrediction(setStartLocation, setStartPredictions)(prediction)}
              >
                {prediction}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <Label htmlFor="endLocation">End Location</Label>
        <Input
          type="text"
          id="endLocation"
          placeholder="Enter end location"
          value={endLocation}
          onChange={handleInputChange(setEndLocation, setEndPredictions)}
        />
        {endPredictions.length > 0 && (
          <ul className="border rounded-md mt-1 py-1 bg-background">
            {endPredictions.map((prediction, index) => (
              <li
                key={index}
                className="px-3 py-1 hover:bg-secondary cursor-pointer"
                onClick={() => selectPrediction(setEndLocation, setEndPredictions)(prediction)}
              >
                {prediction}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Optimize Route</Button>
      </div>
    </div>
  );
};

