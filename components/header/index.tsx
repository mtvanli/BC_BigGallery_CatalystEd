import { ShoppingCart, User, LogOut } from 'lucide-react';
import { ReactNode, Suspense } from 'react';

import { getSessionCustomerId } from '~/auth';
import { FragmentOf, graphql } from '~/client/graphql';
import { Link } from '~/components/link';
import { Button } from '~/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuCollapsed,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuToggle,
} from '~/components/ui/navigation-menu';

import { QuickSearch } from '../quick-search';
import { StoreLogo, StoreLogoFragment } from '../store-logo';

import { logout } from './_actions/logout';
import { CartLink } from './cart';
import { HeaderNav, HeaderNavFragment } from './header-nav';
import { Slider } from 'components/custom-icons/sliders'
import { Info } from 'components/custom-icons/info'
// import Logo from '~/components/custom-icons/custom_logo';

import BG_Assistant from 'components/bg-assistant/index'

export const HeaderFragment = graphql(
  `
    fragment HeaderFragment on Site {
      settings {
        ...StoreLogoFragment
      }
      ...HeaderNavFragment
    }
  `,
  [StoreLogoFragment, HeaderNavFragment],
);

interface Props {
  cart?: ReactNode;
  data: FragmentOf<typeof HeaderFragment>;
}

export const Header = async ({ cart, data }: Props) => {
  const customerId = await getSessionCustomerId();

  return (
    <header>
      <NavigationMenu >
        {data.settings && (
          <NavigationMenuLink
            asChild
            className="flex-1 overflow-hidden text-ellipsis px-0 xl:flex-none"
          >
            <Link href="/">
              <StoreLogo data={data.settings} />
              {/* <Logo width="180" height="70" /> */}
            </Link>
          </NavigationMenuLink>
        )}

        <HeaderNav className="hidden xl:flex" data={data.categoryTree} />

        <div className="flex">
          <NavigationMenuList className="h-full ">
            {data.settings && (
              <NavigationMenuItem className="hidden sm:block">
                <QuickSearch>
                  <Link className="flex" href="/">
                    <StoreLogo data={data.settings} />
                  </Link>
                </QuickSearch>
              </NavigationMenuItem>
            )}
            {/*   <NavigationMenuItem className={`hidden xl:flex ${customerId ? 'self-stretch' : ''}`}>
              {customerId ? (
                <div className="group/account flex cursor-pointer items-center">
                  <Link
                    aria-label="Account"
                    className="p-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                    href="/account"
                  >
                    <User aria-hidden="true" />
                  </Link>

                  <ul className="absolute -right-12 top-full z-10 hidden cursor-default bg-white p-6 pb-8 shadow-md group-hover/account:block [&>li]:mb-2">
                    <li>
                      <Link
                        className="whitespace-nowrap font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                        href="/account"
                      >
                        My account
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                        href="/account/orders"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                        href="/account/messages"
                      >
                        Messages
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                        href="/account/addresses"
                      >
                        Addresses
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                        href="/account/wishlists"
                      >
                        Wish lists
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                        href="/account/recently-viewed"
                      >
                        Recently viewed
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-4"
                        href="/account/settings"
                      >
                        Account Settings
                      </Link>
                    </li>
                    <li>
                      <form action={logout}>
                        <Button
                          className="justify-start p-0 font-normal text-black hover:bg-transparent hover:text-black"
                          type="submit"
                          variant="subtle"
                        >
                          Log out
                        </Button>
                      </form>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavigationMenuLink asChild>
                  <Link aria-label="Login" href="/login">
                    <User />
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem> */}


            {/*      <NavigationMenuItem>
              <p role="status">
                <Suspense
                  fallback={
                    <CartLink>
                      <ShoppingCart aria-label="cart" />
                    </CartLink>
                  }
                >
                  {cart}
                </Suspense>
              </p>
            </NavigationMenuItem> */}
            {/* <NavigationMenuItem className="hidden lg:block">
            <Link  href="/bg_admin">
              <Slider /> 
            </Link>
            </NavigationMenuItem> */}
            {/*  <NavigationMenuItem className="hidden xl:block">
           
           </NavigationMenuItem> */}
            {/*            <NavigationMenuItem className="hidden lg:block">
            <Link  href="/about">
            <Info /> 
                  </Link>
            </NavigationMenuItem> */}
            <NavigationMenuItem className="hidden lg:block">

              <BG_Assistant />

            </NavigationMenuItem>
            <NavigationMenuItem className="hidden xl:block">

            </NavigationMenuItem>
            <NavigationMenuItem className="hidden xl:block">

              <form action={logout}>
                <Button
                  className="justify-start p-0 font-normal text-black hover:bg-transparent hover:text-black"
                  type="submit"
                  variant="subtle"
                >
                  <LogOut />
                </Button>
              </form>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuToggle className="xl:hidden" />
            </NavigationMenuItem>


          </NavigationMenuList>
        </div>

        <NavigationMenuCollapsed>
          <HeaderNav data={data.categoryTree} inCollapsedNav />
        </NavigationMenuCollapsed>
      </NavigationMenu>
    </header>
  );
};
