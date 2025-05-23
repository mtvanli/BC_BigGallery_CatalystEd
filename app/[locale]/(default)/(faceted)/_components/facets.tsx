'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormEvent, useRef, useTransition } from 'react';

import { Link } from '~/components/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Rating } from '~/components/ui/rating';
import { cn } from '~/lib/utils';

import type { Facet, PageType } from '../types';

interface ProductCountProps {
  shouldDisplay: boolean;
  count: number;
}

const ProductCount = ({ shouldDisplay, count }: ProductCountProps) => {
  if (!shouldDisplay) {
    return null;
  }

  return (
    <span className="ps-3 text-gray-500">
      {count} <span className="sr-only">products</span>
    </span>
  );
};

export interface Props {
  facets: Facet[];
  pageType: PageType;
}

export const Facets = ({ facets, pageType }: Props) => {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const t = useTranslations('FacetedGroup.FacetedSearch.Facets');

  const defaultOpenFacets = facets
    .filter((facet) => !facet.isCollapsedByDefault)
    .map((facet) => facet.name);

  const submitForm = () => {
    ref.current?.requestSubmit();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const sortParam = searchParams.get('sort');
    const searchParam = searchParams.get('term');
    const filteredSearchParams = Array.from(formData.entries())
      .filter((entry): entry is [string, string] => {
        return !(entry instanceof File);
      })
      .filter(([, value]) => value !== '');

    const newSearchParams = new URLSearchParams(filteredSearchParams);

    // We want to keep the sort param if it exists
    if (sortParam) {
      newSearchParams.append('sort', sortParam);
    }

    // We want to keep the search param if it exists
    if (searchParam) {
      newSearchParams.append('term', searchParam);
    }

    startTransition(() => {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    });
  };

  return (
    <Accordion defaultValue={defaultOpenFacets} type="multiple">
      <form data-pending={isPending ? '' : undefined} onSubmit={handleSubmit} ref={ref}>
        {facets.map((facet) => {
          if (facet.__typename === 'BrandSearchFilter' && pageType !== 'brand') {
            return (
              <AccordionItem key={facet.__typename} value={facet.name}>
                <AccordionTrigger>
                  <h3>{facet.name}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  {facet.brands.map((brand) => {
                    const normalizedBrandName = brand.name.replace(/\s/g, '-').toLowerCase();
                    const id = `${normalizedBrandName}-${brand.entityId}`;
                    const labelId = `${normalizedBrandName}-${brand.entityId}-label`;

                    const key = `${brand.entityId}-${brand.isSelected.toString()}`;

                    return (
                      <div className="flex max-w-sm items-center py-2 ps-1" key={key}>
                        <Checkbox
                          aria-labelledby={labelId}
                          defaultChecked={brand.isSelected}
                          id={id}
                          name="brand"
                          onCheckedChange={submitForm}
                          value={brand.entityId}
                        />
                        <Label
                          className="cursor-pointer ps-3 font-normal"
                          htmlFor={id}
                          id={labelId}
                        >
                          {brand.name}
                          <ProductCount
                            count={brand.productCount}
                            shouldDisplay={facet.displayProductCount}
                          />
                        </Label>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          }

          if (facet.__typename === 'CategorySearchFilter' && pageType !== 'category') {
            return (
              <AccordionItem key={facet.__typename} value={facet.name}>
                <AccordionTrigger>
                  <h3>{facet.name}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  {facet.categories.map((category) => {
                    const normalizedCategoryName = category.name.replace(/\s/g, '-').toLowerCase();
                    const id = `${normalizedCategoryName}-${category.entityId}`;
                    const labelId = `${normalizedCategoryName}-${category.entityId}-label`;

                    const key = `${category.entityId}-${category.isSelected.toString()}`;

                    return (
                      <div className="flex max-w-sm items-center py-2 ps-1" key={key}>
                        <Checkbox
                          aria-labelledby={labelId}
                          defaultChecked={category.isSelected}
                          id={id}
                          name="categoryIn"
                          onCheckedChange={submitForm}
                          value={category.entityId}
                        />
                        <Label
                          className="cursor-pointer ps-3 font-normal"
                          htmlFor={id}
                          id={labelId}
                        >
                          {category.name}
                          <ProductCount
                            count={category.productCount}
                            shouldDisplay={facet.displayProductCount}
                          />
                        </Label>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          }

          if (facet.__typename === 'ProductAttributeSearchFilter') {
            return (
              <AccordionItem key={`${facet.__typename}-${facet.filterName}`} value={facet.name}>
                <AccordionTrigger>
                  <h3>{facet.name}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  {(() => {
                    // For HealthScore, reorder attributes in the specified order
                    let attributesToRender = [...facet.attributes];

                    if (facet.filterName === 'HealthScore') {
                      // Define the order for HealthScore values
                      const healthScoreOrder = [
                        'Excellent',
                        'Very Good',
                        'Good',
                        'Bad',
                        'Churn Risk',
                        'Churning',
                        'Unmanaged'
                      ];

                      // Sort based on the defined order
                      attributesToRender.sort((a, b) => {
                        const indexA = healthScoreOrder.indexOf(a.value);
                        const indexB = healthScoreOrder.indexOf(b.value);

                        // If both values are in our order array, sort by the defined order
                        if (indexA !== -1 && indexB !== -1) {
                          return indexA - indexB;
                        }

                        // If only one value is in our order array, prioritize it
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;

                        // For any other values, maintain their original order
                        return 0;
                      });
                    }


                    if (facet.filterName === 'Region') {
                      // Define the order for HealthScore values
                      const healthScoreOrder = [
                        'US',
                        'CA',
                        'LATAM',
                        'AU',
                        'NZ',
                        'SG',
                        'JP',
                        'KR',
                        'IN',
                        'APAC - Other',
                        'UK',
                        'IT',
                        'NL',
                        'DE',
                        'ES',
                        'FR',
                        'EMEA - Other',
                        'Global'
                      ];

                      // Sort based on the defined order
                      attributesToRender.sort((a, b) => {
                        const indexA = healthScoreOrder.indexOf(a.value);
                        const indexB = healthScoreOrder.indexOf(b.value);

                        // If both values are in our order array, sort by the defined order
                        if (indexA !== -1 && indexB !== -1) {
                          return indexA - indexB;
                        }

                        // If only one value is in our order array, prioritize it
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;

                        // For any other values, maintain their original order
                        return 0;
                      });
                    }

                    return attributesToRender.map((attribute) => {
                      const normalizedFilterName = facet.filterName.replace(/\s/g, '-').toLowerCase();
                      const normalizedAttributeValue = attribute.value
                        .replace(/\s/g, '-')
                        .toLowerCase();
                      const id = `${normalizedFilterName}-${attribute.value}`;
                      const labelId = `${normalizedFilterName}-${normalizedAttributeValue}-label`;

                      const key = `${attribute.value}-${attribute.value
                        }-${attribute.isSelected.toString()}`;

                      // Function to get emoji for HealthScore values
                      /*     const getHealthScoreEmoji = (value) => {
                            if (facet.filterName === 'HealthScore') {
                              const emojis = {
                                'Unmanaged': ' 🤷‍♂️',
                                'Churning': ' 🚨',
                                'Churn Risk': ' ⚠️',
                                'Bad': ' ☹️',
                                'Good': ' 😊',
                                'Very Good': ' 😀',
                                'Excellent': ' 🏆'
                              };
                              return emojis[value] || '';
                            }
                            return '';
                          }; */

                      // Don't show attribute values na and na_ in the list
                      // For HealthScore, show all attributes regardless of product count
                      if (attribute.value !== 'na' && attribute.value !== 'na_') {
                        // Always show HealthScore attributes, regardless of count
                        const shouldShow = facet.filterName === 'HealthScore' ||
                          (attribute.productCount > 0 || attribute.isSelected);

                        if (shouldShow) {
                          return (
                            <div className="flex max-w-sm items-center py-1.5 xl:ps-1 2xl:ps-1" key={key}>
                              <Checkbox
                                aria-labelledby={labelId}
                                defaultChecked={attribute.isSelected}
                                id={id}
                                name={`attr_${facet.filterName}`}
                                onCheckedChange={submitForm}
                                value={attribute.value}
                              />
                              <Label
                                className="cursor-pointer ps-3 font-normal text-sm xl:text-base"
                                htmlFor={id}
                                id={labelId}
                              >
                                {attribute.value}
                                {/* {facet.filterName === 'HealthScore' && (
                                  <span className="ml-1">{getHealthScoreEmoji(attribute.value)}</span>
                                )} */}
                                <ProductCount
                                  count={attribute.productCount}
                                  shouldDisplay={facet.filterName === 'HealthScore' ? true : facet.displayProductCount}
                                />
                              </Label>

                            </div>

                          );
                        }
                      }
                      return null;
                    });
                  })()}
                </AccordionContent>
              </AccordionItem>
            );
          }

          if (facet.__typename === 'RatingSearchFilter') {
            return (
              <AccordionItem key={facet.__typename} value={facet.name}>
                <AccordionTrigger>
                  <h3>{facet.name}</h3>
                </AccordionTrigger>
                <AccordionContent className="overflow-visible">
                  {facet.ratings
                    //.filter((rating) => rating.value !== '5')
                    .sort((a, b) => parseInt(b.value, 10) - parseInt(a.value, 10))
                    .map((rating) => {
                      const key = `${facet.name}-${rating.value}-${rating.isSelected.toString()}`;

                      const search = new URLSearchParams(searchParams);

                      search.set('minRating', rating.value);

                      return (
                        <Link
                          className="flex flex-row flex-nowrap py-2"
                          href={{ search: `?${search.toString()}` }}
                          key={key}
                        >
                          <div
                            className={cn('flex flex-row flex-nowrap', {
                              'text-primary': rating.isSelected,
                            })}
                          >
                            <Rating value={parseInt(rating.value, 10)} />
                          </div>
                          <span className="ps-2">
                            <span className="sr-only">
                              {t('rating', { currentRating: rating.value })}
                            </span>
                            {rating.value !== '5' && <>&nbsp;& up</>}
                          </span>
                          <ProductCount count={rating.productCount} shouldDisplay={true} />
                        </Link>
                      );
                    })}
                </AccordionContent>
              </AccordionItem>
            );
          }

          if (facet.__typename === 'PriceSearchFilter') {
            return (
              <AccordionItem key={facet.__typename} value={facet.name}>
                <AccordionTrigger>
                  <h3>{facet.name}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 p-1">
                    <Input
                      aria-label={t('priceFilter.minPriceAriaLabel')}
                      defaultValue={facet.selected?.minPrice ?? ''}
                      name="minPrice"
                      placeholder={t('priceFilter.minPricePlaceholder', { currencySign: '$' })}
                    />
                    <Input
                      aria-label={t('priceFilter.maxPriceAriaLabel')}
                      defaultValue={facet.selected?.maxPrice ?? ''}
                      name="maxPrice"
                      placeholder={t('priceFilter.maxPricePlaceholder', { currencySign: '$' })}
                    />
                    <Button className="col-span-2" type="submit" variant="secondary">
                      {t('updatePriceButton')}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          }

          if (facet.__typename === 'OtherSearchFilter') {
            const key = `${facet.__typename}-${String(facet.isInStock?.isSelected)}-${String(
              facet.isFeatured?.isSelected,
            )}-${String(facet.freeShipping?.isSelected)}`;

            return (
              <AccordionItem key={key} value={facet.name}>
                <AccordionTrigger>
                  <h3>{facet.name}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  {facet.freeShipping && (
                    <div className="flex max-w-sm items-center py-2 ps-1">
                      <Checkbox
                        aria-labelledby="shipping-free_shipping-label"
                        defaultChecked={facet.freeShipping.isSelected}
                        id="shipping-free_shipping"
                        name="shipping"
                        onCheckedChange={submitForm}
                        value="free_shipping"
                      />
                      <Label
                        className="cursor-pointer ps-3 font-normal"
                        htmlFor="shipping-free_shipping"
                        id="shipping-free_shipping-label"
                      >
                        {t('freeShippingLabel')}
                        <ProductCount
                          count={facet.freeShipping.productCount}
                          shouldDisplay={facet.displayProductCount}
                        />
                      </Label>
                    </div>
                  )}
                  {facet.isFeatured && (
                    <div className="flex max-w-sm items-center py-2 ps-1">
                      <Checkbox
                        aria-labelledby="isFeatured-label"
                        defaultChecked={facet.isFeatured.isSelected}
                        id="isFeatured"
                        name="isFeatured"
                        onCheckedChange={submitForm}
                      />
                      <Label
                        className="cursor-pointer ps-3 font-normal"
                        htmlFor="isFeatured"
                        id="isFeatured-label"
                      >
                        {t('isFeaturedLabel')}
                        <ProductCount
                          count={facet.isFeatured.productCount}
                          shouldDisplay={facet.displayProductCount}
                        />
                      </Label>
                    </div>
                  )}
                  {facet.isInStock && (
                    <div className="flex max-w-sm items-center py-2 ps-1">
                      <Checkbox
                        aria-labelledby="stock-in_stock-label"
                        defaultChecked={facet.isInStock.isSelected}
                        id="stock-in_stock"
                        name="stock"
                        onCheckedChange={submitForm}
                        value="in_stock"
                      />
                      <Label
                        className="cursor-pointer ps-3 font-normal"
                        htmlFor="stock-in_stock"
                        id="stock-in_stock-label"
                      >
                        {t('inStockLabel')}
                        <ProductCount
                          count={facet.isInStock.productCount}
                          shouldDisplay={facet.displayProductCount}
                        />
                      </Label>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          }

          return null;
        })}
      </form>
    </Accordion>
  );
};
