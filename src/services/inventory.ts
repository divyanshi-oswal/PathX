'use server';

import groceries from '@/app/api/groceries/groceries.json'; // Direct import of the JSON data
import electronics from '@/app/api/electronics/electronics.json';
import apparel from '@/app/api/apparel/apparel.json';
import processManufacturing from '@/app/api/processManufacturing/processManufacturing.json';

import {generateProductName} from '@/ai/flows/generate-product-name';

export async function getGroceryProducts() {
  // Since we're directly importing the JSON, no need to fetch.
  const data = groceries;

  if (!data) {
    console.error('No products found in inventory.');
    return []; // Return an empty array to avoid further errors.
  }

  return data;
}

export async function getElectronicProducts() {
    const data = electronics;

    if (!data) {
        console.error('No electronic products found in inventory.');
        return [];
    }

    return data;
}

export async function getApparelProducts() {
    const data = apparel;

    if (!data) {
        console.error('No apparel products found in inventory.');
        return [];
    }

    return data;
}

export async function getProcessManufacturingProducts() {
    const data = processManufacturing;

    if (!data) {
        console.error('No process manufacturing products found in inventory.');
        return [];
    }

    return data;
}

