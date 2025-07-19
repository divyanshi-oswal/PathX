
import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {MapComponent} from '@/components/Map';
import {RouteForm} from '@/components/RouteForm';
import {Calculator} from '@/components/Calculator';
import {Inventory} from '@/components/Inventory';
import {Settings} from '@/components/Settings';
import {predictOrder} from '@/ai/flows/predict-order-flow';
import {optimizeRoute} from '@/ai/flows/optimize-route';
import {Header} from '@/components/Header'; // Import the Header component


const DashboardPage: React.FC = () => {
  const [predictedOrder, setPredictedOrder] = useState<string[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [startLocation, setStartLocation] = useState({lat: 37.7749, lng: -122.4194});
  const [endLocation, setEndLocation] = useState({lat: 34.0522, lng: -118.2437});
  const [supplyChainFactors, setSupplyChainFactors] = useState<string[]>([]);

  useEffect(() => {
    // Dummy data for demonstration purposes
    const userId = 'user123';
    const recentOrders = ['Product A', 'Product B'];

    // Fetch predicted order
    predictOrder({userId, recentOrders})
      .then(result => {
        setPredictedOrder(result.predictedOrder);
      })
      .catch(error => {
        console.error('Error predicting order:', error);
      });

    // Fetch optimized route
    optimizeRoute({start: startLocation, end: endLocation, constraints: '', traffic: false, roadConditions: false, fuelEfficiency: false})
      .then(result => {
        setOptimizedRoute(result);
      })
      .catch(error => {
        console.error('Error optimizing route:', error);
      });
  }, [startLocation, endLocation]);

  const handleOptimizeRoute = (start: {lat: number, lng: number}, end: {lat: number, lng: number}) => {
    setStartLocation(start);
    setEndLocation(end);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header /> {/* Include the Header component */}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Route Optimization</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <RouteForm onOptimize={handleOptimizeRoute} />
            {optimizedRoute ? (
              <>
                <p>Optimized Route Coordinates:</p>
                <ul>
                  {optimizedRoute.route.coordinates.map((coord: any, index: number) => (
                    <li key={index}>
                      Lat: {coord.lat}, Lng: {coord.lng}
                    </li>
                  ))}
                </ul>
                <p>Carbon Footprint: {optimizedRoute.carbonFootprint} kgCO2</p>
              </>
            ) : (
              <p>Loading optimized route...</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Inventory />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Carbon Footprint Calculator</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Calculator />
          </CardContent>

        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Map</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <MapComponent start={startLocation} end={endLocation} routeCoordinates={optimizedRoute?.route.coordinates || []} />
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Supply Chain Factors Prediction</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {supplyChainFactors.length > 0 ? (
              <ul>
                {supplyChainFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            ) : (
              <p>Loading supply chain factors...</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Predicted Order</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {predictedOrder.length > 0 ? (
              <ul>
                {predictedOrder.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Loading predicted order...</p>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Settings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
