import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const BASE_API_URL = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`

export async function PUT(request: Request, { params }: { params: { merchant_id: string, image_id: string } }) {
  const { is_thumbnail } = await request.json()
  const { merchant_id, image_id } = params

  console.log('Request payload:', { is_thumbnail, merchant_id, image_id });


  try {
    // Create the request body as a JSON object
    const requestBody = {
      is_thumbnail: is_thumbnail
    };


    const response = await fetch(`${BASE_API_URL}/${merchant_id}/images/${image_id}`, {
      method: 'PUT',
      headers: {
        'X-Auth-Token': API_TOKEN || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody), // Send as JSON string
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Full error response:', errorText);
      throw new Error(`Error updating merchant: ${response.statusText}: ${errorText}`);
    }

    const updatedMerchant = await response.json()
    return NextResponse.json(updatedMerchant)
  } catch (error) {
    console.error('Error updating merchant:', error)
    return NextResponse.json({ error: `Failed to update merchant: ${error.message}` }, { status: 500 })
  }
}

