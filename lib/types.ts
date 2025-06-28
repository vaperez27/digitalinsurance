// Auth types
export interface User {
  id: string;
  name?: string | null;
  email: string;
  password?: string | null;
  role: string;
  phone?: string | null;
  document?: string | null;
  countryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Marketplace types
export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  active: boolean;
}

export interface InsuranceType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  active: boolean;
}

export interface InsuranceProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  currency: string;
  insuranceTypeId: string;
  countryId: string;
  company: string;
  companyLogo?: string | null;
  features: string[];
  coverage: Record<string, any>;
  deductible?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  active: boolean;
  insuranceType?: InsuranceType;
  country?: Country;
}

export interface Quote {
  id: string;
  userId?: string | null;
  email?: string | null;
  productId: string;
  personalData: Record<string, any>;
  vehicleData?: Record<string, any> | null;
  beneficiaryData?: Record<string, any> | null;
  travelData?: Record<string, any> | null;
  healthData?: Record<string, any> | null;
  calculatedPrice: number;
  validUntil: Date;
  status: string;
  countryId: string;
  product?: InsuranceProduct;
  country?: Country;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quoteId?: string | null;
  quantity: number;
  price: number;
  data?: Record<string, any> | null;
  product?: InsuranceProduct;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
  countryId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  buyerDocument?: string | null;
  paymentStatus: string;
  paymentMethod?: string | null;
  paymentId?: string | null;
  stripeSessionId?: string | null;
  items: OrderItem[];
  policies: Policy[];
  country?: Country;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  data?: Record<string, any> | null;
  product?: InsuranceProduct;
}

export interface Policy {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  policyNumber: string;
  status: string;
  startDate: Date;
  endDate: Date;
  premium: number;
  beneficiary?: Record<string, any> | null;
  coverage: Record<string, any>;
  documents?: Record<string, any> | null;
  product?: InsuranceProduct;
  order?: Order;
}

// Form types
export interface QuoteFormData {
  insuranceType: string;
  countryId: string;
  personalData: {
    name: string;
    email: string;
    phone?: string;
    document?: string;
    age: number;
  };
  vehicleData?: {
    brand?: string;
    model?: string;
    year?: number;
    usage?: string;
  };
  beneficiaryData?: {
    name?: string;
    relationship?: string;
    percentage?: number;
  };
  travelData?: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    travelers?: number;
  };
  healthData?: {
    preExistingConditions?: boolean;
    smoker?: boolean;
    coverage?: string;
  };
}

export interface CheckoutFormData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerDocument?: string;
  paymentMethod: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Admin types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  newUsers: number;
  activePolicies: number;
  todayOrders: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: InsuranceProduct;
    sales: number;
    revenue: number;
  }>;
  salesByCountry: Array<{
    country: Country;
    sales: number;
    revenue: number;
  }>;
}

export interface AdminUser extends User {
  totalOrders?: number;
  totalSpent?: number;
  lastOrder?: Date;
  country?: Country;
  _count?: {
    orders: number;
    policies: number;
  };
}

// Insurance types constants
export const INSURANCE_TYPES = [
  { slug: 'auto', name: 'Auto', icon: 'Car' },
  { slug: 'vida', name: 'Vida', icon: 'Heart' },
  { slug: 'salud', name: 'Salud', icon: 'Shield' },
  { slug: 'viaje', name: 'Viaje', icon: 'Plane' },
  { slug: 'accidentes', name: 'Accidentes', icon: 'AlertTriangle' }
] as const;

export const COUNTRIES = [
  { code: 'MX', name: 'México', currency: 'MXN', currencySymbol: '$' },
  { code: 'AR', name: 'Argentina', currency: 'ARS', currencySymbol: '$' },
  { code: 'CL', name: 'Chile', currency: 'CLP', currencySymbol: '$' },
  { code: 'PE', name: 'Perú', currency: 'PEN', currencySymbol: 'S/' }
] as const;