import { NextResponse } from "next/server"

const API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN
const storeHash = process.env.BIGCOMMERCE_STORE_HASH
const BASE_API_URL = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products/channel-assignments`

export async function PUT(request: Request) {
    try {
        const { productId } = await request.json()

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
        }

        console.log("Processing request for product ID:", productId)

        const channelAssignmentPayload = [
            {
                product_id: productId,
                channel_id: 1601643,
            },
        ]

        const response = await fetch(BASE_API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": API_TOKEN || "",
            },
            body: JSON.stringify(channelAssignmentPayload),
        })

        console.log("API Response Status:", response.status, response.statusText)

        // Handle error responses
        if (!response.ok) {
            let errorDetails = "No detailed error information available"

            // Only try to parse error details if there's likely content
            if (response.headers.get("Content-Length") !== "0") {
                try {
                    errorDetails = JSON.stringify(await response.json())
                } catch {
                    errorDetails = await response.text() || errorDetails
                }
            }

            return NextResponse.json(
                {
                    error: `Error assigning merchant to channel: ${response.statusText}`,
                    details: errorDetails,
                },
                { status: response.status }
            )
        }

        // For successful responses - 204 needs special handling
        const responseData = response.status === 204
            ? { message: "Channel assignment successful" }
            : await response.json().catch(() => ({ message: "Operation completed successfully" }))

        return NextResponse.json({
            success: true,
            message: "Merchant assigned to channel successfully",
            data: responseData,
        })
    } catch (error) {
        console.error("Error in channel assignment handler:", error)
        return NextResponse.json(
            {
                error: "Failed to process channel assignment request",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}