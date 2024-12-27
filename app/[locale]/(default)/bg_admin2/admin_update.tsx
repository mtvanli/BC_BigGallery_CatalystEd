import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Upload, Save} from 'lucide-react'
import { type Merchant } from './types/merchant'
import { RichTextEditor } from './components/rich_text_editor'
import { MerchantList } from './components/merchant_list'
import { ImageManager } from './components/image_manager'
import { MerchantForm } from './components/merchant_form'
import { toast } from 'react-hot-toast'

//import { X } from 'lucide-react'
/* import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table' */
//import ResizableImage from 'tiptap-extension-resize-image'
/* import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style' */
//import * as Select from '@radix-ui/react-select'
//import * as Checkbox from '@radix-ui/react-checkbox'
//import * as ScrollArea from '@radix-ui/react-scroll-area'
/* import * as Popover from '@radix-ui/react-popover'
import * as Dialog from '@radix-ui/react-dialog' */
/* import { HexColorPicker } from 'react-colorful' */
//import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons/dist'

/* import {
  Bold,
  Italic,
  UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  RotateCcw,
  Upload,
  Save,
  Highlighter,
  ArrowLeftToLine,
  ArrowRightToLine,
  Undo,
  Redo,
  Palette,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react' */

/* interface CustomField {
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
    description: string;
    custom_fields: CustomField[];
    search_keywords?: string;
    images: { url_standard: string; is_thumbnail: boolean }[];
} */

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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  
 /*  const [color, setColor] = useState('#000000')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'link' | 'image'>('link')
  const [dialogInput, setDialogInput] = useState('') */

  /* const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-4',
        },
      }),
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Highlight,
      Color,
      Link,
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'resize-image',
        },
      }),
      Image,
      Underline,
      TextStyle,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
    ],
    content: highlights,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      console.log("Editor content updated:", newContent)
      setHighlights(newContent)
      if (selectedMerchant) {
        setSelectedMerchant({ ...selectedMerchant, description: newContent })
      }
    },
    parseOptions: {
        preserveWhitespace: 'full',
      },
      editorProps: {
        attributes: {
          class: 'prose max-w-none focus:outline-none overflow-y-auto',
        },
      },
  }) */


 /*  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = editor.getHTML()
      if (currentContent !== highlights) {
        editor.commands.setContent(highlights, false)
      }
    }
  }, [highlights, editor]) */

  /* const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input click
    }
  }; */

  const fetchMerchants = useCallback(async () => {
    try {
      const response = await fetch(`/api/get-merchants?timestamp=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Error fetching merchants: ${response.statusText}`);
      }

      const responseData: Merchant[] = await response.json();
      console.log("API Response Data:", responseData);
      //setMerchants(responseData);

      const sortedMerchants = sortMerchants(responseData);
      setMerchants(sortedMerchants)

      // Select the first merchant from the sorted list by default
      if (sortedMerchants.length > 0 && sortedMerchants[0]) {
        handleMerchantClick(sortedMerchants[0])
      }

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

       // Extract unique segments
      /*  const segments = responseData.reduce((acc: string[], merchant: Merchant) => {
          const segmentField = merchant.custom_fields.find(field => field.name === 'Segment');
          if (segmentField && segmentField.value && !['na', 'na_'].includes(segmentField.value.toLowerCase())) {
            acc.push(segmentField.value);
          }ß
          return acc;
        }, []);
        const uniqueSegments = [...new Set(segments)];
        setUniqueSegments(uniqueSegments); */

      // Extract unique presentations
      /*   const presentations = responseData.reduce((acc: string[], merchant: Merchant) => {
          const presentationField = merchant.custom_fields.find(field => field.name === 'Presentation');
          if (presentationField && presentationField.value ) {
            acc.push(presentationField.value);
          }
          return acc;
        }, []);
        const uniquePresentations = [...new Set(presentations)];
        setUniquePresentations(uniquePresentations); */

        // Extract unique regions
       /*  const regions = responseData.reduce((acc: string[], merchant: Merchant) => {
          const regionField = merchant.custom_fields.find(field => field.name === 'Region');
          if (regionField && regionField.value) {
            acc.push(regionField.value);
          }
          return acc;
        }, []);
        setUniqueRegions([...new Set(regions)]); */

         // Extract unique industries
        /* const industries = responseData.reduce((acc: string[], merchant: Merchant) => {
          const industryField = merchant.custom_fields.find(field => field.name === 'Industry');
          if (industryField && industryField.value) {
            acc.push(industryField.value);
          }
          return acc;
        }, []);
        setUniqueIndustries([...new Set(industries)]); */

        // Extract unique LOVs for the channel dropdown
        /* const channels = responseData.reduce((acc: string[], merchant: Merchant) => {
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
        setUniqueMiscellaneous([...new Set(miscellaneous)]); */

    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Failed to fetch merchants. Please try again.")
    }
  },[])

   // Fetch merchants data on component mount
   useEffect(() => {
    fetchMerchants()
  }, [fetchMerchants])
  

  const handleMerchantChange = (updatedMerchant: Partial<Merchant>) => {
    setSelectedMerchant((prev) => prev ? { ...prev, ...updatedMerchant } : null)
  }

  const handleFileChange = (index: number, file: File) => {
    if (selectedMerchant) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string
        setSelectedMerchant((prev) => {
          if (!prev) return null
          const updatedImages = [...prev.images]
          if (updatedImages[index]) {
            updatedImages[index] = { ...updatedImages[index], url_standard: newImageUrl }
          } else {
            updatedImages[index] = { url_standard: newImageUrl, is_thumbnail: false }
          }
          return { ...prev, images: updatedImages }
        })
      }
      reader.readAsDataURL(file)
    }
  }

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
      setHighlights(originalMerchant.description || '')
    }
  }

  

  const handleSave = useCallback(async () => {
    if (selectedMerchant && originalMerchant) {
        const getFieldValue = (fieldName: string, merchant: Merchant): string => {
          const field = merchant.custom_fields.find(f => f.name === fieldName);
          return field ? field.value : '';
        };

        const newRegion = getFieldValue('Region', selectedMerchant);
        const originalRegion = getFieldValue('Region', originalMerchant);
        const regionChanged = newRegion !== originalRegion;

        const hasFieldChanged = (fieldName: string): boolean => {
            return getFieldValue(fieldName, selectedMerchant) !== getFieldValue(fieldName, originalMerchant);
          };
  
        const hasMiscFieldsChanged = (): boolean => {
            const selectedMiscFields = selectedMerchant.custom_fields.filter(f => f.name === 'Misc');
            const originalMiscFields = originalMerchant.custom_fields.filter(f => f.name === 'Misc');
      
            return selectedMiscFields.some((f, i) => 
              f.value !== (originalMiscFields[i]?.value || '')
            );
        };
  
        // Check if any relevant fields have changed
        const hasChanges = 
          selectedMerchant.name !== originalMerchant.name ||
          selectedMerchant.search_keywords !== originalMerchant.search_keywords ||
          selectedMerchant.description !== originalMerchant.description ||
          selectedMerchant.is_visible !== originalMerchant.is_visible ||
          regionChanged
          
  
        if (hasChanges) {
          try {
            const updateData: any = {
              id: selectedMerchant.id,
              name: selectedMerchant.name,
              search_keywords: selectedMerchant.search_keywords,
              description: selectedMerchant.description,
              is_visible: selectedMerchant.is_visible,
              custom_fields: selectedMerchant.custom_fields,
            };
  
            if (regionChanged) {
                updateData.categories = getCategoryByRegion(newRegion);
              }
  
            const response = await fetch('/api/update-merchant', {
              method: 'PUT',
              body: JSON.stringify(updateData),
            });

          if (!response.ok) {
            throw new Error(`Error updating merchant: ${response.statusText}`);
          }

          const updatedMerchant = await response.json();

          /* // Update the custom_fields with the new Region value
          const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
            field.name === 'Region' ? { ...field, value: newRegion } : field
          ); */

          // Merge the updated data with the existing merchant data
          const mergedMerchant = {
            ...selectedMerchant,
            ...updatedMerchant,
           // custom_fields: updatedCustomFields, 
          };
          setSelectedMerchant(mergedMerchant);
          setOriginalMerchant(mergedMerchant);

          // Update the merchant in the merchants list
          setMerchants(prevMerchants => 
            prevMerchants.map(m => m.id === mergedMerchant.id ? mergedMerchant : m)
          );

          // Refresh the merchant list
          await fetchMerchants();

          toast.success("Merchant updated successfully");
        } catch (error) {
          console.error("Error saving merchant:", error);
          toast.error("Failed to update merchant. Please try again.");
        }
      } else {
        toast("No changes to save");
      }
    }
  }, [selectedMerchant, originalMerchant,fetchMerchants]);

 
  /* const filteredMerchants = merchants
    .filter(merchant => merchant.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.trim().localeCompare(b.name.trim(), undefined, { sensitivity: 'base' }));
   */

  const handleMerchantClick = (merchant: Merchant) => {
    console.log("Merchant clicked:", merchant.name)
    console.log("Merchant highlights:", merchant.description)
    setSelectedMerchant({...merchant});
    setOriginalMerchant({...merchant}); // Store the original state
    setKeywords(merchant.search_keywords || '');
    setIsVisible(merchant.is_visible === true);
    setOriginalImages(merchant.images.map(img => img.url_standard));
    setHighlights(merchant.description|| '')
  }



  //Segment functions
  /* const handleSegmentChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Segment' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  } */

  /* const getSegmentValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const segmentField = merchant.custom_fields.find(field => field.name === 'Segment');
    return segmentField ? segmentField.value : '';
  } */

  //Presentation functions
  /* const handlePresentationChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Presentation' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  } */

  /* const getPresentationValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const presentationField = merchant.custom_fields.find(field => field.name === 'Presentation');
    return presentationField ? presentationField.value : '';
  } */

  //Region functions
  /* const handleRegionChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Region' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  } */

  /* const getRegionValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const regionField = merchant.custom_fields.find(field => field.name === 'Region');
    return regionField ? regionField.value : '';
  } */


  /* const handleIndustryChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Industry' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  } */

  /* const getIndustryValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const industryField = merchant.custom_fields.find(field => field.name === 'Industry');
    return industryField ? industryField.value : '';
  } */

