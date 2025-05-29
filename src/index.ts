export { AIMLValidator } from './validator';
export { AIMLParser } from './parser';
export { SchemaLoader } from './schema-loader';
export { ModuleProcessor } from './module-processor';

// Type exports
export type {
  ValidationResult,
  AIMLEntity,
  AIMLModule,
  SchemaType,
  ValidatorOptions,
  ParserOptions
} from './types';

// Re-export common schemas
export type {
  RestaurantEntity,
  HotelEntity,
  EcommerceEntity,
  OrganizationEntity,
  ProductOfferingEntity
} from './types/entities';

// Version info
export const VERSION = '1.0.0';
export const SCHEMA_VERSION = '1.0.0';
