import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { type ValidationResult, type ValidatorOptions, AIMLEntity, type SchemaType } from './types';

export class AIMLValidator {
  private ajv: Ajv;
  private schemaCache: Map<string, any> = new Map();
  private options: ValidatorOptions;

  constructor(options: ValidatorOptions = {}) {
    this.options = {
      schemaBaseUrl: 'https://schemas.meta-aiml.org',
      strictMode: true,
      validateModules: true,
      allowAdditionalProperties: false,
      ...options
    };

    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: this.options.strictMode,
      loadSchema: this.loadSchema.bind(this)
    });

    addFormats(this.ajv);
  }

  /**
   * Validate an AIML entity against its schema
   */
  async validate(entity: any): Promise<ValidationResult> {
    try {
      const entityType = this.detectEntityType(entity);

      if (!entityType) {
        return {
          valid: false,
          errors: [{
            path: '',
            message: 'Could not detect entity type. Ensure entityType property is set.'
          }],
          warnings: []
        };
      }

      return await this.validateEntity(entity, entityType);
    } catch (error) {
      return {
        valid: false,
        errors: [{
          path: '',
          message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        warnings: []
      };
    }
  }

  /**
   * Validate an entity against a specific schema type
   */
  async validateEntity(entity: any, schemaType: SchemaType): Promise<ValidationResult> {
    try {
      const schema = await this.getSchema(schemaType);
      const validate = this.ajv.compile(schema);
      const valid = validate(entity);

      const result: ValidationResult = {
        valid,
        errors: [],
        warnings: [],
        entityType: schemaType
      };

      if (!valid && validate.errors) {
        result.errors = validate.errors.map(error => ({
          path: error.instancePath || error.schemaPath || '',
          message: error.message || 'Validation error',
          value: error.data,
          keyword: error.keyword
        }));
      }

      // Validate modules if enabled
      if (this.options.validateModules && entity.modules) {
        const moduleValidation = await this.validateModules(entity.modules);
        result.warnings.push(...moduleValidation.warnings);
        if (!moduleValidation.valid) {
          result.errors.push(...moduleValidation.errors);
          result.valid = false;
        }
      }

      return result;
    } catch (error) {
      return {
        valid: false,
        errors: [{
          path: '',
          message: `Schema validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        warnings: []
      };
    }
  }

  /**
   * Validate modules configuration
   */
  private async validateModules(modules: any[]): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    for (const module of modules) {
      if (module.$ref) {
        try {
          const moduleSchema = await this.loadSchemaFromRef(module.$ref);
          const validate = this.ajv.compile(moduleSchema);

          if (!validate(module)) {
            result.valid = false;
            if (validate.errors) {
              result.errors.push(...validate.errors.map(error => ({
                path: `modules.${error.instancePath}`,
                message: error.message || 'Module validation error',
                value: error.data,
                keyword: error.keyword
              })));
            }
          }
        } catch (error) {
          result.warnings.push({
            path: 'modules',
            message: `Could not validate module: ${module.$ref}`,
            suggestion: 'Check if module reference is valid'
          });
        }
      }
    }

    return result;
  }

  /**
   * Detect entity type from entity data
   */
  private detectEntityType(entity: any): SchemaType | null {
    if (entity.entityType) {
      return entity.entityType as SchemaType;
    }

    // Try to detect from @type
    if (entity['@type']) {
      const type = entity['@type'].toLowerCase();
      const typeMapping: Record<string, SchemaType> = {
        'restaurant': 'restaurant',
        'hotel': 'hotel',
        'lodgingbusiness': 'hotel',
        'store': 'ecommerce_store',
        'onlinestore': 'ecommerce_store',
        'organization': 'organization',
        'product': 'product'
      };

      return typeMapping[type] || null;
    }

    return null;
  }

  /**
   * Get schema for entity type
   */
  private async getSchema(schemaType: SchemaType): Promise<any> {
    const cacheKey = `entity_${schemaType}`;

    if (this.schemaCache.has(cacheKey)) {
      return this.schemaCache.get(cacheKey);
    }

    const schema = await this.loadSchemaFromUrl(`${this.options.schemaBaseUrl}/entity/${schemaType}.json`);
    this.schemaCache.set(cacheKey, schema);

    return schema;
  }

  /**
   * Load schema from URL
   */
  private async loadSchema(uri: string): Promise<any> {
    return this.loadSchemaFromUrl(uri);
  }

  /**
   * Load schema from full URL
   */
  private async loadSchemaFromUrl(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load schema: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to load schema from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load schema from $ref
   */
  private async loadSchemaFromRef(ref: string): Promise<any> {
    const url = ref.startsWith('/')
      ? `${this.options.schemaBaseUrl}${ref}`
      : ref;

    return this.loadSchemaFromUrl(url);
  }

  /**
   * Clear schema cache
   */
  clearCache(): void {
    this.schemaCache.clear();
  }

  /**
   * Get cached schema count
   */
  getCacheSize(): number {
    return this.schemaCache.size;
  }
}
