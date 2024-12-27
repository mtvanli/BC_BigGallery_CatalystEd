// app/api/merchants/route.js

// Using the API route to ensure that all requests to the BigCommerce API happen server-side, 
// avoiding CORS issues. (Calling REST from a non-API route didnt work)
// This is necessary because client components inherently run in the browser 
// and are subject to CORS restrictions when calling external APIs.


import { NextResponse } from "next/server";

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const BASE_API_URL  = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`

export async function GET() {
    if (!BASE_API_URL || !API_TOKEN) {
      return NextResponse.json({ error: "API URL or token not configured." }, { status: 500 });
    }
  
    try {
      let currentPage = 1;
      let allProducts = [];
      let totalPages = 1; // Initialize with 1, will be updated after the first request
  
      do {
        const response = await fetch(
          `${BASE_API_URL}?include=custom_fields,images&limit=250&page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": API_TOKEN,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`BigCommerce API error: ${response.statusText}`);
        }
  
        const data = await response.json();
        //console.log(data)
        console.log(`Page ${currentPage}: Fetched ${data.data.length} products`);
  
        // Add products from the current page to the allProducts array
        allProducts = allProducts.concat(data.data);
  
        // Update totalPages from the first API response
        if (data.meta && data.meta.pagination) {
          totalPages = data.meta.pagination.total_pages;
          console.log(`Total pages: ${totalPages}`);
        }
  
        currentPage++; // Move to the next page
      } while (currentPage <= totalPages);
  
      console.log(`Fetched ${allProducts.length} products in total.`);
      return NextResponse.json(allProducts, { status: 200 }); // Send all products back to your frontend
    } catch (error) {
      console.error("Error fetching merchants:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }