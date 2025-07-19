'use client';

import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {MapComponent} from '@/components/Map';
import {RouteForm} from '@/components/RouteForm';
import {Calculator} from '@/components/Calculator';
import {Inventory} from '@/components/Inventory';
import {predictOrder} from '@/ai/flows/predict-order-flow';
import {optimizeRoute} from '@/ai/flows/optimize-route';
import {Header} from '@/components/Header'; // Import the Header component
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getCoordinatesFromPlaceName} from "@/services/mapping";
import {predictSupplyChainFactors, PredictSupplyChainFactorsOutput} from "@/ai/flows/predict-supply-chain-factors";
import {getGroceryProducts} from "@/services/inventory"; // Import function to fetch grocery products
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Truck} from "lucide-react";
import {generateProductName} from "@/ai/flows/generate-product-name";
import {TrendingUp, AlertTriangle, PackageCheck, Leaf} from "lucide-react";

interface PredictedOrderItem {
    item: string;
    quantity: number;
    productCategory: string;
}

const DashboardPage: React.FC = () => {
  const [predictedOrder, setPredictedOrder] = useState<PredictedOrderItem[]>([]) ;
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [mapStart, setMapStart] = useState<{lat: number, lng: number} | null>(null);
  const [mapEnd, setMapEnd] = useState<{lat: number, lng: number} | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any>([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState<number | null>(1);
  const [supplyChainFactors, setSupplyChainFactors] = useState<PredictSupplyChainFactorsOutput['factors']>([]);
  const [productCategory, setProductCategory] = useState('Electronics and High-Tech'); // Default category
  const [region, setRegion] = useState('USA'); // Default region
    const [loading, setLoading] = useState(true);
    const [newProductReleases, setNewProductReleases] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [inventoryCategory, setInventoryCategory] = useState('Electronics');
    const [newProductCategory, setNewProductCategory] = useState('Food and Beverage');

    const countries = [
        { value: 'USA', label: 'USA' },
        { value: 'Canada', label: 'Canada' },
        { value: 'UK', label: 'UK' },
        { value: 'Germany', label: 'Germany' },
        { value: 'France', label: 'France' },
        { value: 'Japan', label: 'Japan' },
        { value: 'China', label: 'China' },
        { value: 'India', label: 'India' },
        { value: 'Brazil', label: 'Brazil' },
        { value: 'Australia', label: 'Australia' },
    ];

    const industries = [
        { value: 'Food and Beverage', label: 'Food and Beverage' },
        { value: 'Consumer Packaged Goods', label: 'Consumer Packaged Goods' },
        { value: 'Process Manufacturing', label: 'Process Manufacturing' },
        { value: 'Industrial Manufacturing', label: 'Industrial Manufacturing' },
        { value: 'Chemicals', label: 'Chemicals' },
        { value: 'Durable Goods', label: 'Durable Goods' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Electronics and High-Tech', label: 'Electronics and High-Tech' },
        { value: 'Retail', label: 'Retail' },
    ];

    const inventoryCategories = [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Groceries', label: 'Groceries' },
        { value: 'Process Manufacturing', label: 'Process Manufacturing' },
    ];

    const groceryCategories = [
        { value: 'Food and Beverage', label: 'Food and Beverage' },
        { value: 'Consumer Packaged Goods', label: 'Consumer Packaged Goods' },
        { value: 'Process Manufacturing', label: 'Process Manufacturing' },
        { value: 'Industrial Manufacturing', label: 'Industrial Manufacturing' },
        { value: 'Chemicals', label: 'Chemicals' },
        { value: 'Durable Goods', label: 'Durable Goods' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Electronics and High-Tech', label: 'Electronics and High-Tech' },
        { value: 'Retail', label: 'Retail' },
    ];

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    useEffect(() => {
        // Fetch supply chain factors
        const fetchSupplyChainFactors = async () => {
            setLoading(true); // Start loading
            try {
                const result = await predictSupplyChainFactors({ productCategory, region });
                setSupplyChainFactors(result?.factors || []);
            } catch (error) {
                console.error('Error predicting supply chain factors:', error);
                setSupplyChainFactors([{factor: 'Failed to load factors', impact: 'Check connection'}]); // Provide a fallback value
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchSupplyChainFactors();
    }, [productCategory, region]);


    useEffect(() => {
        // Fetch predicted order
        const userId = 'user123';

        // Get current date and time
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const formattedTime = now.toLocaleTimeString(); // e.g., "3:30:00 PM" or "15:30:00"

        setCurrentTime(formattedTime);
        setCurrentDate(formattedDate);


        // Call the getGroceryProducts function
        getGroceryProducts()
            .then(groceryProducts => {
                if (groceryProducts && groceryProducts.length > 0) {
                    // Extract product names
                    const productNames = groceryProducts.map(product => product.productName);

                    // Call predictOrder with the extracted product names as recentOrders
                    predictOrder({
                        userId,
                        recentOrders: productNames,
                        season: '',
                        festival: '',
                        localEvent: '',
                        socialMediaTrends: '',
                        newProductReleases, // Pass the new product releases
                        currentTime: formattedTime, // Pass the current time
                        currentDate: formattedDate, // Pass the current date
                    })
                        .then(result => {
                            if (result && result.predictedOrder) {
                                setPredictedOrder(result.predictedOrder);
                            }
                        })
                        .catch(error => {
                            console.error('Error predicting order:', error);
                        });
                } else {
                    console.error('No grocery products found.');
                }
            })
            .catch(error => {
                console.error('Error fetching grocery products:', error);
            });
    }, [newProductReleases, newProductCategory, currentTime, currentDate]);

    const handleOptimizeRoute = async (start: string, end: string) => {
        try {
            const startCoords = await getCoordinatesFromPlaceName(start);
            const endCoords = await getCoordinatesFromPlaceName(end);

            if (startCoords && endCoords) {
                setMapStart(startCoords);
                setMapEnd(endCoords);

                const result = await optimizeRoute({
                    start: startCoords,
                    end: endCoords,
                    constraints: '',
                    traffic: false,
                    roadConditions: false,
                    fuelEfficiency: false
                });

                setOptimizedRoute(result);
                setRouteCoordinates(result?.route.coordinates || []);
            } else {
                console.error('Could not geocode start or end location');
            }
        } catch (error) {
            console.error('Error optimizing route:', error);
        }
    };


  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setNewQuantity(isNaN(value) ? 1 : value); // Ensure a valid number or default to 1
  };

    const handleAddItem = async () => {
        if (newItem && newQuantity !== null && newQuantity > 0) {
            // Predict product name using AI
            try {
                const productNameResult = await generateProductName({productDescription: newItem});
                const predictedProductName = productNameResult?.productName || newItem; // Use generated name or fallback

                // STUB: Determine the product category using a simple method for now
                // In a real application, you would use a more sophisticated ML model
                // to predict the product category based on the item description.
                const predictedCategory = newProductCategory; //STUB: Default to what's selected, replace with ML prediction.

                setPredictedOrder(prev => [...prev, {
                    item: predictedProductName,
                    quantity: newQuantity,
                    productCategory: predictedCategory
                }]);
                setNewItem('');
                setNewQuantity(1);
            } catch (error) {
                console.error('Error generating product name:', error);
                // Fallback: Add item with the original name and a default category
                setPredictedOrder(prev => [...prev, {
                    item: newItem,
                    quantity: newQuantity,
                    productCategory: 'Unknown'
                }]);
                setNewItem('');
                setNewQuantity(1);
            }
        }
    };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header /> {/* Include the Header component */}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
        {/* Metric Cards */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center"><Truck className="mr-2"/> Active Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="border border-solid border-border/50">
            <div className="text-3xl font-bold">42</div>
            <div className="text-sm text-green-500"><TrendingUp className="inline"/> 12% vs. last week</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center"><AlertTriangle className="mr-2"/> Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="border border-solid border-border/50">
            <div className="text-3xl font-bold">7</div>
            <div className="text-sm text-red-500">3 critical items</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center"><PackageCheck className="mr-2"/> Route Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="border border-solid border-border/50">
            <div className="text-3xl font-bold">87%</div>
            <div className="text-sm text-green-500"><TrendingUp className="inline"/> 5% vs. last month</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center"><Leaf className="mr-2"/> CO2 Reduction</CardTitle>
          </CardHeader>
          <CardContent className="border border-solid border-border/50">
            <div className="text-3xl font-bold">18.3 tons</div>
            <div className="text-sm text-green-500"><TrendingUp className="inline"/> 8% monthly improvement</div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Route Optimization</CardTitle>
          </CardHeader>
          <CardContent className="p-4 border border-solid border-border/50">
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

        {(mapStart && mapEnd) ? (
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Map</CardTitle>
              </CardHeader>
              <CardContent className="p-4 border border-solid border-border/50">
                <MapComponent start={mapStart} end={mapEnd} routeCoordinates={routeCoordinates} />
              </CardContent>
            </Card>
          ) : (
              <p>Loading Map Data...</p>
          )}

          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="p-4 border border-solid border-border/50">
                  <label htmlFor="inventoryCategory" className="block text-sm font-medium text-foreground">Inventory Category</label>
                  <Select onValueChange={setInventoryCategory} defaultValue={inventoryCategory}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                          {inventoryCategories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <Inventory category={inventoryCategory} />
              </CardContent>
          </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Carbon Footprint Calculator</CardTitle>
          </CardHeader>
          <CardContent className="p-4 border border-solid border-border/50">
            <Calculator />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Supply Chain Factors Prediction</CardTitle>
          </CardHeader>
          <CardContent className="p-4 border border-solid border-border/50">
            <label htmlFor="productCategory" className="block text-sm font-medium text-foreground">Product Category</label>
            <Select onValueChange={setProductCategory} defaultValue={productCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label htmlFor="region" className="block text-sm font-medium text-foreground">Region</label>
            <Select onValueChange={setRegion} defaultValue={region}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {loading ? (
              <p>Loading supply chain factors...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factor</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplyChainFactors.map((factor, index) => (
                    <TableRow key={index}>
                      <TableCell>{factor.factor}</TableCell>
                      <TableCell>{factor.impact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Predicted Order</CardTitle>
          </CardHeader>
          <CardContent className="p-4 border border-solid border-border/50">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div>
                <label htmlFor="newProductReleases" className="block text-sm font-medium text-foreground">New Product Releases</label>
                <Input
                  type="text"
                  id="newProductReleases"
                  placeholder="Enter new product releases"
                  value={newProductReleases}
                  onChange={(e) => setNewProductReleases(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="newProductCategory" className="block text-sm font-medium text-foreground">Product Category</label>
                <Select onValueChange={setNewProductCategory} defaultValue={newProductCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {groceryCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddItem}>Add</Button>

            {loading ? (
              <p>Loading predicted order...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictedOrder.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
