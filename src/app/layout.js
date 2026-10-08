import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Aura Store - Modern E-Commerce',
  description: 'A premium online store built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