/*   const clearSearch = () => {
    setSearchTerm("");
  } */

  /* const getAgencyValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const agencyField = merchant.custom_fields.find(field => field.name === 'Agency');
    return agencyField ? agencyField.value : '';
  } */

  /* const getStoreValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const storeField = merchant.custom_fields.find(field => field.name === 'Store');
    return storeField ? storeField.value : '';
  } */

  /* const handleChannelChange = (value: string) => {
    if (selectedMerchant) {
      const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
        field.name === 'Channel' ? { ...field, value } : field
      );
      setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
    }
  } */

  /* const getChannelValue = (merchant: Merchant | null) => {
    if (!merchant) return '';
    const channelField = merchant.custom_fields.find(field => field.name === 'Channel');
    const value = channelField ? channelField.value : '';
    return value.toLowerCase() === 'na' || value.toLowerCase() === 'na_' ? '-- Select --' : value;
  } */

  /* const handleMiscellaneousChange = (index: number, value: string) => {
    if (selectedMerchant) {
      const miscFields = selectedMerchant.custom_fields.filter(field => field.name === 'Misc');
      if (miscFields[index]) {
        const updatedCustomFields = selectedMerchant.custom_fields.map(field => 
          field.id === miscFields[index].id ? { ...field, value } : field
        );
        setSelectedMerchant({ ...selectedMerchant, custom_fields: updatedCustomFields });
      }
    }
  }; */

  /* const getMiscellaneousValues = (merchant: Merchant | null): string[] => {
    if (!merchant) return [];
    
    const miscFields = merchant.custom_fields.filter(field => field.name === 'Misc');
    
    return miscFields
      .map(field => 
        field.value.toLowerCase() === 'na' || field.value.toLowerCase() === 'na_'  
          ? '-- Select --' 
          : field.value
      )
      .filter(Boolean); // Ensures we only return non-empty values
  }; */

  /* const getImages = (merchant: Merchant | null) => {
    if (!merchant) return [];
    return merchant.images.map(img => img.url_standard);
  } */

  //editor functions

 /*  const openDialog = (type: 'link' | 'image', initialValue: string = 'https://') => {
    setDialogType(type)
    setDialogInput(initialValue)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setDialogInput('')
  } */

