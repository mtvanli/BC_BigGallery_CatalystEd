import React, { useState } from 'react'
import { X } from 'lucide-react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { type Merchant } from '../types/merchant'

interface MerchantListProps {
  merchants: Merchant[]
  selectedMerchant: Merchant | null
  onMerchantSelect: (merchant: Merchant) => void
}

export function MerchantList({ merchants, selectedMerchant, onMerchantSelect }: MerchantListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMerchants = merchants
    .filter(merchant => merchant.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.trim().localeCompare(b.name.trim(), undefined, { sensitivity: 'base' }))

  return (
    <div className="w-full lg:w-64 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-grow">
        <ScrollArea.Root className="min-h-[300px] max-h-[500px] lg:max-h-[1375px] w-full rounded-md overflow-hidden">
          <ScrollArea.Viewport className="w-full min-h-[300px] max-h-[500px] lg:max-h-[1375px]">
            <div className="p-2">
              {filteredMerchants.map((merchant) => (
                <div
                  key={merchant.name}
                  className={`cursor-pointer p-1 hover:bg-gray-100 rounded-md ${
                    selectedMerchant?.name === merchant.name ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => onMerchantSelect(merchant)}
                  aria-selected={selectedMerchant?.name === merchant.name}
                >
                  {merchant.name}
                </div>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  )
}

