export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  entityType?: string;
  modules?: string[];
}

export interface ValidationError {
  path: string;
  message: string;
  value?: any;
  keyword?: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  suggestion?: string;
}

export interface AIMLEntity {
  '@context': string;
  '@id': string;
  '@type': string;
  entityType: string;
  entityCategory?: string;
  name: string;
  description?: string;
  modules?: AIMLModule[];
  metadata?: EntityMetadata;
  [key: string]: any;
}

export interface AIMLModule {
  moduleType: string;
  version: string;
  required?: boolean;
  properties?: Record<string, any>;
  $ref?: string;
}

export interface EntityMetadata {
  created?: string;
  updated?: string;
  version?: string;
  lastValidated?: string;
}

export type SchemaType =
  | 'restaurant'
  | 'hotel'
  | 'ecommerce_store'
  | 'organization'
  | 'product'
  | 'service'
  | 'blog'
  | 'clinic'
  | 'dating_platform'
  | 'education_platform'
  | 'gaming_platform'
  | 'marketplace'
  | 'news'
  | 'social_network'
  | 'streaming_platform';

export interface ValidatorOptions {
  schemaBaseUrl?: string;
  strictMode?: boolean;
  validateModules?: boolean;
  allowAdditionalProperties?: boolean;
}

export interface ParserOptions {
  entityType?: SchemaType;
  autoDetectType?: boolean;
  processModules?: boolean;
  validateOnParse?: boolean;
}

export interface SchemaReference {
  $ref: string;
  version?: string;
  cached?: boolean;
}

export interface ModuleConfiguration {
  moduleType: string;
  version: string;
  config: Record<string, any>;
  dependencies?: string[];
}
