import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Upload, Save } from 'lucide-react'
import { type Merchant, type Image } from './types/merchant'
import { RichTextEditor } from './components/rich_text_editor'
import { MerchantList } from './components/merchant_list'
import { ImageManager } from './components/image_manager'
import { MerchantForm } from './components/merchant_form'
import { toast } from 'react-hot-toast'

export default function BG_Admin_Update() {
  //const [searchTerm, setSearchTerm] = useState("")
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [originalMerchant, setOriginalMerchant] = useState<Merchant | null>(null);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [uniqueSegments, setUniqueSegments] = useState<string[]>([]);
  const [uniquePresentations, setUniquePresentations] = useState<string[]>([]);
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);
  const [uniqueIndustries, setUniqueIndustries] = useState<string[]>([]);
  const [uniqueChannels, setUniqueChannels] = useState<string[]>([]);
  const [uniqueMiscellaneous, setUniqueMiscellaneous] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [highlights, setHighlights] = useState<string>('')

  // const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleMerchantClick = useCallback((merchant: Merchant) => {
    console.log("Merchant clicked:", merchant.name)
    console.log("Merchant highlights:", merchant.description)
    setSelectedMerchant({ ...merchant });
    setOriginalMerchant({ ...merchant }); // Store the original state
    setKeywords(merchant.search_keywords || '');
    setIsVisible(merchant.is_visible === true);
    setOriginalImages(merchant.images.map(img => img.url_standard));
    setHighlights(merchant.description || '')
  }, []);

  const fetchMerchants = useCallback(async (): Promise<Merchant[]> => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/get-merchants?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching merchants: ${response.statusText}`);
      }

      const responseData: Merchant[] = await response.json();
      console.log("API Response Data:", responseData);
      setMerchants(responseData);

      const sortedMerchants = sortMerchants(responseData);
      setMerchants(sortedMerchants)

      // If a merchant is currently selected, update its data
      if (selectedMerchant) {
        const updatedSelectedMerchant = sortedMerchants.find(m => m.id === selectedMerchant.id);
        if (updatedSelectedMerchant) {
          setSelectedMerchant(updatedSelectedMerchant);
          setOriginalMerchant(updatedSelectedMerchant);
        } else {
          // If the previously selected merchant is no longer in the list, select the first merchant
          if (sortedMerchants.length > 0 && sortedMerchants[0]) {
            handleMerchantClick(sortedMerchants[0]);
          } else {
            setSelectedMerchant(null);
            setOriginalMerchant(null);
          }
        }
      } else {
        // If no merchant was previously selected, select the first one
        if (sortedMerchants.length > 0 && sortedMerchants[0]) {
          handleMerchantClick(sortedMerchants[0]);
        }
      }

      /*   // Select the first merchant from the sorted list by default
      if (sortedMerchants.length > 0 && sortedMerchants[0]) {
        handleMerchantClick(sortedMerchants[0])
      } */

      // Extract unique values for dropdowns
      const segments = [...new Set(responseData.flatMap(m => m.custom_fields.filter(f => f.name === 'Segment').map(f => f.value)))]
      const presentations = [...new Set(responseData.flatMap(m => m.custom_fields.filter(f => f.name === 'Presentation').map(f => f.value)))]
      const regions = [...new Set(responseData.flatMap(m => m.custom_fields.filter(f => f.name === 'Region').map(f => f.value)))]
      const industries = [...new Set(responseData.flatMap(m => m.custom_fields.filter(f => f.name === 'Industry').map(f => f.value)))]
      const channels = [...new Set(responseData.flatMap(m => m.custom_fields.filter(f => f.name === 'Channel').map(f => f.value)))]
      const miscellaneous = [...new Set(responseData.flatMap(m => m.custom_fields.filter(f => f.name.startsWith('Misc')).map(f => f.value)))]

      setUniqueSegments(segments.filter(s => s && !['na', 'na_'].includes(s.toLowerCase())))
      setUniquePresentations(presentations.filter(Boolean))
      setUniqueRegions(regions.filter(Boolean))
      setUniqueIndustries(industries.filter(Boolean))
      setUniqueChannels(channels.filter(c => c && !['na', 'na_'].includes(c.toLowerCase())))
      setUniqueMiscellaneous(miscellaneous.filter(m => m && !['na', 'na_'].includes(m.toLowerCase())))


      return sortedMerchants;

    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Failed to fetch merchants. Please try again.")
      return [];
    }
  }, [selectedMerchant, handleMerchantClick])



  const handleMerchantChange = (updatedMerchant: Partial<Merchant>) => {
    setSelectedMerchant((prev) => prev ? { ...prev, ...updatedMerchant } : null)
  }

  // In admin_update.tsx

  const handleFileChange = (index: number, file: File) => {
    if (selectedMerchant) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string
        setSelectedMerchant((prev) => {
          if (!prev) return null

          const updatedImages = [...prev.images]

          if (index === 0) {
            // Handle thumbnail (first position)
            const existingThumbnailIndex = updatedImages.findIndex(img => img.is_thumbnail)

            if (existingThumbnailIndex !== -1) {
              // Update existing thumbnail
              updatedImages[existingThumbnailIndex] = {
                ...updatedImages[existingThumbnailIndex],
                url_standard: newImageUrl,
                file: file
              }
            } else {
              // Create new thumbnail
              updatedImages.unshift({
                id: 0,
                url_standard: newImageUrl,
                is_thumbnail: true,
                file: file
              })
            }
          } else {
            // Handle non-thumbnail images (positions 1 and 2)
            const nonThumbnailImages = updatedImages.filter(img => !img.is_thumbnail)
            const positionIndex = index - 1  // Convert to 0-based index for non-thumbnails

            // Find all existing non-thumbnail images
            const nonThumbnailIndices = updatedImages
              .map((img, idx) => ({ img, idx }))
              .filter(({ img }) => !img.is_thumbnail)
              .map(({ idx }) => idx)

            if (positionIndex < nonThumbnailIndices.length) {
              // Update existing image at this position
              const targetIndex = nonThumbnailIndices[positionIndex]
              updatedImages[targetIndex] = {
                ...updatedImages[targetIndex],
                url_standard: newImageUrl,
                file: file
              }
            } else {
              // Add new image for this position
              updatedImages.push({
                id: 0,
                url_standard: newImageUrl,
                is_thumbnail: false,
                file: file
              })
            }
          }

          return { ...prev, images: updatedImages }
        })
      }
      reader.readAsDataURL(file)
    }
  }



  const handleReset = (index: number) => {
    if (selectedMerchant && originalMerchant) {
      const updatedImages = [...selectedMerchant.images]
      const originalImages = [...originalMerchant.images]

      if (index === 0) {
        // Reset thumbnail
        const originalThumbnail = originalImages.find(img => img.is_thumbnail)
        const currentThumbnailIndex = updatedImages.findIndex(img => img.is_thumbnail)

        if (originalThumbnail && currentThumbnailIndex !== -1) {
          // Replace current thumbnail with original
          updatedImages[currentThumbnailIndex] = {
            ...originalThumbnail,
            file: undefined
          }
        }
      } else {
        // Reset specific non-thumbnail image
        const originalNonThumbnails = originalImages.filter(img => !img.is_thumbnail)
        const currentNonThumbnails = updatedImages.filter(img => !img.is_thumbnail)
        const targetPosition = index - 1

        if (targetPosition < originalNonThumbnails.length) {
          // Find the current image at this position
          const currentImageIndex = updatedImages.findIndex(
            img => img === currentNonThumbnails[targetPosition]
          )

          if (currentImageIndex !== -1) {
            // Replace with original image
            updatedImages[currentImageIndex] = {
              ...originalNonThumbnails[targetPosition],
              file: undefined
            }
          }
        } else {
          // If we're resetting a newly added image, remove it
          const currentImageIndex = updatedImages.findIndex(
            img => img === currentNonThumbnails[targetPosition]
          )
          if (currentImageIndex !== -1) {
            updatedImages.splice(currentImageIndex, 1)
          }
        }
      }

      // Update the merchant with reset images
      setSelectedMerchant({ ...selectedMerchant, images: updatedImages })

      // Reset the file input
      const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    }
  };


  //  for the master reset
  const handleMasterReset = () => {
    if (originalMerchant) {
      setSelectedMerchant({ ...originalMerchant });
      setKeywords(originalMerchant.search_keywords || '');
      setIsVisible(originalMerchant.is_visible === true);
      setHighlights(originalMerchant.description || '')
    }
  }

  const sortMerchants = (merchants: Merchant[]): Merchant[] => {
    return [...merchants].sort((a, b) => a.name.trim().localeCompare(b.name.trim()));
  };

  const getCategoryByRegion = (region: string): number[] => {
    switch (region) {
      case 'UK':
      case 'IT':
      case 'NL':
      case 'FR':
      case 'ES':
      case 'DE':
      case 'EMEA - Other':
        return [33, 36];
      case 'AU':
      case 'SG':
      case 'IN':
      case 'JP':
      case 'NZ':
      case 'APAC - Other':
        return [33, 35];
      case 'US':
      case 'CA':
      case 'LATAM':
        return [33, 34];
      case 'Global':
        return [33];
      default:
        return [];
    }
  };

  const [isLoading, setIsLoading] = useState(false);

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


  const handleSave = useCallback(async () => {

    if (selectedMerchant && originalMerchant && !isLoading) {
      setIsLoading(true)

      const getFieldValue = (fieldName: string, merchant: Merchant): string => {
        const field = merchant.custom_fields.find(f => f.name === fieldName);
        return field ? field.value : '';
      };

      const hasFieldChanged = (fieldName: string): boolean => {
        return getFieldValue(fieldName, selectedMerchant) !== getFieldValue(fieldName, originalMerchant);
      };

      const updateCustomField = async (fieldName: string) => {
        const newValue = getFieldValue(fieldName, selectedMerchant);
        const field = selectedMerchant.custom_fields.find(f => f.name === fieldName);

        if (field) {
          const response = await fetch(`/api/update-merchant-custom-field/${selectedMerchant.id}/${field.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              custom_field_id: field.id,
              custom_field_name: fieldName,
              custom_field_value: newValue,
            }),
          });

          if (!response.ok) {
            throw new Error(`Error updating custom field ${fieldName}: ${response.statusText}`);
          }
        } else {
          throw new Error(`Custom field ${fieldName} not found`);
        }
      };

      const createCustomField = async (fieldName: string) => {
        const newValue = getFieldValue(fieldName, selectedMerchant);

        const response = await fetch(`/api/create-merchant-custom-field/${selectedMerchant.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            custom_field_name: fieldName,
            custom_field_value: newValue,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error creating custom field ${fieldName}: ${response.statusText}`);
        }
      };

      const customFieldsToUpdate = ['Region', 'Presentation', 'Store', 'Segment', 'Channel', 'Agency', 'Industry'];
      const changedCustomFields = customFieldsToUpdate.filter(hasFieldChanged);

      const newRegion = getFieldValue('Region', selectedMerchant);
      const originalRegion = getFieldValue('Region', originalMerchant);
      const regionChanged = newRegion !== originalRegion;

      // Check if images have changed or new ones are added
      const imagesChanged = selectedMerchant.images.some((img, index) => {
        console.log("Images changed")
        return img.url_standard !== (originalImages[index] || '');
      });

      // Check if any relevant fields have changed
      const hasChanges =
        selectedMerchant.name !== originalMerchant.name ||
        selectedMerchant.search_keywords !== originalMerchant.search_keywords ||
        selectedMerchant.description !== originalMerchant.description ||
        selectedMerchant.is_visible !== originalMerchant.is_visible ||
        regionChanged ||
        changedCustomFields.length > 0 ||
        selectedMerchant.custom_fields.filter(f => f.name === 'Misc').some((f, i) =>
          f.value !== (originalMerchant.custom_fields.filter(of => of.name === 'Misc')[i]?.value || '')
        ) ||
        imagesChanged;

      if (hasChanges) {
        try {
          const updateData: any = {
            id: selectedMerchant.id,
            name: selectedMerchant.name,
            search_keywords: selectedMerchant.search_keywords,
            description: selectedMerchant.description,
            is_visible: selectedMerchant.is_visible,
            custom_fields: selectedMerchant.custom_fields.filter(f => f.name === 'Misc'),
          };

          if (regionChanged) {
            updateData.categories = getCategoryByRegion(newRegion);
          }

          const response = await fetch('/api/update-merchant', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });

          if (!response.ok) {
            throw new Error(`Error updating merchant: ${response.statusText}`);
          }

          // Update or create custom fields
          for (const fieldName of changedCustomFields) {
            const existingField = selectedMerchant.custom_fields.find(f => f.name === fieldName);
            if (existingField) {
              await updateCustomField(fieldName);
            } else {
              await createCustomField(fieldName);
            }
          }


          // Handle image updates
          const thumbnailImage = selectedMerchant.images.find(img => img.is_thumbnail);
          const nonThumbnailImages = selectedMerchant.images.filter(img => !img.is_thumbnail);
          const orderedImages = thumbnailImage ? [thumbnailImage, ...nonThumbnailImages] : nonThumbnailImages;


          for (let i = 0; i < orderedImages.length; i++) {
            const currentImage = orderedImages[i];
            const originalImageUrl = originalImages[i];

            if (currentImage && currentImage.file) {  // Check if there's a new file to upload

              let sortOrder

              if (originalImageUrl) {

                //before delete store the sort order
                console.log(`Fetching sort order for merchant ${selectedMerchant.id}, image ${currentImage.id}`);
                console.log(selectedMerchant.id, currentImage.id);
                const sortOrderResponse = await fetch(`/api/get-merchant-image/${selectedMerchant.id}/${currentImage.id}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  }
                })

                console.log('Sort order response status:', sortOrderResponse.status);

                if (!sortOrderResponse.ok) {
                  throw new Error(`Error getting image sort order: ${sortOrderResponse.statusText}`);
                }

                const sortOrderData = await sortOrderResponse.json();
                sortOrder = sortOrderData.data.sort_order;
                console.log('Sort Order:', sortOrder);

                console.log("Deleting original image with URL:", originalImageUrl);
                // Delete existing image first
                const deleteResponse = await fetch(`/api/delete-merchant-image/${selectedMerchant.id}/${currentImage.id}`, {
                  method: 'DELETE',
                });
                if (!deleteResponse.ok) {
                  throw new Error(`Error deleting image: ${deleteResponse.statusText}`);
                }
              }


              // Wait a brief moment after deletion
              await new Promise(resolve => setTimeout(resolve, 500));

              // Create new image
              const base64 = await fileToBase64(currentImage.file);
              console.log("Creating image at index:", i);
              const createResponse = await fetch(`/api/create-merchant-image/${selectedMerchant.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  image_file: base64,
                  is_thumbnail: i === 0,
                }),
              });

              if (!createResponse.ok) {
                throw new Error(`Error creating image: ${createResponse.statusText}`);
              }

              // Parse the JSON response
              const responseData = await createResponse.json();

              // Access the `data` object and `data.id`
              const image_id = responseData.data.id;
              console.log('Data ID:', image_id);

              // Wait a brief moment after creation
              await new Promise(resolve => setTimeout(resolve, 500));

              const updateResponse = await fetch(`/api/update-merchant-image/${selectedMerchant.id}/${image_id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  is_thumbnail: i === 0,
                })
              })

              if (!updateResponse.ok) {
                throw new Error(`Error updating thumbnail status: ${updateResponse.statusText}`);
              }

            }
          }

          // Fetch updated merchant data
          const updatedMerchants = await fetchMerchants();

          // Important: Wait for the state to be updated
          await new Promise(resolve => setTimeout(resolve, 100));

          // Find the updated merchant in the new list
          const updatedMerchant = updatedMerchants.find(m => m.id === selectedMerchant.id);
          if (updatedMerchant) {
            setSelectedMerchant(updatedMerchant);
            setOriginalMerchant(updatedMerchant);

            // Update other related states
            setKeywords(updatedMerchant.search_keywords || '');
            setIsVisible(updatedMerchant.is_visible === true);
            setHighlights(updatedMerchant.description || '');
            setOriginalImages(updatedMerchant.images.map(img => img.url_standard));
          }

          toast.success("Merchant updated successfully");
        } catch (error) {
          console.error("Error saving merchant:", error);
          toast.error("Failed to update merchant. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        toast("No changes to save");
      }
    }
  }, [selectedMerchant, originalMerchant, fetchMerchants]);


  // Fetch merchants data on component mount
  useEffect(() => {
    fetchMerchants()
  }, [])


  return (

    <div className="container mx-auto p-1 max-w-7xl" >
      <div className="flex flex-col lg:flex-row gap-6" >
        {/* <div className="w-full lg:w-64 space-y-4"> */}
        {selectedMerchant ? (
          <MerchantList
            merchants={sortMerchants(merchants)}
            selectedMerchant={selectedMerchant}
            onMerchantSelect={handleMerchantClick}
          />
        ) : (
          <div className="md:col-span-2 p-8 bg-gray-50 rounded-lg border border-gray-200 h-[1300px] flex  justify-center">
            <div className="flex flex-col items-center space-y-4 pt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-600 text-sm">Loading merchants...</p>
            </div>
          </div>
        )}
        <div className="flex-1 space-y-6">

          {selectedMerchant && (
            <>
              <MerchantForm
                merchant={selectedMerchant}
                onMerchantChange={handleMerchantChange}
                uniqueSegments={uniqueSegments}
                uniquePresentations={uniquePresentations}
                uniqueRegions={uniqueRegions}
                uniqueIndustries={uniqueIndustries}
                uniqueChannels={uniqueChannels}
                uniqueMiscellaneous={uniqueMiscellaneous}
              />
              <div>
                <label className="text-sm font-medium mb-1 block">Highlights</label>
                <RichTextEditor
                  content={selectedMerchant.description}
                  onChange={(content) =>
                    setSelectedMerchant((prev) => prev ? { ...prev, description: content } : null)
                  }
                />
              </div>
              <ImageManager
                images={selectedMerchant.images}
                onImageChange={handleFileChange}
                onImageReset={handleReset}
              />

            </>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          {isLoading ? (
            <>
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </button>
        <button
          onClick={handleMasterReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  )
}