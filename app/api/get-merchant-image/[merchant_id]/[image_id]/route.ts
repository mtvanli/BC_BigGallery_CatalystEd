import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const BASE_API_URL  = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`

export async function GET(request: Request, { params }: { params: { merchant_id: string, image_id: string } }) {
    const { merchant_id, image_id} = params
    console.log("hey!!!!")
    try {
        const response = await fetch(`${BASE_API_URL}/${merchant_id}/images/${image_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': API_TOKEN || '',
          },
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching merchant image: ${response.statusText}. Details: ${errorText}`)
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching merchant image:', error);
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 500 }
        );
    }
}

