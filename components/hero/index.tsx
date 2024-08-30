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

import SlideshowBG from './slideshow-bg-01.jpg';
import SlideshowBG3 from './slideshow-bg-02.jpg';
import SlideshowBG4 from './slideshow-bg-03.jpg';

const SlideshowBlurDataURL =
  'data:image/jpeg;base64,/9j/4QC8RXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAAoAAAADoAQAAQAAAAcAAAAAAAAA/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgABwAKAwERAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAMJ/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAURABIhMQYjgf/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/EABkRAAIDAQAAAAAAAAAAAAAAAAARAQIhQf/aAAwDAQACEQMRAD8AoZ5EzayKWW3Syo0GyKPTJlsF9ts9klsKTu46GQOfms2awJfAKywmt1sRNgqK7PS0gSHI4WltTmBuKQckJJzgE9aYa0tP/9k=';

export const Hero = () => (
  <Slideshow>
    <SlideshowContent>
      <SlideshowSlide>
        <div className="relative ">
          <Image
            alt="Just Sunnies slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover object-right-top"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG}
            
          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
          <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-36 ">
            <h2 className="text-5xl font-black  text-neutral-50 lg:text-6xl mt-10">Just Sunnies</h2>
            <p className="text-lg max-w-xl  text-neutral-50">Uses Composable Commerce to Accelerate Sales
            </p>
            <Button asChild className="w-fit">
              <a href="https://www.bigcommerce.com/case-study/just-sunnies/" target="_blank" rel="noopener noreferrer">Case Study</a>
            </Button>
          </div>
        </div>
      </SlideshowSlide>
      <SlideshowSlide>
      <div className="relative ">
      <Image
            alt="White Stuff slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover  object-right-top"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG3}
          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
        <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-36  ">
          <h2 className="text-5xl text-neutral-50 font-black lg:text-6xl mt-10 ">White Stuff</h2>
          <p className="text-lg max-w-xl text-neutral-50">
          Quickly Lifts Customer Experience with BigCommerce
          </p>
          <Button asChild className="w-fit">
            <a href="https://www.bigcommerce.com/case-study/white-stuff/" target="_blank" rel="noopener noreferrer">Case Study</a>
          </Button>
        </div>
        </div>
      </SlideshowSlide>
      <SlideshowSlide>
      <div className="relative ">
      <Image
            alt="Inhaven slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover sm:object-center"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG4}
          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
        <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-36">
          <h2 className="text-5xl text-neutral-50 font-black lg:text-6xl mt-10 ">Inhaven</h2>
          <p className="text-lg max-w-xl text-neutral-50 ">
          Builds a Five-Star B2B Experience with BigCommerce
          </p>
          <Button asChild className="w-fit">
            <a href="https://www.bigcommerce.com/case-study/inhaven/" target="_blank" rel="noopener noreferrer">Case Study</a>
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
