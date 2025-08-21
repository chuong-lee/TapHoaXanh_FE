// Layout Components
export { default as Header } from './layout/Header'
export { default as Footer } from './layout/Footer'
// Marquee export removed

// UI Components
export { default as Avatar } from './ui/Avatar'
export { default as LoadingSkeleton } from './ui/LoadingSkeleton'
export { default as Pagination } from './ui/Pagination'
export { default as ErrorBoundary } from './ui/ErrorBoundary'
export { default as FeaturesDemo } from './ui/FeaturesDemo'
export { default as Button } from './ui/Button'
export { Card, CardHeader, CardBody, CardFooter } from './ui/Card'

// Product Components
export { default as ProductCard } from './product/ProductCard'
export { default as CategoryFilter } from './product/CategoryFilter'
export { default as CategoryProductList } from './product/CategoryProductList'
export { default as CategorySidebar } from './product/CategorySidebar'
export { default as SidebarFilter } from './product/SidebarFilter'
export { default as Search } from './product/Search'

// Order Components
export { default as OrderCard } from './order/OrderCard'
export { default as OrderList } from './order/OrderList'

// Payment Components
export { default as PaymentGateway } from './payment/PaymentGateway'
export { default as PaymentStatus } from './payment/PaymentStatus'
export { default as PaymentStatusTester } from './payment/PaymentStatusTester'

// User Components
export { default as AddressManager } from './user/AddressManager'
export { default as LogoutButton } from './user/logout'

// PWA Components
export { default as PWAComponents } from './pwa/PWAComponents'

// Legacy exports for backward compatibility
export { CategoryList } from '../../components/CategoryList'
