import type { Metadata } from 'next';
import TrpcProvider from './_trpc/provider';
import { Provider as JotaiProvider } from 'jotai';
import './globals.css';

export const metadata: Metadata = {
  title: 'note',
  description: 'メモ帳アプリです',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <TrpcProvider>
          <JotaiProvider>
            {/* <Loading /> */}
            {children}
          </JotaiProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
