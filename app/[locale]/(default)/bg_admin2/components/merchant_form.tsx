import React from 'react'
import * as Select from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons/dist'
import { type Merchant, type CustomField } from '../types/merchant'

interface MerchantFormProps {
  merchant: Merchant
  onMerchantChange: (updatedMerchant: Merchant) => void
  uniqueSegments: string[]
  uniquePresentations: string[]
  uniqueRegions: string[]
  uniqueIndustries: string[]
  uniqueChannels: string[]
  uniqueMiscellaneous: string[]
}

export function MerchantForm({
  merchant,
  onMerchantChange,
  uniqueSegments,
  uniquePresentations,
  uniqueRegions,
  uniqueIndustries,
  uniqueChannels,
  uniqueMiscellaneous
}: MerchantFormProps) {

  const getFieldValue = (fieldName: string): string => {
    if (!merchant.custom_fields) {
      return fieldName === 'Agency' ? "Which agency built the store?" : '-- Select --';
    }
    const field = merchant.custom_fields.find(f => f.name === fieldName);
    const value = field ? field.value : '';
    if (fieldName === 'Agency') {
      return value.toLowerCase() === 'na' || value.toLowerCase() === 'na_' || value === '' 
        ? "Which agency built the store?" 
        : value;
    }
    return value.toLowerCase() === 'na' || value.toLowerCase() === 'na_' || value === '' 
      ? '-- Select --' 
      : value;
  };


    const handleCustomFieldChange = (fieldName: string, value: string, id?: number) => {
        let updatedCustomFields;
        if (fieldName === 'Misc') {
          updatedCustomFields = merchant.custom_fields.map(field => 
            field.id === id ? { ...field, value } : field
          );
          // If the field doesn't exist, add it
          if (!updatedCustomFields.some(field => field.id === id)) {
            updatedCustomFields.push({ id: id || Date.now(), name: 'Misc', value });
          }
        } else {
          updatedCustomFields = merchant.custom_fields.map(field =>
            field.name === fieldName ? { ...field, value } : field
          );
        }
        onMerchantChange({ ...merchant, custom_fields: updatedCustomFields });
      };
    
    
      /* const getMiscFields = (): CustomField[] => {
        const existingMiscFields = merchant.custom_fields
        ? merchant.custom_fields.filter(field => field.name === 'Misc')
        : [];// Always return exactly two Misc fields
        return [
          existingMiscFields[0] || { id: Date.now(), name: 'Misc', value: '-- Select --' },
          existingMiscFields[1] || { id: Date.now() + 1, name: 'Misc', value: '-- Select --' }
        ];
      }; */
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
             <label className="text-sm font-medium mb-1 block">Merchant</label>
            <input
            type="text"
            value={merchant.name}
            onChange={(e) => onMerchantChange({ ...merchant, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>

        {/* Segment */}     
        <div>
            <label className="text-sm font-medium mb-1 block">Segment</label>
            <Select.Root
            value={getFieldValue('Segment')}
            onValueChange={(value) => handleCustomFieldChange('Segment', value)}
            >
            <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <Select.Value>{getFieldValue('Segment')}</Select.Value>
              <Select.Icon><ChevronDownIcon /></Select.Icon>
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
            value={getFieldValue('Presentation')}
            onValueChange={(value) => handleCustomFieldChange('Presentation', value)}
            >
            <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <Select.Value>{getFieldValue('Presentation')}</Select.Value>
              <Select.Icon><ChevronDownIcon /></Select.Icon>
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
            value={getFieldValue('Channel')}
            onValueChange={(value) => handleCustomFieldChange('Channel', value)}
            >
            <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <Select.Value>{getFieldValue('Channel')}</Select.Value>
              <Select.Icon><ChevronDownIcon /></Select.Icon>
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


        <div>
          <label className="text-sm font-medium mb-1 block">Store</label>
          <input
            type="text"
            value={getFieldValue('Store')}
            onChange={(e) => handleCustomFieldChange('Store', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Agency</label>
          <input
            type="text"
            value={getFieldValue('Agency')}
            onChange={(e) => handleCustomFieldChange('Agency', e.target.value)}
            placeholder="Which agency built the store?"
            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              getFieldValue('Agency') === "Which agency built the store?" ? "text-gray-400" : ""
            }`}
          />
        </div>


         {/* Region */}
        <div>
            <label className="text-sm font-medium mb-1 block">Region</label>
            <Select.Root
            value={getFieldValue('Region')}
            onValueChange={(value) => handleCustomFieldChange('Region', value)}
            >
            <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <Select.Value>{getFieldValue('Region')}</Select.Value>
              <Select.Icon><ChevronDownIcon /></Select.Icon>
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

        {/* Industry */}
        <div>
            <label className="text-sm font-medium mb-1 block">Industry</label>
            <Select.Root
            value={getFieldValue('Industry')}
            onValueChange={(value) => handleCustomFieldChange('Industry', value)}
            >
            <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <Select.Value>{getFieldValue('Industry')}</Select.Value>
              <Select.Icon><ChevronDownIcon /></Select.Icon>
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
          {merchant.custom_fields?.filter(field => field.name === 'Misc').map((miscField, index) => (
            <Select.Root
              key={miscField.id}
              value={miscField.value}
              onValueChange={(value) => handleCustomFieldChange('Misc', value, miscField.id)}
            >
              <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2">
                <Select.Value>
                  {!miscField.value || miscField.value.toLowerCase() === 'na' || miscField.value.toLowerCase() === 'na_' 
                    ? '-- Select --' 
                    : miscField.value}
                </Select.Value>
                <Select.Icon><ChevronDownIcon /></Select.Icon>
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

        <div className="flex items-center space-x-2">
             <Checkbox.Root
            className="flex h-4 w-4 appearance-none items-center justify-center rounded-sm border border-gray-300 bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            id="visible"
            checked={merchant.is_visible}
            onCheckedChange={(checked) => onMerchantChange({ ...merchant, is_visible: checked === true })}
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

        <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Keywords</label>
            <textarea
            value={merchant.search_keywords || ''}
            onChange={(e) => onMerchantChange({ ...merchant, search_keywords: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
        />
      </div>
    </div>
  )
}

