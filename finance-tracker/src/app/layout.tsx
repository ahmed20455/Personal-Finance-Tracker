import type { Metadata } from 'next';
import './globals.css';
import QueryClientWrapper from '../components/QueryClientWrapper';
import { CurrencyProvider } from '../context/CurrencyContext';
import { ThemeProvider } from '../context/ThemeContext';

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
      <body className="font-sans antialiased">
        <QueryClientWrapper>
          <CurrencyProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </CurrencyProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
}