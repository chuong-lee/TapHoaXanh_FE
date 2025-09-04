import './styles.scss';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PWAComponents from './components/pwa/PWAComponents';
import QueryProvider from './providers/QueryProvider';

export const metadata = {
  title: {
    default: 'T.H.X',
    template: '%s | Tạp Hóa Xanh'
  },
  description: 'Tạp Hóa Xanh - Ứng dụng mua sắm tạp hóa trực tuyến với đầy đủ các mặt hàng thiết yếu, giao hàng nhanh chóng và giá cả hợp lý.',
  keywords: 'tạp hóa, mua sắm, thực phẩm, đồ gia dụng, giao hàng, online',
  authors: [{ name: 'Tạp Hóa Xanh Team' }],
  creator: 'Tạp Hóa Xanh',
  publisher: 'Tạp Hóa Xanh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tạp Hóa Xanh',
  },
  openGraph: {
    type: 'website',
    siteName: 'Tạp Hóa Xanh',
    title: 'Tạp Hóa Xanh - Mua sắm tiện lợi, chất lượng đảm bảo',
    description: 'Ứng dụng mua sắm tạp hóa trực tuyến với đầy đủ các mặt hàng thiết yếu.',
    url: 'https://taphoaxanh.com',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Tạp Hóa Xanh Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tạp Hóa Xanh - Mua sắm tiện lợi',
    description: 'Ứng dụng mua sắm tạp hóa trực tuyến với đầy đủ các mặt hàng thiết yếu.',
    images: ['/icons/icon-512x512.png'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#22c55e',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#22c55e" />
        {/* Thêm Font Awesome nếu cần */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/api/products" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/api/categories" as="fetch" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//localhost" />
        
        {/* Preload critical images */}
        <link rel="preload" href="/client/images/logo.svg" as="image" />
        <link rel="preload" href="/client/images/vegetables-basket.png" as="image" />
      </head>
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <Header />
              
                {children}
              
              <Footer />
              <PWAComponents />
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
        
        {/* Bootstrap JS */}
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          defer
        />
        
        {/* Debug API calls */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log('API Base URL:', '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}');
                
                // Test API connection
                fetch('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/categories')
                  .then(res => res.json())
                  .then(data => console.log('API Test - Categories:', data))
                  .catch(err => console.error('API Test Failed:', err));
              `
            }}
          />
        )}
      </body>
    </html>
  );
}