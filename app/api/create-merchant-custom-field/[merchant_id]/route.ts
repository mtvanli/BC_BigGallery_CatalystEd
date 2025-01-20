//square brackets `[]` in folder or file names are used to create dynamic routes.
// i.e By using `[merchant_id]`, we're telling Next.js that this part of the URL will be dynamic and can change for each request.

import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const BASE_API_URL  = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`


export async function PUT(request: Request, { params }: { params: { merchant_id: string } }) {
  const { custom_field_name, custom_field_value } = await request.json()
  const { merchant_id } = params

  try {
    const response = await fetch(`${BASE_API_URL}/${merchant_id}/custom-fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': API_TOKEN || '',
      },
      body: JSON.stringify({ 
        "name": custom_field_name,
        "value": custom_field_value
       }),
    })

    if (!response.ok) {
      throw new Error(`Error updating merchant: ${response.statusText}`)
    }

    const updatedMerchant = await response.json()
    return NextResponse.json(updatedMerchant)
  } catch (error) {
    console.error('Error updating merchant:', error)
    return NextResponse.json({ error: 'Failed to update merchant' }, { status: 500 })
  }
}

