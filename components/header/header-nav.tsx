import { ChevronDown, User } from 'lucide-react';

import { getSessionCustomerId } from '~/auth';
import { logout } from './_actions/logout';
import { FragmentOf, graphql } from '~/client/graphql';
import { Link } from '~/components/link';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Logout } from 'components/custom-icons/logout'

export const HeaderNavFragment = graphql(`
  fragment HeaderNavFragment on Site {
    categoryTree {
      entityId
      name
      path
      children {
        entityId
        name
        path
        children {
          entityId
          name
          path
        }
      }
    }
  }
`);

interface Props {
  data: FragmentOf<typeof HeaderNavFragment>['categoryTree'];
  className?: string;
  inCollapsedNav?: boolean;
}

export const HeaderNav = async ({ data, className, inCollapsedNav = false }: Props) => {
  // To prevent the navigation menu from overflowing, we limit the number of categories to 6.
  // To show a full list of categories, modify the `slice` method to remove the limit.
  // Will require modification of navigation menu styles to accommodate the additional categories.
  const categoryTree = data.slice(0, 6);
  const customerId = await getSessionCustomerId();

  return (
    <>
      <NavigationMenuList
        className={cn(
          !inCollapsedNav && 'lg:gap-4',
          inCollapsedNav && 'flex-col items-start pb-6',
          className,
        )}
      >
        {categoryTree.map((category) => (
          <NavigationMenuItem className={cn(inCollapsedNav && 'w-full')} key={category.path}>
            {category.children.length > 0 ? (
              <>
                <NavigationMenuTrigger className="gap-0 p-0">
                  <>
                    <NavigationMenuLink asChild>
                      <Link className="grow" href={category.path}>
                        {category.name}
                      </Link>
                    </NavigationMenuLink>
                    <span className={cn(inCollapsedNav && 'p-3')}>
                      <ChevronDown
                        aria-hidden="true"
                        className="cursor-pointer transition duration-200 group-data-[state=open]/button:-rotate-180"
                      />
                    </span>
                  </>
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  className={cn(
                    !inCollapsedNav && 'mx-auto flex w-[700px] flex-row gap-20',
                    inCollapsedNav && 'ps-3',
                  )}
                >
                  {category.children.map((childCategory1) => (
                    <ul className={cn(inCollapsedNav && 'pb-4')} key={childCategory1.entityId}>
                      <NavigationMenuItem>
                        <NavigationMenuLink href={childCategory1.path}>
                          {childCategory1.name}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      {childCategory1.children.map((childCategory2) => (
                        <NavigationMenuItem key={childCategory2.entityId}>
                          <NavigationMenuLink className="font-normal" href={childCategory2.path}>
                            {childCategory2.name}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </ul>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link href={category.path}>{category.name}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
     
      {inCollapsedNav && (
        <NavigationMenuList className={cn('flex-col items-start border-t border-gray-200 pt-6')}>
          <NavigationMenuItem className="w-full">
 

            <form action={logout}>
                        <Button
                          className="justify-end p-0 font-normal text-black hover:bg-transparent hover:text-black"
                          type="submit"
                          variant="subtle"
                        >
                          <Logout /> 
                        </Button>
                      </form> 
          </NavigationMenuItem>
        </NavigationMenuList>
      )}  
      
    </>
  );
};
