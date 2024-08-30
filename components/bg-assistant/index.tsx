"use client"
import React, { useState , useEffect }  from 'react';
import { Button } from '~/components/ui/button';
import { ChatIcon } from 'components/custom-icons/chat_icon'
import Chat from "~/components/chat";

import {
  Sheet,
  SheetTrigger,
  SheetOverlay,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '~/components/ui/sheet'; 

function BG_Assistant() {

  const [isOpen, setIsOpen] = useState(false); // State to manage open/close
   
    useEffect(() => {
      console.log('BG_Assistant mounted');
  
      return () => {
          console.log('BG_Assistant unmounted');
      };
      }, []);
      
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}  >
        <SheetTrigger asChild>
          <button className="btn pt-1" ><ChatIcon/></button>
        </SheetTrigger>
        <SheetOverlay className="bg-transparent, backdrop-blur-none lg:hidden">
        <SheetContent side="bga"> {/* Adjust the side prop as needed */}
          
          <SheetHeader>
          <SheetTitle className="relative inline-block">
              BG Assistant 
          <span className="align-top text-red-500 text-xs ml-1">beta</span>
          </SheetTitle>
          <SheetClose>
          <Button asChild className="close-btn w-0 bg-white hover:bg-white border-0 text-black">
            <span >X</span>
          </Button>
          </SheetClose>
          </SheetHeader>
          <div>
            
           <Chat /> 
          </div>
          <SheetFooter>
          <p className="text-center text-sm text-zinc-400">
          <span className="font-semibold"> Knowledge sources:</span> BigCommerce Case Studies and BigGallery content.
          BG Assistant can make mistakes. Your milage may vary. Please check the responses.
        </p>
          </SheetFooter>
        </SheetContent>
        </SheetOverlay>
      </Sheet>
  );
}

export default BG_Assistant;



