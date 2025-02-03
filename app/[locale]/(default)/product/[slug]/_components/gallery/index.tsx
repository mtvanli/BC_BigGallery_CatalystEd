'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { FragmentOf } from '~/client/graphql';
import { BcImage } from '~/components/bc-image';
import {
  Gallery as ComponentsGallery,
  GalleryContent,
  GalleryControls,
  GalleryImage,
  GalleryThumbnail,
  GalleryThumbnailItem,
  GalleryThumbnailList,
} from '~/components/ui/gallery';

import { GalleryFragment } from './fragment';

interface Props {
  product: FragmentOf<typeof GalleryFragment>;
  noImageText?: string;
}

export const Gallery = ({ product, noImageText }: Props) => {
  const images = removeEdgesAndNodes(product.images);
  const topLevelDefaultImg = images.find((image) => image.isDefault);

  console.log(product)

  if (product.defaultImage && topLevelDefaultImg?.url !== product.defaultImage.url) {
    images.forEach((image) => {
      image.isDefault = false;
    });

    images.push({
      url: product.defaultImage.url,
      altText: product.defaultImage.altText,
      isDefault: true,
    });
  }

  const defaultImageIndex = images.findIndex((image) => image.isDefault);

  return (
    <div className=" sm:-mx-0 md:mb-12">
      {/* Mobile Gallery with Controls */}
      <div className="lg:hidden sm:px-0">
        <ComponentsGallery defaultImageIndex={defaultImageIndex} images={images}>
          <GalleryContent >
            <GalleryImage>
              {({ selectedImage }) =>
                selectedImage ? (
                  <BcImage
                    alt={selectedImage.altText}
                    className="h-full w-full object-contain"
                    fill
                    priority={true}
                    sizes="100vw"
                    src={selectedImage.url}
                  />
                ) : (
                  <div className="flex  items-center justify-center bg-gray-200">
                    <div className="text-base font-semibold text-gray-500">
                      {noImageText ?? 'Coming soon'}
                    </div>
                  </div>
                )
              }
            </GalleryImage>
            <GalleryControls />
          </GalleryContent>
          <GalleryThumbnailList className="px-6 sm:px-1">
            {images.map((image, index) => (
              <GalleryThumbnailItem imageIndex={index} key={image.url} className="h-16 w-16 md:h-24 md:w-24">
                <GalleryThumbnail asChild>
                  <BcImage alt={image.altText} priority={true} src={image.url} />
                </GalleryThumbnail>
              </GalleryThumbnailItem>
            ))}
          </GalleryThumbnailList>
        </ComponentsGallery>
      </div>

      {/* Desktop Stacked Gallery */}
      <div className="hidden lg:block space-y-14">
        {images.map((image, index) => (
          <div
            key={image.url}
            className="max-w-[75%] mx-auto relative rounded-lg shadow-md border border-gray-100 bg-white p-4 aspect-[3/4]"
          >
            <BcImage
              alt={image.altText}
              className="h-full w-full object-contain  object-top rounded-lg"
              fill
              priority={index === 0}
              sizes="50vw"
              src={image.url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};