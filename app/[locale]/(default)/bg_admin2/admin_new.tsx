'use client'

import * as React from "react"
import * as Tabs from "@radix-ui/react-tabs"
import * as Select from "@radix-ui/react-select"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons/dist"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  MoreHorizontal,
  Image as ImageIcon,
  Undo,
  Redo,
  ArrowUpRight,
  RotateCcw,
  LogOut,
} from "lucide-react"

import { RichTextEditor } from './components/rich_text_editor'

export default function BG_Admin_NewCase() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Reference Store</h1>

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
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Presentation <span className="text-red-500">*</span>
              </label>
              <Select.Root>
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
                      <Select.Item
                        value="stencil"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Stencil</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="headless"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Headless</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Channel</label>
              <Select.Root>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Select channel" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      <Select.Item
                        value="retail"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Retail</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="wholesale"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Wholesale</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Store Url <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                placeholder="Enter the store URL"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Agency</label>
              <input
                type="text"
                placeholder="Which agency built the store?"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Region <span className="text-red-500">*</span>
              </label>
              <Select.Root>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Select the region" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      <Select.Item
                        value="na"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>North America</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="eu"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Europe</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Misc</label>
              <Select.Root>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Key feature 1" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      <Select.Item
                        value="feature1"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Feature 1</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="feature2"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Feature 2</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <Select.Root>
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white">
                  <Select.Value placeholder="Key feature 2" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white border rounded-md shadow-md">
                    <Select.Viewport className="p-1">
                      <Select.Item
                        value="feature1"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Feature 1</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="feature2"
                        className="relative flex items-center px-6 py-2 rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Select.ItemText>Feature 2</Select.ItemText>
                      </Select.Item>
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
            placeholder="Enter comma seperated keywords"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Highlights</label>
          <RichTextEditor />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              Select Main Image
            </button>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-500 via-red-500 to-purple-500 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              Select Image 2
            </button>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-500 via-red-500 to-purple-500 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              Select Image 3
            </button>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-500 via-red-500 to-purple-500 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">

        <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors">
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <ArrowUpRight className="h-4 w-4" />
          Publish
        </button>
      </div>
    </div>

  )
}