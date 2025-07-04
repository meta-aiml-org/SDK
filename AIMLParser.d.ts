/**
 * AIML Parser SDK v2.0.1 - Official TypeScript Definitions
 *
 * Production-ready schema validation for Meta-AIML.org entity schemas.
 * Supports all 31 entity types across 6 categories with enhanced error handling,
 * universal browser compatibility, and complete API implementation.
 * Based on enhanced-aiml-validator.ts with all validation rules from source truth files.
 *
 * NEW in v2.0.1:
 * - Enhanced error handling (graceful null/undefined/empty input)
 * - Universal browser compatibility (UMD wrapper)
 * - Complete API implementation (getRequiredModules method)
 * - Zero exceptions for any input scenario
 *
 * @version 2.0.1
 * @author META-AIML.ORG - IURII IURIEV
 * @repository https://github.com/meta-aiml-org/SDK
 * @npm https://www.npmjs.com/package/@meta-aiml/parser
 * @date 2025-07-03
 */

/**
 * Validation error details with enhanced categorization
 */
export interface AIMLValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  category: 'structure' | 'schema' | 'semantic' | 'performance' | 'best_practice';
  suggestion?: string;
  documentation?: string;
  line?: number;
  column?: number;
}

/**
 * Comprehensive entity information extracted from schema
 */
export interface AIMLEntityInfo {
  entityType: string;
  entityCategory: string;
  subcategory?: string;
  baseSchema: string;
  modules: string[];
  contexts: string[];
  hasEntityCapabilities: boolean;
  hasSiteCapabilities: boolean;
}

/**
 * Complete validation result with scoring and metrics
 */
export interface AIMLValidationResult {
  isValid: boolean;
  errors: AIMLValidationError[];
  warnings: AIMLValidationError[];
  suggestions: AIMLValidationError[];
  entityInfo?: AIMLEntityInfo;
  score: number;
  completeness: number;
  performance: {
    schemaSize: number;
    complexity: 'low' | 'medium' | 'high';
    moduleCount: number;
  };
}

/**
 * AIML Schema structure with v2.0.1 fields
 */
export interface AIMLSchema {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  schemaVersion?: string;
  entityType?: string;
  entityCategory?: string;
  subcategory?: string;
  name?: string | { [lang: string]: string };
  description?: string | { [lang: string]: string };
  url?: string;
  shortDescription?: string;
  properties?: Record<string, any>;
  modules?: Record<string, any>;
  entityCapabilities?: {
    functionalFeatures?: Record<string, boolean>;
    contentTypes?: string[];
    businessModel?: string;
    paymentMethods?: string[];
  };
  siteCapabilities?: {
    availableActions?: string[];
    interactionMethods?: string[];
    contentAccess?: string[];
    supportedDevices?: string[];
    languages?: string[];
    realTimeFeatures?: string[];
  };
  appliedContexts?: string[];
  foundingDate?: string;
  serviceType?: string;
  [key: string]: any;
}

/**
 * Parser configuration options
 */
export interface AIMLParserOptions {
  debug?: boolean;
  strict?: boolean;
  version?: string;
}

/**
 * Enhanced AIML Parser SDK v2.0.1
 *
 * Complete validation engine based on enhanced-aiml-validator.ts
 * Implements all validation rules from source truth files:
 * - required_fields_v2.0.1.md
 * - META_AIML_ARCHITECTURE_COMPLETE_v2.0.1.md
 * - public/examples/ecommerce-marketplace.json
 */
export declare class AIMLParser {
  /**
   * Initialize AIML Parser with configuration options
   */
  constructor(options?: AIMLParserOptions);

  /**
   * Validate AIML schema with comprehensive analysis
   *
   * Implements validation pipeline from enhanced-aiml-validator.ts:
   * - Critical required fields validation (errors if missing)
   * - Context and versioning validation
   * - Entity structure and hierarchy validation
   * - Module validation with required modules per entity type
   * - NEW v2.0.1: entityCapabilities and siteCapabilities validation
   * - Multilingual format validation
   * - Best practices and performance suggestions
   *
   * @param data Schema to validate (JSON string or object)
   * @returns Complete validation result with detailed feedback
   */
  validate(data: string | AIMLSchema): AIMLValidationResult;

  /**
   * Quick validation check without detailed analysis
   */
  isValid(data: string | AIMLSchema): boolean;

  /**
   * Extract detailed entity information from schema
   */
  getEntityInfo(data: string | AIMLSchema): AIMLEntityInfo | null;

  /**
   * Static validation method for convenience
   */
  static validate(data: string | AIMLSchema, options?: AIMLParserOptions): AIMLValidationResult;

  /**
   * Create production-ready parser instance
   */
  static createProduction(): AIMLParser;

  /**
   * Create development parser instance with debug enabled
   */
  static createDevelopment(): AIMLParser;

  /**
   * Get current AIML version
   */
  static getVersion(): string;

  /**
   * Get all supported entity types (31 types)
   */
  static getEntityTypes(): string[];

  /**
   * Get all entity categories (6 categories)
   */
  static getEntityCategories(): string[];

  /**
   * Get all available modules (14 modules)
   */
  static getModules(): string[];

  /**
   * Get all subcategories
   */
  static getSubcategories(): string[];

  /**
   * Get available contexts for appliedContexts field
   */
  static getAvailableContexts(): string[];

  /**
   * Get required modules for specific entity type
   */
  static getRequiredModules(entityType: string): string[];

  /**
   * Validate parser configuration
   */
  static validateConfig(options: any): boolean;
}

/**
 * AIML v2.0.1 Constants
 */
export declare const AIML_CONTEXT: "https://schemas.meta-aiml.org/v2.0.1/context.jsonld";
export declare const AIML_VERSION: "2.0.1";

/**
 * Entity categories from enhanced-aiml-validator.ts
 */
export declare const BASE_CATEGORIES: readonly [
  "organization",
  "product_offering",
  "service",
  "creative_work",
  "community",
  "financial_product"
];

/**
 * Entity types mapping by category
 */
export declare const ENTITY_TYPES: {
  readonly organization: readonly ["clinic", "education_platform", "fitness_platform", "hotel", "restaurant", "store"];
  readonly product_offering: readonly ["ecommerce_store", "marketplace", "product", "software_product"];
  readonly service: readonly ["business_services", "generative_ai_platform", "real_estate_platform", "ridesharing_service", "task_management_app", "telemedicine_platform", "virtual_event_platform", "web_app", "website_services"];
  readonly creative_work: readonly ["blog", "event", "file_hosting", "gaming_platform", "news", "personal_website", "photo_hosting", "streaming_platform", "video_hosting"];
  readonly community: readonly ["dating_platform", "social_network"];
  readonly financial_product: readonly ["online_banking"];
};

/**
 * Available modules from enhanced-aiml-validator.ts
 */
export declare const AVAILABLE_MODULES: readonly [
  "auth", "compliance", "location", "logistics", "multilingual",
  "notification", "payments", "recommendations", "search", "security",
  "streaming", "subscription", "user-management", "warranty"
];

/**
 * Required modules by entity type
 */
export declare const REQUIRED_MODULES: {
  readonly [entityType: string]: readonly string[];
};

/**
 * Available contexts for appliedContexts field
 */
export declare const AVAILABLE_CONTEXTS: readonly [
  "cultural_context", "geographical_context", "regulatory_context"
];

export default AIMLParser;