/*   const handleDialogSubmit = () => {
    if (dialogType === 'link') {
      if (editor?.getAttributes('link').href) {
        editor?.chain().focus().extendMarkRange('link').setLink({ href: dialogInput }).run()
      } else {
        editor?.chain().focus().toggleLink({ href: dialogInput }).run()
      }
    } else if (dialogType === 'image') {
      editor?.chain().focus().setImage({ src: dialogInput }).run()
    }
    closeDialog()
  } */

 /*  const addImage = useCallback(() => {
    openDialog('image')
  }, []) */

 /*  const addLink = useCallback(() => {
    const selection = editor?.state.selection
    const selectedText = selection ? editor?.state.doc.textBetween(selection.from, selection.to) : ''
    const existingLink = editor?.getAttributes('link').href || ''
    openDialog('link', existingLink || selectedText || 'https://')
  }, [editor]) */

  /* const setTextColor = useCallback((newColor: string) => {
    editor?.chain().focus().setColor(newColor).run()
  }, [editor])
 */

  return (
    
    <div className="container mx-auto p-1 max-w-7xl" >
      <div className="flex flex-col lg:flex-row gap-6" >
      {/* <div className="w-full lg:w-64 space-y-4"> */}
      <MerchantList
          merchants={sortMerchants(merchants)}
          selectedMerchant={selectedMerchant}
          onMerchantSelect={handleMerchantClick}
        />
      {/* </div>   */}
        {/* <div className="flex-grow grid grid-cols-[250px,1fr] gap-6"> */}
          {/* <div className="w-full lg:w-64 space-y-4"> */}
         
            {/*Search*/} 
            {/* <div className="relative">
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
            </div> */}


            {/*Merchant List*/} 
            {/*<div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-grow ">
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
            </div> */}
          {/* </div> */}
        
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

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                {/* <div className="space-y-4"> */}

                {/* Merchant Name */} 
                {/*  <div>
                    <label className="text-sm font-medium mb-1 block">Merchant</label>
                    <input type="text"
                        value={selectedMerchant?.name || ''}  
                        onChange={(e) => setSelectedMerchant(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div> */}

                {/* Segment */} 
                {/* <div>
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
                </div> */}

                {/* Presentation */} 
                {/* <div>
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
                </div> */}

                {/* Channel */} 
                {/* <div>
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
                </div> */}

                {/* Store */} 
               {/*  <div>
                  <label className="text-sm font-medium mb-1 block">Store</label>
                  <input type="text" 
                  value={getStoreValue(selectedMerchant)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div> */}
              {/* </div> */}

                
            {/* <div className="space-y-4"> */}
                {/* Agency */} 
               {/*  <div>
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
                </div> */}

                {/* Region */} 
                {/* <div>
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
                </div> */}

                {/* Industry */} 
                {/* <div>
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
                </div> */}

                {/* Misc */} 
               {/*  <div>
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
                </div> */}

                {/* Visible */}
               {/*  <div className="flex items-center space-x-2">
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
                </div> */}
              {/* </div> */}
            {/* </div> */}

                {/* Keywords */} 
            {/* <div>
              <label className="text-sm font-medium mb-1 block">Keywords</label>
              <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                />
            </div> */}

                {/* Highlights */} 
            <div>
                <label className="text-sm font-medium mb-1 block">Highlights</label>
                <RichTextEditor
                  content={selectedMerchant.description}
                  onChange={(content) => 
                    setSelectedMerchant((prev) => prev ? { ...prev, description: content } : null)
                  }
                />
                {/* <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-1 border-b p-2">

                    <button
                    onClick={() => editor?.chain().focus().undo().run()}
                    className={`p-1 hover:bg-gray-100 rounded`}
                    >
                    <Undo className="w-4 h-4" />
                    </button>
                    
                    <button
                    onClick={() => editor?.chain().focus().redo().run()}
                    className={`p-1 hover:bg-gray-100 rounded`}
                    >
                    <Redo className="w-4 h-4" />
                    </button>

                  <span className="w-px h-4 bg-gray-300 mx-2" />
                    <button
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive('underline') ? 'bg-gray-200' : ''}`}
                    >
                      <UnderlineIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleHighlight().run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'highlight' }) ? 'bg-gray-200' : ''}`}
                    >
                     <Highlighter className="w-4 h-4" />
                    </button>
                    <span className="w-px h-4 bg-gray-300 mx-2" />
                    <button
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                        className={`p-1 hover:bg-gray-100 rounded`}
                    >
                    <ArrowLeftToLine className="w-4 h-4" />
                    </button>

                    <button
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    className={`p-1 hover:bg-gray-100 rounded`}
                    >
                    <ArrowRightToLine className="w-4 h-4" />
                    </button>

                    <span className="w-px h-4 bg-gray-300 mx-2" />
                    
                    <button
                    onClick={addLink}
                    className={`p-1 hover:bg-gray-100 rounded ${editor?.isActive('link') ? 'bg-gray-200' : ''}`}
                    >
                    <LinkIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                    onClick={addImage}
                    className={`p-1 hover:bg-gray-100 rounded`}
                    >
                    <ImageIcon className="w-4 h-4" />
                    </button>
                    
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button
                          className={`p-1 hover:bg-gray-100 rounded`}
                          aria-label="Open color picker"
                        >
                          <Palette className="w-4 h-4" style={{ color: color }} />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content className="bg-white p-2 rounded-lg shadow-lg">
                          <div className="space-y-2">
                            <HexColorPicker color={color} onChange={setColor} />
                            <button
                              onClick={() => {
                                setTextColor(color)
                                editor?.chain().focus().run()
                              }}
                              className="w-full px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Apply Color
                            </button>
                          </div>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>

                  </div>
                  <EditorContent 
                    editor={editor} 
                    className="p-5 h-70 overflow-y-auto resize-y min-h-[16rem] max-h-[32rem] " />
                </div> */}
            </div>

            <ImageManager
                images={selectedMerchant.images}
                onImageChange={handleFileChange}
                onImageReset={handleReset}
              />

                {/* Images */} 
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div> */}
            
            </>
            )}
            </div>
       
      </div>

       {/* <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-5/6 max-w-lg">
            <Dialog.Title className="text-lg font-bold mb-4">
              {dialogType === 'link' ? 'Insert Link' : 'Insert Image'}
            </Dialog.Title>
            <input
              type="text"
              value={dialogInput}
              onChange={(e) => setDialogInput(e.target.value)}
              placeholder="https://"
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
                Cancel
              </button>
              <button
                onClick={handleDialogSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Insert
              </button>
            </div>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root> */}

      <div className="mt-6 flex justify-end gap-2">
        <button 
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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