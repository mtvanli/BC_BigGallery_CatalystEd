import { NextResponse } from "next/server"

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH
const BASE_API_URL = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`

export async function PUT(request: Request) {
  const {
    New_merchant_name,
    New_MerchantKeywords,
    New_MerchantHighlights,
    New_MerchantPresentation,
    New_MerchantRegion,
    New_MerchantSegment,
    New_MerchantIndustry,
    New_MerchantAgency,
    New_MerchantChannel,
    New_MerchantStore,
    New_MerchantMisc,
    New_MerchantMisc2,
    merchantCategory,
  } = await request.json()

  try {
    // Create the product payload with all required fields
    const productPayload = {
      name: New_merchant_name,
      type: "physical",
      weight: 1,
      price: 99,
      search_keywords: New_MerchantKeywords || "",
      description: New_MerchantHighlights || "",
      categories: merchantCategory || [33],
      custom_fields: [
        {
          name: "Presentation",
          value: New_MerchantPresentation === "" ? "na" : New_MerchantPresentation,
        },
        {
          name: "Region",
          value: New_MerchantRegion === "" ? "na" : New_MerchantRegion,
        },
        {
          name: "Segment",
          value: New_MerchantSegment === "" ? "na" : New_MerchantSegment,
        },
        {
          name: "Industry",
          value: New_MerchantIndustry === "" ? "na" : New_MerchantIndustry,
        },
        {
          name: "Agency",
          value: New_MerchantAgency === "" ? "na" : New_MerchantAgency,
        },
        {
          name: "Channel",
          value: New_MerchantChannel === "" ? "na" : New_MerchantChannel,
        },
        {
          name: "Store",
          value: New_MerchantStore === "" ? "na" : New_MerchantStore,
        },
        {
          name: "Misc",
          value: New_MerchantMisc === "" ? "na" : New_MerchantMisc,
        },
        {
          name: "Misc",
          value: New_MerchantMisc2 === "" ? "na_" : New_MerchantMisc2,
        },
      ],
      is_visible: true,
    }

    console.log("Sending product payload:", JSON.stringify(productPayload, null, 2))

    const response = await fetch(`${BASE_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": API_TOKEN || "",
      },
      body: JSON.stringify(productPayload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("BigCommerce API error:", responseData)
      return NextResponse.json(
        {
          error: `Error creating merchant: ${response.statusText}`,
          details: responseData,
        },
        { status: response.status },
      )
    }

    // Extract the product ID from the response
    const productId = responseData.data?.id
    console.log(productId)
    return NextResponse.json({
      success: true,
      message: "Merchant created successfully",
      data: responseData.data,
      productId: productId,
    })
  } catch (error) {
    console.error("Error creating merchant:", error)
    return NextResponse.json({ error: "Failed to create merchant" }, { status: 500 })
  }
}
