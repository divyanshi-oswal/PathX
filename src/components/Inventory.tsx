'use client';

import React, {useState, useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {getGroceryProducts, getElectronicProducts, getApparelProducts, getProcessManufacturingProducts} from '@/services/inventory'; // Import function to fetch grocery products

interface InventoryProps {
    category: string;
}

export const Inventory: React.FC<InventoryProps> = ({ category }) => {
    const [inventory, setInventory] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = [];
                switch (category) {
                    case 'Electronics':
                        data = await getElectronicProducts();
                        break;
                    case 'Apparel':
                        data = await getApparelProducts();
                        break;
                    case 'Groceries':
                        data = await getGroceryProducts();
                        break;
                    case 'Process Manufacturing':
                        data = await getProcessManufacturingProducts();
                        break;
                    default:
                        console.log('No category selected')
                        data = await getGroceryProducts();
                        break;
                }
                setInventory(data);
            } catch (error) {
                console.error("Failed to fetch inventory:", error);
            }
        };

        fetchData();
    }, [category]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your {category} products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product?.productName || product?.name || product?.Material}</TableCell>
              <TableCell>${product?.CostPerUnit?.toFixed(2) || product?.price?.toFixed(2)}</TableCell>
              <TableCell>{product?.StockLevel || product?.stock || product?.quantity}</TableCell>
              <TableCell>{product?.rating || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

