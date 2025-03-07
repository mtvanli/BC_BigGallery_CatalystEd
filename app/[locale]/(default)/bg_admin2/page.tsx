import { NextIntlClientProvider } from 'next-intl';
import { revalidate } from '~/client/revalidate-target';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';
import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import BG_AdminPage from '~/app/[locale]/(default)/bg_admin/page'
import BG_Admin from '~/app/[locale]/(default)/bg_admin2/admin_main'

const GetCustomerGroup = graphql(`
  query GetCustomerGroup {
    customer{
      customerGroupId
    }
  }
`);

// Component for the styled error message
const AccessDeniedMessage = () => (
  <div className="flex justify-center items-center min-h-[50vh] w-full px-4">
    <div className="font-semibold text-center">
      <p className="text-xl md:text-2xl lg:text-3xl" >You don't have access to the gallery admin pages.</p>
      <p className="mt-4 texl-l">Reach out if want to help curate Big Gallery.  Email: <a href="mailto:mehmet.vanli@bigcommerce.com" className="text-blue-600 hover:underline">mehmet.vanli@bigcommerce.com</a></p>
    </div>
  </div >
);

// Component for the error message when fetching fails
const ErrorMessage = () => (
  <div className="flex justify-center items-center min-h-[50vh] w-full px-4">
    <p className="text-2xl md:text-3xl font-semibold text-center">
      Error retrieving customer group information
    </p>
  </div>
);

const getCustomerGroup = async () => {
  const customerId = await getSessionCustomerId();

  console.log(customerId)

  // Ensure we have a valid customer ID before proceeding
  if (!customerId) {
    console.error("Customer ID not found");
    return <AccessDeniedMessage />;
  }

  try {
    const { data } = await client.fetch({
      document: GetCustomerGroup,
      fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
      customerId,
    });

    // Check if data.customer exists and if customerGroupId is 1
    if (data?.customer && data.customer.customerGroupId === 1) {
      return <BG_Admin />;
    } else {
      return <AccessDeniedMessage />;
    }
  } catch (error) {
    console.error("Error fetching customer group:", error);
    return <ErrorMessage />;
  }
}

export default getCustomerGroup;