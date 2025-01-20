import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const BASE_API_URL  = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`


export async function PUT(request: Request) {
  const { id, name, search_keywords, description, is_visible,categories,custom_fields } = await request.json()

  try {
    const response = await fetch(`${BASE_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': API_TOKEN || '',
      },
      body: JSON.stringify({ 
        id,
        name,
        search_keywords, 
        description, 
        is_visible,
        categories,
        custom_fields
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

