'use client'

import * as React from "react"
import * as Tabs from "@radix-ui/react-tabs"
import BG_Admin_NewCase  from './admin_new'
import BG_Admin_Update from './admin_update'
import { SymbolIcon, PlusCircledIcon } from '@radix-ui/react-icons/dist'

export default function BG_Admin() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 mb-12">
      <div className="w-full max-w-6xl bg-white border border-slate-200 p-8 rounded-lg shadow-md">
        <Tabs.Root defaultValue="newcase" className="w-full">
          <Tabs.List className="flex border-b mb-4">
            <Tabs.Trigger
              value="newcase"
              className="flex items-center gap-2 px-4 py-2 -mb-px data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
               <PlusCircledIcon />
              <span> NewCase</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="update"
              className="flex items-center gap-2 px-4 py-2 -mb-px data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <SymbolIcon /> 
              <span>Update</span>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="newcase">
           <BG_Admin_NewCase />
          </Tabs.Content>

          <Tabs.Content value="update">
           <BG_Admin_Update />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}