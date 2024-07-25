import { PropsWithChildren } from 'react';

import { AccountStatusProvider } from '../(default)/account/[tab]/_components/account-status-provider';

export default function LoginLayout({ children }: PropsWithChildren) {
  return <AccountStatusProvider isPermanentBanner={true}>{children}</AccountStatusProvider>;
}
