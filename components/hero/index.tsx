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

import SlideshowBG from './slideshow-bg-02.jpg';
import SlideshowBG3 from './slideshow-bg-03.jpg';
import SlideshowBG4 from './slideshow-bg-04.png';

const SlideshowBlurDataURL =
  'data:image/jpeg;base64,/9j/4QC8RXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAAoAAAADoAQAAQAAAAcAAAAAAAAA/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgABwAKAwERAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAMJ/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAURABIhMQYjgf/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/EABkRAAIDAQAAAAAAAAAAAAAAAAARAQIhQf/aAAwDAQACEQMRAD8AoZ5EzayKWW3Syo0GyKPTJlsF9ts9klsKTu46GQOfms2awJfAKywmt1sRNgqK7PS0gSHI4WltTmBuKQckJJzgE9aYa0tP/9k=';

export const Hero = () => (
  <Slideshow>
    <SlideshowContent>
      <SlideshowSlide>
        <div className="relative ">
          <Image
            alt="an assortment of brandless products against a blank background"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover sm:object-right"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG}
            
          />
          <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-36 ">
            <h2 className="text-5xl font-black lg:text-6xl mt-10">AS Colour</h2>
            <p className="max-w-xl"> Gets Outfitted for International Growth on BigCommerce
            </p>
            <Button asChild className="w-fit">
              <a href="https://www.bigcommerce.com/case-study/as-colour/">Case Study</a>
            </Button>
          </div>
        </div>
      </SlideshowSlide>
      <SlideshowSlide>
      <div className="relative ">
      <Image
            alt="an assortment of brandless products against a blank background"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover sm:object-right"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG3}
          />
        <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-36  ">
          <h2 className="text-5xl font-black lg:text-6xl mt-10 ">London Tile Company</h2>
          <p className="max-w-xl">
          Designs a Top-Tier Site with BigCommerce
          </p>
          <Button asChild className="w-fit">
            <a href="https://www.bigcommerce.com/case-study/london-tile-company/">Case Study</a>
          </Button>
        </div>
        </div>
      </SlideshowSlide>
      <SlideshowSlide>
      <div className="relative ">
      <Image
            alt="an assortment of brandless products against a blank background"
            blurDataURL={SlideshowBlurDataURL}
            className="absolute -z-10 object-cover sm:object-center"
            fill
            placeholder="blur"
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            src={SlideshowBG4}
          />
        <div className="flex flex-col h-[548px] gap-4 px-12 pb-48 pt-36">
          <h2 className="text-5xl text-neutral-50 font-black lg:text-6xl mt-10 ">Cordova Outdoors</h2>
          <p className="max-w-xl text-neutral-50 ">
          Blazes a Trail of Success with BigCommerce
          </p>
          <Button asChild className="w-fit">
            <a href="https://www.bigcommerce.com/case-study/cordova-outdoors/">Case Study</a>
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
