import { type AIMLEntity, AIMLModule } from './index';

export interface RestaurantEntity extends AIMLEntity {
  entityType: 'restaurant';
  cuisine?: string[];
  priceRange?: string;
  address?: AddressFormat;
  contactInfo?: ContactInfo;
  operatingHours?: OperatingHours;
  menu?: MenuItem[];
  ratings?: RatingInfo;
}

export interface HotelEntity extends AIMLEntity {
  entityType: 'hotel';
  starRating?: number;
  amenities?: string[];
  address?: AddressFormat;
  contactInfo?: ContactInfo;
  rooms?: RoomType[];
  policies?: HotelPolicies;
}

export interface EcommerceEntity extends AIMLEntity {
  entityType: 'ecommerce_store';
  products?: ProductInfo[];
  categories?: CategoryInfo[];
  shippingOptions?: ShippingOption[];
  paymentMethods?: string[];
  policies?: CommercePolicies;
}

export interface OrganizationEntity extends AIMLEntity {
  entityType: 'organization';
  organizationType?: string;
  industry?: string;
  foundedYear?: number;
  employees?: number;
  address?: AddressFormat;
  contactInfo?: ContactInfo;
}

export interface ProductOfferingEntity extends AIMLEntity {
  entityCategory: 'product_offering';
  subcategory?: 'physical_product' | 'digital_product' | 'content_product' | 'service_offering';
  brand?: string;
  manufacturer?: string;
  pricing?: PriceFormat;
  availability?: AvailabilityInfo;
}

// Supporting interfaces
export interface AddressFormat {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface ContactInfo {
  telephone?: string;
  email?: string;
  website?: string;
  socialMedia?: Record<string, string>;
}

export interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: number;
  category?: string;
  dietary?: string[];
}

export interface RatingInfo {
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export interface Review {
  rating: number;
  comment?: string;
  author?: string;
  date?: string;
}

export interface RoomType {
  name: string;
  description?: string;
  capacity?: number;
  amenities?: string[];
  pricing?: PriceFormat;
}

export interface HotelPolicies {
  checkIn?: string;
  checkOut?: string;
  cancellation?: string;
  petPolicy?: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description?: string;
  parentCategory?: string;
}

export interface ShippingOption {
  name: string;
  cost?: number;
  estimatedDays?: number;
}

export interface CommercePolicies {
  returns?: string;
  shipping?: string;
  privacy?: string;
  terms?: string;
}

export interface PriceFormat {
  amount: number;
  currency: string;
  priceType?: 'fixed' | 'starting_from' | 'range' | 'variable';
}

export interface AvailabilityInfo {
  inStock?: boolean;
  quantity?: number;
  availableDate?: string;
}
