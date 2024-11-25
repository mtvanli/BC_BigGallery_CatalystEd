
import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

import * as Select from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons/dist'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  MoreHorizontal,
  RotateCcw,
  Upload,
  Save,
} from 'lucide-react'

interface CustomField {
    id: number;
    name: string;
    value: string;
  }

interface Merchant {
    name: string;
    segment: string;
    presentation: string;
    channel: string;
    store: string;
    agency: string;
    region: string;
    industry: string;
    miscellaneous: string;
    is_visible?: boolean;
    highlights: string;
    custom_fields: CustomField[];
    search_keywords?: string;
    images: { url_standard: string; is_thumbnail: boolean }[];
  }

export default function BG_Admin_Update() {
  const [searchTerm, setSearchTerm] = useState("")
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [uniqueSegments, setUniqueSegments] = useState<string[]>([]);
  const [uniquePresentations, setUniquePresentations] = useState<string[]>([]);
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);
  const [uniqueIndustries, setUniqueIndustries] = useState<string[]>([]);
  const [uniqueChannels, setUniqueChannels] = useState<string[]>([]);
  const [uniqueMiscellaneous, setUniqueMiscellaneous] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [originalMerchant, setOriginalMerchant] = useState<Merchant | null>(null);
  

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input click
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file && selectedMerchant) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        const updatedImages = [...selectedMerchant.images];
        if (updatedImages[index]) {
          updatedImages[index] = { ...updatedImages[index], url_standard: newImageUrl };
        } else {
          updatedImages[index] = { url_standard: newImageUrl, is_thumbnail: false };
        }
        setSelectedMerchant({ ...selectedMerchant, images: updatedImages });
      };
      reader.readAsDataURL(file);
    }
  };

  //handleReset function for individual image resets
  const handleReset = (index: number) => {
    if (selectedMerchant && originalImages.length > index) {
      const updatedImages = [...selectedMerchant.images];
      const originalUrl = originalImages[index];
      if (originalUrl) {
        updatedImages[index] = {
          url_standard: originalUrl,
          is_thumbnail: selectedMerchant.images[index]?.is_thumbnail || false
        };
        setSelectedMerchant({ ...selectedMerchant, images: updatedImages });
      }
    }
  };

  //  for the master reset
  const handleMasterReset = () => {
    if (originalMerchant) {
      setSelectedMerchant({...originalMerchant});
      setKeywords(originalMerchant.search_keywords || '');
      setIsVisible(originalMerchant.is_visible === true);
    }
  }

  // Fetch merchants data on component mount
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch('/api/merchants');
        if (!response.ok) {
          throw new Error(`Error fetching merchants: ${response.statusText}`);
        }

        const responseData: Merchant[] = await response.json();
        console.log("API Response Data:", responseData);
        setMerchants(responseData);

         // Extract unique segments
         const segments = responseData.reduce((acc: string[], merchant: Merchant) => {
            const segmentField = merchant.custom_fields.find(field => field.name === 'Segment');
            if (segmentField && segmentField.value && !['na', 'na_'].includes(segmentField.value.toLowerCase())) {
              acc.push(segmentField.value);
            }
            return acc;
          }, []);
          const uniqueSegments = [...new Set(segments)];
          setUniqueSegments(uniqueSegments);

        // Extract unique presentations
          const presentations = responseData.reduce((acc: string[], merchant: Merchant) => {
            const presentationField = merchant.custom_fields.find(field => field.name === 'Presentation');
            if (presentationField && presentationField.value ) {
              acc.push(presentationField.value);
            }
            return acc;
          }, []);
          const uniquePresentations = [...new Set(presentations)];
          setUniquePresentations(uniquePresentations);

          // Extract unique regions
          const regions = responseData.reduce((acc: string[], merchant: Merchant) => {
            const regionField = merchant.custom_fields.find(field => field.name === 'Region');
            if (regionField && regionField.value) {
              acc.push(regionField.value);
            }
            return acc;
          }, []);
          setUniqueRegions([...new Set(regions)]);

           // Extract unique industries
          const industries = responseData.reduce((acc: string[], merchant: Merchant) => {
            const industryField = merchant.custom_fields.find(field => field.name === 'Industry');
            if (industryField && industryField.value) {
              acc.push(industryField.value);
            }
            return acc;
          }, []);
          setUniqueIndustries([...new Set(industries)]);

          // Extract unique LOVs for the channel dropdown
          const channels = responseData.reduce((acc: string[], merchant: Merchant) => {
            const channelField = merchant.custom_fields.find(field => field.name === 'Channel');
            if (channelField && channelField.value && !['na', 'na_'].includes(channelField.value.toLowerCase())) {
              acc.push(channelField.value);
            }
            return acc;
          }, []);
          setUniqueChannels([...new Set(channels)]);

          const miscellaneous = responseData.reduce((acc: string[], merchant: Merchant) => {
            const miscFields = merchant.custom_fields.filter(field => field.name === 'Misc');
            miscFields.forEach(field => {
              if (field.value && !['na', 'na_'].includes(field.value.toLowerCase())) {
                acc.push(field.value);
              }
            });
            return acc;
          }, []);
          setUniqueMiscellaneous([...new Set(miscellaneous)]);

      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };

    fetchMerchants();
  }, []);
  
  const filteredMerchants = merchants
    .filter(merchant => merchant.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.trim().localeCompare(b.name.trim(), undefined, { sensitivity: 'base' }));
  

  const handleMerchantClick = (merchant: Merchant) => {
    setSelectedMerchant({...merchant});
    setOriginalMerchant({...merchant}); // Store the original state
    setKeywords(merchant.search_keywords || '');
    setIsVisible(merchant.is_visible === true);
    setOriginalImages(merchant.images.map(img => img.url_standard));
  }



  //Segment functions
  const handleSegmentChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Segment' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  }

  const getSegmentValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const segmentField = merchant.custom_fields.find(field => field.name === 'Segment');
    return segmentField ? segmentField.value : '';
  }

  //Presentation functions
  const handlePresentationChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Presentation' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  }

  const getPresentationValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const presentationField = merchant.custom_fields.find(field => field.name === 'Presentation');
    return presentationField ? presentationField.value : '';
  }

  //Region functions
  const handleRegionChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Region' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  }

  const getRegionValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const regionField = merchant.custom_fields.find(field => field.name === 'Region');
    return regionField ? regionField.value : '';
  }


  const handleIndustryChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Industry' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  }

  const getIndustryValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const industryField = merchant.custom_fields.find(field => field.name === 'Industry');
    return industryField ? industryField.value : '';
  }

  const clearSearch = () => {
    setSearchTerm("");
  }

  const getAgencyValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const agencyField = merchant.custom_fields.find(field => field.name === 'Agency');
    return agencyField ? agencyField.value : '';
  }

  const getStoreValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const storeField = merchant.custom_fields.find(field => field.name === 'Store');
    return storeField ? storeField.value : '';
  }

  const handleChannelChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Channel' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  }

  const getChannelValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const channelField = merchant.custom_fields.find(field => field.name === 'Channel');
    const value = channelField ? channelField.value : '';
    return value.toLowerCase() === 'na' || value.toLowerCase() === 'na_' ? '-- Select --' : value;
  }

  const handleMiscellaneousChange = (index: number, value: string) => {
    if (selectedMerchant) {
      const miscFields = selectedMerchant.custom_fields.filter(field => field.name === 'Misc');
      if (miscFields[index]) {
        const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
          field.id === miscFields[index].id ? { ...field, value } : field
        );
        setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
      }
    }
  };

  const getMiscellaneousValues = (merchant: Merchant | null): string[] => {
    if (!merchant) return [];
    
    const miscFields = merchant.custom_fields.filter(field => field.name === 'Misc');
    
    return miscFields
      .map(field => 
        field.value.toLowerCase() === 'na' || field.value.toLowerCase() === 'na_'  
          ? '-- Select --' 
          : field.value
      )
      .filter(Boolean); // Ensures we only return non-empty values
  };

  const getImages = (merchant: Merchant | null) => {
    if (!merchant) return [];
    return merchant.images.map(img => img.url_standard);
  }

  return (
    <div className="container mx-auto p-1 max-w-7xl" >
      <div className="flex flex-col lg:flex-row gap-6" >
        
        {/* <div className="flex-grow grid grid-cols-[250px,1fr] gap-6"> */}
          <div className="w-full lg:w-64 space-y-4">
         
         {/*Search*/} 
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
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            </div>


            {/*Merchant List*/} 
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-grow ">
              <ScrollArea.Root className="h-[calc(100vh-200px)]  lg:max-h-[calc(100vh-150px)] w-full rounded-md overflow-hidden">
                <ScrollArea.Viewport className="w-full h-full">
                  <div className="p-2">
                    {filteredMerchants.map((merchant,index) => (
                      <div
                        key={merchant.name}
                        className={`cursor-pointer p-1 hover:bg-gray-100 rounded-md ${
                            selectedMerchant?.name === merchant.name ? 'bg-blue-100' : ''
                          }`}
                        onClick={() => handleMerchantClick(merchant)}
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

                    
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">

                {/* Merchant Name */} 
                <div>
                  <label className="text-sm font-medium mb-1 block">Merchant</label>
                  <input type="text"
                        value={selectedMerchant?.name || ''}  
                        onChange={(e) => setSelectedMerchant(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                {/* Segment */} 
                <div>
                  <label className="text-sm font-medium mb-1 block">Segment</label>
                  <Select.Root 
                  value={getSegmentValue(selectedMerchant)}
                  onValueChange={handleSegmentChange}>
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <Select.Value>{getSegmentValue(selectedMerchant) || '-- Select --'}</Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                        {uniqueSegments.map((segment, index) => (
                          <Select.Item 
                            key={index} 
                            value={segment} 
                            className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                          >
                            <Select.ItemText>{segment}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                {/* Presentation */} 
                <div>
                  <label className="text-sm font-medium mb-1 block">Presentation</label>
                  <Select.Root 
                  value={getPresentationValue(selectedMerchant)}
                  onValueChange={handlePresentationChange}>
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <Select.Value> {getPresentationValue(selectedMerchant) || '-- Select --' } </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                        {uniquePresentations.map((presentation, index) => (
                          <Select.Item 
                            key={index} 
                            value={presentation} 
                            className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                          >
                            <Select.ItemText>{presentation}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}

                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                {/* Channel */} 
                <div>
                  <label className="text-sm font-medium mb-1 block">Channel</label>
                  <Select.Root 
                  value={getChannelValue(selectedMerchant)}
                  onValueChange={handleChannelChange}
                >
                  <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <Select.Value>{getChannelValue(selectedMerchant) || '-- Select --'}</Select.Value>
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                      <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-1">
                      <Select.Item value="-- Select --" className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none">
                          <Select.ItemText>-- Select --</Select.ItemText>
                        </Select.Item>
                        {uniqueChannels.map((channel, index) => (
                          <Select.Item 
                            key={index} 
                            value={channel} 
                            className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                          >
                            <Select.ItemText>{channel}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                        <ChevronDownIcon />
                      </Select.ScrollDownButton>
                    </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                {/* Store */} 
                <div>
                  <label className="text-sm font-medium mb-1 block">Store</label>
                  <input type="text" 
                  value={getStoreValue(selectedMerchant)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Agency</label>
                  <input type="text" 
                  value={getAgencyValue(selectedMerchant)}
                  placeholder="Which agency built the store?" 
                  onChange={(e) => {
                    if (selectedMerchant) {
                      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
                        field.name === 'Agency' ? { ...field, value: e.target.value } : field
                      );
                      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Region</label>
                  <Select.Root
                  value={getRegionValue(selectedMerchant)}
                  onValueChange={handleRegionChange}>
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <Select.Value>{getRegionValue(selectedMerchant) || '-- Select --'}</Select.Value>
                    <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                        {uniqueRegions.map((region, index) => (
                          <Select.Item 
                            key={index} 
                            value={region} 
                            className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                          >
                            <Select.ItemText>{region}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Industry</label>
                  <Select.Root 
                  value={getIndustryValue(selectedMerchant)}
                  onValueChange={handleIndustryChange}
                    >
                  <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <Select.Value>{getIndustryValue(selectedMerchant) || '-- Select --'}</Select.Value>
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                      <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-1">
                        {uniqueIndustries.map((industry, index) => (
                          <Select.Item 
                            key={index} 
                            value={industry} 
                            className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                          >
                            <Select.ItemText>{industry}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                        <ChevronDownIcon />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Miscellaneous</label>
                  {[0, 1].map((index) => (
                  <Select.Root 
                    key={index}
                    value={getMiscellaneousValues(selectedMerchant)[index] || ''}
                    onValueChange={(value) => handleMiscellaneousChange(index, value)}
                  >
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2">
                      <Select.Value>{getMiscellaneousValues(selectedMerchant)[index] || `Miscellaneous ${index + 1}`}</Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                        <Select.Item value="-- Select --" className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none">
                          <Select.ItemText>-- Select --</Select.ItemText>
                        </Select.Item>
                          {uniqueMiscellaneous.map((misc, i) => (
                            <Select.Item 
                              key={i} 
                              value={misc} 
                              className="relative flex items-center h-[25px] px-[25px] text-sm text-gray-700 rounded-[3px] select-none hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                            >
                              <Select.ItemText>{misc}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                ))}
                </div>

             

                {/* Visible */}
                <div className="flex items-center space-x-2">
                  <Checkbox.Root
                    className="flex h-4 w-4 appearance-none items-center justify-center rounded-sm border border-gray-300 bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    id="visible"
                    checked={isVisible}
                    onCheckedChange={(checked) => {
                      setIsVisible(checked === true);
                      if (selectedMerchant) {
                        setSelectedMerchant({...selectedMerchant, is_visible: checked === true});
                      }
                    }}
                  >
                    <Checkbox.Indicator className="text-white">
                      <CheckIcon className="h-4 w-4" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor="visible"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Visible
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Keywords</label>
              <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Highlights</label>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex flex-wrap items-center gap-1 border-b p-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Underline className="w-4 h-4" />
                  </button>
                  <span className="w-px h-4 bg-gray-300 mx-2" />
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <span className="w-px h-4 bg-gray-300 mx-2" />
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="min-h-[200px] p-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => {
          const images = getImages(selectedMerchant);
          const imageUrl = images[index];
          return (
            <div key={index} className="space-y-2">
              <div className="aspect-[3/4] border border-gray-200 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={`Image ${index + 1}`} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                onClick={() => handleReset(index)}
                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <label className="flex-1 flex items-center justify-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span className="truncate">Select Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </label>
              </div>
            </div>
          );
        })}
            </div>
          </div>
        {/* </div> */}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Save className="w-4 h-4" />
          Save
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