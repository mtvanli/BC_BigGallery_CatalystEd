"use client"

import { useState, useEffect } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import * as Select from "@radix-ui/react-select"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { ArrowUpRight, RotateCcw, Loader2 } from "lucide-react"

import { RichTextEditor } from "./components/rich_text_editor"
import { ImageManager } from "./components/image_manager"
import type { Merchant, CustomField, Image } from "./types/merchant"

export default function BG_Admin_NewCase() {
  const [formData, setFormData] = useState({
    merchant: "",
    agency: "",
    presentation: "",
    region: "",
    channel: "",
    storeUrl: "",
    keywords: "",
    highlights: "",
    misc1: "",
    misc2: "",
    segment: "",
    industry: "",
    images: [] as Image[],
  })

  const [uniquePresentations, setUniquePresentations] = useState<string[]>([])
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([])
  const [uniqueChannels, setUniqueChannels] = useState<string[]>([])
  const [uniqueMiscellaneous, setUniqueMiscellaneous] = useState<string[]>([])
  const [uniqueAgencies, setUniqueAgencies] = useState<string[]>([])
  const [uniqueSegments, setUniqueSegments] = useState<string[]>([])
  const [uniqueIndustries, setUniqueIndustries] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isValidUrl, setIsValidUrl] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Fetch unique values for dropdowns
  useEffect(() => {
    const fetchUniqueValues = async () => {
      try {
        setIsLoading(true)
        const timestamp = Date.now()
        const response = await fetch(`/api/get-merchants?t=${timestamp}`, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          throw new Error(`Error fetching merchants: ${response.statusText}`)
        }

        const responseData = await response.json()

        // Debug log to see the raw data
        console.log("Raw merchant data:", responseData)

        // Extract agencies with filtering
        const agencies = [
          ...new Set(
            responseData.flatMap((m: Merchant) => {
              const agencyField = m.custom_fields.find((f) => f.name === "Agency")
              const value = agencyField?.value || ""
              return value && !["na", "na_"].includes(value.toLowerCase()) ? value : []
            }),
          ),
        ].sort((a, b) => a.localeCompare(b)) // Sort alphabetically when setting initial state

        console.log("Filtered agencies:", agencies)

        // Update the rest of the unique value extractions
        const presentations = [
          ...new Set(
            responseData.flatMap((m: Merchant) =>
              m.custom_fields
                .filter((f: CustomField) => f.name === "Presentation")
                .map((f: CustomField) => f.value)
                .filter((value) => value && !["na", "na_"].includes(value.toLowerCase())),
            ),
          ),
        ]

        const regions = [
          ...new Set(
            responseData.flatMap((m: Merchant) =>
              m.custom_fields
                .filter((f: CustomField) => f.name === "Region")
                .map((f: CustomField) => f.value)
                .filter((value) => value && !["na", "na_"].includes(value.toLowerCase())),
            ),
          ),
        ]

        const channels = [
          ...new Set(
            responseData.flatMap((m: Merchant) =>
              m.custom_fields
                .filter((f: CustomField) => f.name === "Channel")
                .map((f: CustomField) => f.value)
                .filter((value) => value && !["na", "na_"].includes(value.toLowerCase())),
            ),
          ),
        ]

        const miscellaneous = [
          ...new Set(
            responseData.flatMap((m: Merchant) =>
              m.custom_fields
                .filter((f: CustomField) => f.name.startsWith("Misc"))
                .map((f: CustomField) => f.value)
                .filter((value) => value && !["na", "na_"].includes(value.toLowerCase())),
            ),
          ),
        ]

        // Extract segments
        const segments = [
          ...new Set(
            responseData.flatMap((m: Merchant) =>
              m.custom_fields
                .filter((f: CustomField) => f.name === "Segment")
                .map((f: CustomField) => f.value)
                .filter((value) => value && !["na", "na_"].includes(value.toLowerCase())),
            ),
          ),
        ]

        // Extract industries
        const industries = [
          ...new Set(
            responseData.flatMap((m: Merchant) =>
              m.custom_fields
                .filter((f: CustomField) => f.name === "Industry")
                .map((f: CustomField) => f.value)
                .filter((value) => value && !["na", "na_"].includes(value.toLowerCase())),
            ),
          ),
        ]

        // Set the state values with filtered data
        setUniquePresentations(presentations.filter(Boolean))
        setUniqueRegions(regions.filter(Boolean))
        setUniqueChannels(channels.filter(Boolean))
        setUniqueMiscellaneous(miscellaneous.filter(Boolean))
        setUniqueAgencies(agencies)
        setUniqueSegments(segments.filter(Boolean))
        setUniqueIndustries(industries.filter(Boolean))

        // Debug log to confirm state update
        console.log("Filtered agencies set to:", agencies.filter(Boolean))
      } catch (error) {
        console.error("Error fetching unique values:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUniqueValues()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const list = document.getElementById("agency-list")
      if (list && !list.contains(event.target as Node)) {
        list.style.display = "none"
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "storeUrl") {
      setIsValidUrl(value === "" || isValidURL(value))
    }
  }

  const handleHighlightsChange = (content: string) => {
    setFormData((prev) => ({ ...prev, highlights: content }))
  }

  const handleImageChange = (index: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImageUrl = e.target?.result as string
      setFormData((prev) => {
        const updatedImages = [...prev.images]

        if (index === 0) {
          // Handle thumbnail
          const existingThumbnailIndex = updatedImages.findIndex((img) => img.is_thumbnail)
          if (existingThumbnailIndex !== -1) {
            updatedImages[existingThumbnailIndex] = {
              ...updatedImages[existingThumbnailIndex],
              url_standard: newImageUrl,
              file: file,
            }
          } else {
            updatedImages.unshift({
              id: 0,
              url_standard: newImageUrl,
              is_thumbnail: true,
              file: file,
            })
          }
        } else {
          // Handle non-thumbnail images
          const nonThumbnailImages = updatedImages.filter((img) => !img.is_thumbnail)
          const positionIndex = index - 1

          if (positionIndex < nonThumbnailImages.length) {
            const targetIndex = updatedImages.findIndex((img) => img === nonThumbnailImages[positionIndex])
            updatedImages[targetIndex] = {
              ...updatedImages[targetIndex],
              url_standard: newImageUrl,
              file: file,
            }
          } else {
            updatedImages.push({
              id: 0,
              url_standard: newImageUrl,
              is_thumbnail: false,
              file: file,
            })
          }
        }

        return { ...prev, images: updatedImages }
      })
    }
    reader.readAsDataURL(file)
  }

  const handleImageReset = (index: number) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images]

      if (index === 0) {
        // Reset thumbnail
        const thumbnailIndex = updatedImages.findIndex((img) => img.is_thumbnail)
        if (thumbnailIndex !== -1) {
          updatedImages.splice(thumbnailIndex, 1)
        }
      } else {
        // Reset specific non-thumbnail image
        const nonThumbnailImages = updatedImages.filter((img) => !img.is_thumbnail)
        const targetPosition = index - 1

        if (targetPosition < nonThumbnailImages.length) {
          const targetIndex = updatedImages.findIndex((img) => img === nonThumbnailImages[targetPosition])
          if (targetIndex !== -1) {
            updatedImages.splice(targetIndex, 1)
          }
        }
      }

      return { ...prev, images: updatedImages }
    })
  }

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleReset = () => {
    setFormData({
      merchant: "",
      agency: "",
      presentation: "",
      region: "",
      channel: "",
      storeUrl: "",
      keywords: "",
      highlights: "",
      misc1: "",
      misc2: "",
      segment: "",
      industry: "",
      images: [],
    })
    setSubmitStatus(null)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.merchant) {
      setSubmitStatus({
        success: false,
        message: "Merchant name is required",
      })
      return
    }

    if (!formData.presentation) {
      setSubmitStatus({
        success: false,
        message: "Presentation is required",
      })
      return
    }

    if (!formData.region) {
      setSubmitStatus({
        success: false,
        message: "Region is required",
      })
      return
    }

    if (!isValidUrl || !formData.storeUrl) {
      setSubmitStatus({
        success: false,
        message: "Please enter a valid store URL",
      })
      return
    }

    // Determine merchant category based on region
    let merchantCategory = [33]
    switch (formData.region) {
      case "UK":
      case "IT":
      case "NL":
      case "FR":
      case "ES":
      case "DE":
      case "EMEA - Other":
        merchantCategory = [33, 36]
        break
      case "AU":
      case "SG":
      case "IN":
      case "JP":
      case "NZ":
      case "APAC - Other":
        merchantCategory = [33, 35]
        break
      case "US":
      case "CA":
      case "LATAM":
        merchantCategory = [33, 34]
        break
      case "Global":
        merchantCategory = [33]
        break
    }

    try {
      setIsSubmitting(true)
      setSubmitStatus(null)

      // Create merchant
      const response = await fetch("/api/create-merchant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          New_merchant_name: formData.merchant,
          New_MerchantKeywords: formData.keywords,
          New_MerchantHighlights: formData.highlights,
          New_MerchantPresentation: formData.presentation,
          New_MerchantRegion: formData.region,
          New_MerchantSegment: formData.segment,
          New_MerchantIndustry: formData.industry,
          New_MerchantAgency: formData.agency,
          New_MerchantChannel: formData.channel,
          New_MerchantStore: formData.storeUrl,
          New_MerchantMisc: formData.misc1,
          New_MerchantMisc2: formData.misc2,
          merchantCategory: merchantCategory,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create merchant")
      }

      // Step 2: Assign the merchant to a channel
      const productId = result.productId
      console.log("Extracted product ID for channel assignment:", productId)

      const channelResponse = await fetch("/api/put-merchant-to-channel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
      })

      console.log("Channel assignment response:", channelResponse.status, channelResponse.statusText)
      const channelResult = await channelResponse.json()
      console.log("Channel assignment result:", channelResult)

      if (!channelResponse.ok) {
        console.error("Channel API error details:", channelResult)
        throw new Error(channelResult.error || "Failed to assign merchant to channel")
      }

      setSubmitStatus({
        success: true,
        message: "Merchant created successfully!",
      })


      // Step 3: Upload images if there are any
      const imageResults = []
      const imageErrors = []

      if (formData.images && formData.images.length > 0) {
        console.log(`Uploading ${formData.images.length} images for merchant ID ${productId}...`)

        for (let i = 0; i < formData.images.length; i++) {
          const image = formData.images[i]

          if (image && image.file) {
            // Convert the file to base64
            const base64Image = await fileToBase64(image.file)

            const createResponse = await fetch(`/api/create-merchant-image/${productId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image_file: base64Image,
                is_thumbnail: i === 0,
              }),

            })

            if (!createResponse.ok) {
              throw new Error(`Error creating image: ${createResponse.statusText}`);
            }


          }


        }

        // Optional: Reset form after successful submission
        // handleReset()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Add Reference Store</h1>

      {submitStatus && (
        <div
          className={`p-4 mb-4 rounded-md ${submitStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Merchant <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter merchant name"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.merchant}
                onChange={(e) => handleInputChange("merchant", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Segment</label>
              <Select.Root value={formData.segment} onValueChange={(value) => handleInputChange("segment", value)}>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Select segment" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      {isLoading ? (
                        <Select.Item
                          value="loading"
                          className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>Loading...</Select.ItemText>
                        </Select.Item>
                      ) : (
                        uniqueSegments.map((segment) => (
                          <Select.Item
                            key={segment}
                            value={segment}
                            className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <Select.ItemText>{segment}</Select.ItemText>
                          </Select.Item>
                        ))
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Presentation <span className="text-red-500">*</span>
              </label>
              <Select.Root
                value={formData.presentation}
                onValueChange={(value) => handleInputChange("presentation", value)}
              >
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Stencil or Headless ?" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white">
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-1">
                      {isLoading ? (
                        <Select.Item
                          value="loading"
                          className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>Loading...</Select.ItemText>
                        </Select.Item>
                      ) : (
                        uniquePresentations.map((presentation) => (
                          <Select.Item
                            key={presentation}
                            value={presentation}
                            className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <Select.ItemText>{presentation}</Select.ItemText>
                          </Select.Item>
                        ))
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Channel</label>
              <Select.Root value={formData.channel} onValueChange={(value) => handleInputChange("channel", value)}>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Select channel" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      {isLoading ? (
                        <Select.Item
                          value="loading"
                          className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>Loading...</Select.ItemText>
                        </Select.Item>
                      ) : (
                        uniqueChannels.map((channel) => (
                          <Select.Item
                            key={channel}
                            value={channel}
                            className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <Select.ItemText>{channel}</Select.ItemText>
                          </Select.Item>
                        ))
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Store Url <span className="text-red-500">*</span>
              </label>
              <div className="space-y-1">
                <input
                  type="url"
                  placeholder="Enter the store URL"
                  className={`w-full px-3 py-2 border rounded-md ${!isValidUrl ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  value={formData.storeUrl}
                  onChange={(e) => handleInputChange("storeUrl", e.target.value)}
                />
                {!isValidUrl && (
                  <p className="text-sm text-red-500">Please enter a valid URL (e.g., https://www.example.com)</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Agency</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Which agency built the store?"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.agency}
                  onChange={(e) => {
                    handleInputChange("agency", e.target.value)
                    const list = document.getElementById("agency-list")
                    if (list) list.style.display = "block"
                  }}
                  onFocus={() => {
                    const list = document.getElementById("agency-list")
                    if (list) list.style.display = "block"
                  }}
                />
                <div
                  id="agency-list"
                  className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto hidden"
                >
                  {uniqueAgencies.length === 0 ? (
                    <div className="px-3 py-2 text-gray-500">No agencies found</div>
                  ) : (
                    uniqueAgencies
                      .filter(
                        (agency) =>
                          formData.agency === ""
                            ? true
                            : // Show all when input is empty
                            agency
                              .toLowerCase()
                              .includes(formData.agency.toLowerCase()), // Filter when typing
                      )
                      .sort((a, b) => {
                        const searchTerm = formData.agency.toLowerCase()
                        const aStartsWith = a.toLowerCase().startsWith(searchTerm)
                        const bStartsWith = b.toLowerCase().startsWith(searchTerm)

                        if (aStartsWith && !bStartsWith) return -1
                        if (!aStartsWith && bStartsWith) return 1
                        return a.localeCompare(b) // Alphabetical sort for non-exact matches
                      })
                      .map((agency, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleInputChange("agency", agency)
                            const list = document.getElementById("agency-list")
                            if (list) list.style.display = "none"
                          }}
                        >
                          {agency}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Region <span className="text-red-500">*</span>
              </label>
              <Select.Root value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Select the region" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      {isLoading ? (
                        <Select.Item
                          value="loading"
                          className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>Loading...</Select.ItemText>
                        </Select.Item>
                      ) : (
                        uniqueRegions.map((region) => (
                          <Select.Item
                            key={region}
                            value={region}
                            className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <Select.ItemText>{region}</Select.ItemText>
                          </Select.Item>
                        ))
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Industry</label>
              <Select.Root
                value={formData.industry}
                onValueChange={(value) => handleInputChange("industry", value)}
              >
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Select industry" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      {isLoading ? (
                        <Select.Item
                          value="loading"
                          className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>Loading...</Select.ItemText>
                        </Select.Item>
                      ) : (
                        uniqueIndustries.map((industry) => (
                          <Select.Item
                            key={industry}
                            value={industry}
                            className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <Select.ItemText>{industry}</Select.ItemText>
                          </Select.Item>
                        ))
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Misc</label>
              <Select.Root value={formData.misc1} onValueChange={(value) => handleInputChange("misc1", value)}>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Key feature 1" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      {isLoading ? (
                        <Select.Item
                          value="loading"
                          className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>Loading...</Select.ItemText>
                        </Select.Item>
                      ) : (
                        uniqueMiscellaneous.map((misc) => (
                          <Select.Item
                            key={misc}
                            value={misc}
                            className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <Select.ItemText>{misc}</Select.ItemText>
                          </Select.Item>
                        ))
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <Select.Root value={formData.misc2} onValueChange={(value) => handleInputChange("misc2", value)}>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Key feature 2" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      {isLoading ? (
                        <Select.Item
                          value="loading"
                          className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>Loading...</Select.ItemText>
                        </Select.Item>
                      ) : (
                        uniqueMiscellaneous.map((misc) => (
                          <Select.Item
                            key={misc}
                            value={misc}
                            className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <Select.ItemText>{misc}</Select.ItemText>
                          </Select.Item>
                        ))
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Keywords</label>
          <input
            type="text"
            placeholder="Enter comma separated keywords"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.keywords}
            onChange={(e) => handleInputChange("keywords", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Highlights</label>
          <RichTextEditor content={formData.highlights} onChange={handleHighlightsChange} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Images</label>
          <ImageManager
            images={formData.images}
            onImageChange={handleImageChange}
            onImageReset={handleImageReset}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <ArrowUpRight className="h-4 w-4" />
              Publish
            </>
          )}
        </button>
      </div>

    </div>
  )
}


