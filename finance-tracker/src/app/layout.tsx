import type { Metadata } from 'next';
import './globals.css';
import QueryClientWrapper from '../components/QueryClientWrapper';

export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  description: 'Track your income and expenses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientWrapper>
          {children}
        </QueryClientWrapper>
      </body>
    </html>
  );
}