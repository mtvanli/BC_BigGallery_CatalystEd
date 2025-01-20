import React, { useRef } from 'react'
import { RotateCcw, Upload } from 'lucide-react'
import { type Image } from '../types/merchant'

interface ImageManagerProps {
  images: Image[]
  onImageChange: (index: number, file: File) => void
  onImageReset: (index: number) => void
}

export function ImageManager({ images, onImageChange, onImageReset }: ImageManagerProps) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageChange(index, file)
    }
  }

  // Get images for display - thumbnail first, then others in order
  const thumbnailImage = images.find(img => img.is_thumbnail)
  const nonThumbnailImages = images.filter(img => !img.is_thumbnail)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[0, 1, 2].map((index) => {
        // Get the appropriate image for this position
        const imageToShow = index === 0 
          ? thumbnailImage 
          : nonThumbnailImages[index - 1]
        
        const imageUrl = imageToShow?.url_standard

        return (
          <div key={index} className="space-y-2">
            <div className="aspect-[3/4] border border-gray-200 rounded-lg overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onImageReset(index)}
                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label={`Reset Image ${index + 1}`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <label className="flex-1 flex items-center justify-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="truncate">
                  {index === 0 ? "Select Main Image" : `Select Image ${index + 1}`}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => {
                    if (el) {
                      fileInputRefs.current[index] = el
                    }
                  }}
                  id={`file-input-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, index)}
                />
              </label>
            </div>
          </div>
        )
      })}
    </div>
  )
}