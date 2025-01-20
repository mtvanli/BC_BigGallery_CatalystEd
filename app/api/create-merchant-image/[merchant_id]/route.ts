//square brackets `[]` in folder or file names are used to create dynamic routes.
// i.e By using `[merchant_id]`, we're telling Next.js that this part of the URL will be dynamic and can change for each request.

import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const BASE_API_URL = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`

export async function POST(request: Request, { params }: { params: { merchant_id: string } }) {
    const { merchant_id } = params
  
    try {
      const { image_file, is_thumbnail } = await request.json()
  
      // Convert base64 to blob
      const base64Data = image_file.split(',')[1]; // Remove the data:image/*;base64, prefix
      const binaryData = Buffer.from(base64Data, 'base64');
  
      const formData = new FormData();
      formData.append('image_file', new Blob([binaryData], { type: 'image/jpeg' }), 'image.jpg');
      console.log(is_thumbnail)
      if (is_thumbnail !== undefined) {
        formData.append('is_thumbnail', (is_thumbnail === true).toString());
        console.log("Here")
      }
  
      console.log(formData)
        
      const response = await fetch(`${BASE_API_URL}/${merchant_id}/images`, {
        method: 'POST',
        headers: {
          'X-Auth-Token': API_TOKEN || '',
        },
        body: formData,
      })
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error creating image: ${response.statusText}. Details: ${errorText}`);
      }
  
      const updatedMerchant = await response.json()
      return NextResponse.json(updatedMerchant)
    } catch (error) {
      console.error('Error creating merchant image:', error)
      return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
  }


