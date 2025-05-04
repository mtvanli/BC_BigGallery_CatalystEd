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


import SlideshowBG3 from './Oroton.jpg';
import SlideshowBG from './linz.jpg';
import SlideshowBG4 from './Karava.jpeg';


const SlideshowBlurDataURL =
  'data:image/jpeg;base64,/9j/4QC8RXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAAoAAAADoAQAAQAAAAcAAAAAAAAA/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgABwAKAwERAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAMJ/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAURABIhMQYjgf/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/EABkRAAIDAQAAAAAAAAAAAAAAAAARAQIhQf/aAAwDAQACEQMRAD8AoZ5EzayKWW3Syo0GyKPTJlsF9ts9klsKTu46GQOfms2awJfAKywmt1sRNgqK7PS0gSHI4WltTmBuKQckJJzgE9aYa0tP/9k=';

export const Hero = () => (
  <Slideshow>
    <SlideshowContent>

      <SlideshowSlide>
        <div className="relative ">
          <Image
            alt="Lekker slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover sm:object-right"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG3}

          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
          <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-56 lg:pt-36">
            <a href="https://oroton.com/" target="_blank" rel="noopener noreferrer">
              <h2 className="text-4xl text-neutral-50 font-black lg:text-6xl mt-10">Oroton</h2>
            </a>
            <p className="text-md lg:text-lg max-w-xl text-neutral-50">Scales Omnichannel Customer Experiences with BigCommerce
            </p>
            <Button asChild className="w-fit mt-4">
              <a href="https://www.bigcommerce.com/case-study/oroton/" target="_blank" rel="noopener noreferrer">Case Study</a>
            </Button>
          </div>
        </div>
      </SlideshowSlide>

      <SlideshowSlide>
        <div className="relative ">
          <Image
            alt="Glasscraft slide image"
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
            <a href="https://www.karava.fi/en/" target="_blank" rel="noopener noreferrer">
              <h2 className="text-4xl text-neutral-50 font-black lg:text-6xl mt-10 ">Karava</h2>
            </a>
            <p className="text-lg max-w-xl text-neutral-50 ">
              achieves B2B excellence with BigCommerce
            </p>
            <Button asChild className="w-fit mt-4">
              <a href="https://www.bigcommerce.com/case-study/karava/" target="_blank" rel="noopener noreferrer">Case Study</a>

            </Button>
          </div>
        </div>
      </SlideshowSlide>

      <SlideshowSlide>
        <div className="relative ">
          <Image
            alt="The Liz slide image"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover  sm:object-center"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG}
          />
          <div className="absolute inset-0 bg-black opacity-30 -z-10" />
          <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-56 lg:pt-36 ">
            <a href="https://shop.linzheritageangus.com/" target="_blank" rel="noopener noreferrer">
              <h2 className="text-4xl text-neutral-50 font-black lg:text-6xl mt-10 ">The Linz Shop</h2>
            </a>
            <p className="text-md lg:text-lg max-w-xl text-neutral-50">
              Partners with BigCommerce and EYStudios to See Impressive Growth
            </p>
            <Button asChild className="w-fit mt-4">
              <a href="https://www.bigcommerce.com/case-study/the-linz-shop/" target="_blank" rel="noopener noreferrer">Case Study</a>
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
