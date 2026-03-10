import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './styles/globals.scss';
import { StoreProvider } from './providers/StoreProvider';

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zyrix',
  description: 'Zyrix - The Future of Decentralized Finance',
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
};

export default Layout;
