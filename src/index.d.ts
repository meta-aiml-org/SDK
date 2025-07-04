/**
 * AIML Parser SDK v2.0.1 - TypeScript Definitions
 *
 * @version 2.0.1
 * @author META-AIML.ORG - IURII IURIEV
 */

declare module '@meta-aiml/parser' {
  /**
   * Validation error severity levels
   */
  export type ValidationSeverity = 'error' | 'warning' | 'info';

  /**
   * Validation error categories
   */
  export type ValidationCategory = 'structure' | 'schema' | 'semantic' | 'performance' | 'best_practice';

  /**
   * Performance complexity levels
   */
  export type PerformanceComplexity = 'low' | 'medium' | 'high';

  /**
   * AIML entity categories
   */
  export type EntityCategory = 'organization' | 'product_offering' | 'service' | 'creative_work' | 'community' | 'financial_product';

  /**
   * Validation error object
   */
  export interface AIMLValidationError {
    field: string;
    message: string;
    severity: ValidationSeverity;
    category: ValidationCategory;
    suggestion?: string;
    documentation?: string;
    line?: number;
    column?: number;
  }

  /**
   * Entity information extracted from schema
   */
  export interface AIMLEntityInfo {
    entityType: string;
    entityCategory: EntityCategory;
    subcategory?: string;
    baseSchema: string;
    modules: string[];
    hasEntityCapabilities: boolean;
    hasSiteCapabilities: boolean;
  }

  /**
   * Performance metrics for schema
   */
  export interface AIMLPerformanceMetrics {
    schemaSize: number;
    complexity: PerformanceComplexity;
    moduleCount: number;
  }

  /**
   * Complete validation result
   */
  export interface AIMLValidationResult {
    isValid: boolean;
    errors: AIMLValidationError[];
    warnings: AIMLValidationError[];
    suggestions: AIMLValidationError[];
    entityInfo?: AIMLEntityInfo;
    score: number;
    completeness: number;
    performance: AIMLPerformanceMetrics;
  }

  /**
   * AIML schema object structure
   */
  export interface AIMLSchema {
    '@context'?: string;
    '@id'?: string;
    '@type'?: string;
    schemaVersion?: string;
    entityType?: string;
    entityCategory?: EntityCategory;
    subcategory?: string;
    name?: string | Record<string, string>;
    description?: string | Record<string, string>;
    url?: string;
    shortDescription?: string;
    properties?: Record<string, any>;
    modules?: Record<string, any>;
    entityCapabilities?: {
      functionalFeatures?: Record<string, boolean>;
      contentTypes?: string[];
      businessModel?: string;
      paymentMethods?: string[];
      [key: string]: any;
    };
    siteCapabilities?: {
      availableActions?: string[];
      interactionMethods?: string[];
      contentAccess?: string[];
      supportedDevices?: string[];
      languages?: string[];
      realTimeFeatures?: string[];
      [key: string]: any;
    };
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
   * Main AIML Parser class
   */
  export class AIMLParser {
    /**
     * Create new AIML Parser instance
     */
    constructor(options?: AIMLParserOptions);

    /**
     * Validate AIML schema
     */
    validate(data: string | AIMLSchema): AIMLValidationResult;

    /**
     * Quick validation check
     */
    isValid(data: string | AIMLSchema): boolean;

    /**
     * Get entity information
     */
    getEntityInfo(data: string | AIMLSchema): AIMLEntityInfo | null;

    /**
     * Static validation method
     */
    static validate(data: string | AIMLSchema, options?: AIMLParserOptions): AIMLValidationResult;

    /**
     * Create production parser instance
     */
    static createProduction(): AIMLParser;

    /**
     * Create development parser instance
     */
    static createDevelopment(): AIMLParser;

    /**
     * Get AIML version
     */
    static getVersion(): string;

    /**
     * Get all available entity types
     */
    static getEntityTypes(): string[];

    /**
     * Get all entity categories
     */
    static getEntityCategories(): EntityCategory[];

    /**
     * Get all available modules
     */
    static getModules(): string[];



    /**
     * Get all available subcategories
     */
    static getSubcategories(): string[];

    /**
     * Get required modules for specific entity type
     */
    static getRequiredModules(entityType: string): string[];

    /**
     * Validate configuration object
     */
    static validateConfig(options: any): boolean;
  }

  /**
   * Default export
   */
  export default AIMLParser;
}
