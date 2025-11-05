import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { ToastProvider } from '@/lib/context/ToastContext';
import { PWASetup } from '@/components/layout/PWASetup';

export const metadata: Metadata = {
  title: 'SubTracker - Subscription Management Dashboard',
  description: 'Track and manage all your subscriptions in one place',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SubTracker',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900">
        <PWASetup />
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

