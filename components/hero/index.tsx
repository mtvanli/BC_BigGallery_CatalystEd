import Image from 'next/image';

import { Button } from '~/components/ui/button';
import {
  Slideshow,
  SlideshowAutoplayControl,
  SlideshowContent,
  SlideshowControls,
  SlideshowNextIndicator,
  SlideshowPagination,
  SlideshowPreviousIndicator,
  SlideshowSlide,
} from '~/components/ui/slideshow';

import SlideshowBG from './slideshow-bg-05.jpg';
import SlideshowBG3 from './slide_bbq.jpg';
import SlideshowBG4 from './slide_nextbase.jpg';


const SlideshowBlurDataURL =
  'data:image/jpeg;base64,/9j/4QC8RXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAAoAAAADoAQAAQAAAAcAAAAAAAAA/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgABwAKAwERAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAMJ/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAURABIhMQYjgf/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/EABkRAAIDAQAAAAAAAAAAAAAAAAARAQIhQf/aAAwDAQACEQMRAD8AoZ5EzayKWW3Syo0GyKPTJlsF9ts9klsKTu46GQOfms2awJfAKywmt1sRNgqK7PS0gSHI4WltTmBuKQckJJzgE9aYa0tP/9k=';

export const Hero = () => (
  <Slideshow>
    <SlideshowContent>
      <SlideshowSlide>
        <div className="relative ">
          <Image
            alt="Designerie slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover sm:object-center"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG}
            
          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
          <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-56 lg:pt-36">
            <h2 className="text-4xl text-neutral-50 font-black lg:text-6xl mt-10 ">Designerie</h2>
            <p className="text-md lg:text-lg max-w-xl text-neutral-50">Builds a Luxury Ecommerce Site with BigCommerce
            </p>
            <Button asChild className="w-fit mt-4">
              <a href="https://www.bigcommerce.com/case-study/designerie/" target="_blank" rel="noopener noreferrer">Case Study</a>
            </Button>
          </div>
        </div>
      </SlideshowSlide>
      <SlideshowSlide>
      <div className="relative ">
      <Image
            alt="Grenson slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover  sm:object-center"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG3}
          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
          <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-56 lg:pt-36 ">
          <h2 className="text-4xl text-neutral-50 font-black lg:text-6xl mt-10 ">Barbeques Galore</h2>
          <p className="text-md lg:text-lg max-w-xl text-neutral-50">
          Heats up International Expansion with BigCommerce
          </p>
          <Button asChild className="w-fit mt-4">
            <a href="https://www.bigcommerce.com/case-study/barbeques-galore/" target="_blank" rel="noopener noreferrer">Case Study</a>
          </Button>
        </div>
        </div>
      </SlideshowSlide>
      <SlideshowSlide>
      <div className="relative ">
      <Image
            alt="Kaiser Willys slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover sm:object-center"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG4}
          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
          <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-56 lg:pt-36 ">
          <h2 className="text-4xl text-neutral-50 font-black lg:text-6xl mt-10 ">Nextbase</h2>
          <p className="text-lg max-w-xl text-neutral-50 ">
          records peak conversions on its DTC site
          </p>
          <Button asChild className="w-fit mt-4">
            <a href="https://www.bigcommerce.com/case-study/nextbase/" target="_blank" rel="noopener noreferrer">Case Study</a>
          </Button>
        </div>
        </div>
      </SlideshowSlide>
    </SlideshowContent>
    <SlideshowControls>
      <SlideshowAutoplayControl />
      <SlideshowPreviousIndicator />
      <SlideshowPagination />
      <SlideshowNextIndicator />
    </SlideshowControls>
  </Slideshow>
);
