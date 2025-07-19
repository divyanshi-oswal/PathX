'use client';

import React, {useEffect, useState} from 'react';
import {predictSupplyChainFactors} from '@/ai/flows/predict-supply-chain-factors';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const SupplyChainFactorsPage: React.FC = () => {
  const [supplyChainFactors, setSupplyChainFactors] = useState<string[]>([]);

  useEffect(() => {
    // Fetch supply chain factors
    predictSupplyChainFactors({productCategory: 'Electronics', region: 'USA'})
      .then(result => {
        setSupplyChainFactors(result.factors);
      })
      .catch(error => {
        console.error('Error predicting supply chain factors:', error);
      });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Supply Chain Factors Prediction</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {supplyChainFactors.length > 0 ? (
            <ul className="list-disc pl-5">
              {supplyChainFactors.map((factor, index) => (
                <li key={index} className="py-2">{factor}</li>
              ))}
            </ul>
          ) : (
            <p>Loading supply chain factors...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainFactorsPage;
