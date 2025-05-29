import { AIMLValidator } from '../src/validator';
import { mockSchemaFetch, mockSchemaFetchError } from './setup';

describe('AIMLValidator', () => {
  let validator: AIMLValidator;

  beforeEach(() => {
    validator = new AIMLValidator();
  });

  describe('constructor', () => {
    it('should create validator with default options', () => {
      const validator = new AIMLValidator();
      expect(validator).toBeInstanceOf(AIMLValidator);
    });

    it('should create validator with custom options', () => {
      const validator = new AIMLValidator({
        schemaBaseUrl: 'https://custom.example.com',
        strictMode: false,
        validateModules: false,
        allowAdditionalProperties: true
      });
      expect(validator).toBeInstanceOf(AIMLValidator);
    });
  });

  describe('validate', () => {
    it('should validate correct entity', async () => {
      const mockSchema = {
        type: 'object',
        properties: {
          '@context': { type: 'string' },
          '@type': { type: 'string' },
          entityType: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['@context', '@type', 'entityType', 'name']
      };

      mockSchemaFetch(mockSchema);

      const entity = {
        '@context': 'https://schemas.meta-aiml.org',
        '@type': 'Restaurant',
        entityType: 'restaurant',
        name: 'Test Restaurant'
      };

      const result = await validator.validate(entity);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.entityType).toBe('restaurant');
    });

    it('should detect validation errors', async () => {
      const mockSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      };

      mockSchemaFetch(mockSchema);

      const entity = {
        '@context': 'https://schemas.meta-aiml.org',
        '@type': 'Restaurant',
        entityType: 'restaurant'
        // Missing required 'name' field
      };

      const result = await validator.validate(entity);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('required');
    });

    it('should handle entity without entityType', async () => {
      const entity = {
        '@context': 'https://schemas.meta-aiml.org',
        name: 'Test Entity'
      };

      const result = await validator.validate(entity);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Could not detect entity type');
    });
  });

  describe('validateEntity', () => {
    it('should validate entity against specific schema type', async () => {
      const mockSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          cuisine: { type: 'array' }
        },
        required: ['name']
      };

      mockSchemaFetch(mockSchema);

      const entity = {
        name: 'Test Restaurant',
        cuisine: ['Italian', 'Pizza']
      };

      const result = await validator.validateEntity(entity, 'restaurant');

      expect(result.valid).toBe(true);
      expect(result.entityType).toBe('restaurant');
    });

    it('should handle schema loading errors', async () => {
      mockSchemaFetchError(404, 'Not Found');

      const entity = {
        name: 'Test Entity'
      };

      const result = await validator.validateEntity(entity, 'restaurant');

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Schema validation error');
    });
  });

  describe('module validation', () => {
    it('should validate modules when enabled', async () => {
      const validator = new AIMLValidator({ validateModules: true });

      const mockEntitySchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          modules: { type: 'array' }
        }
      };

      const mockModuleSchema = {
        type: 'object',
        properties: {
          moduleType: { type: 'string' },
          version: { type: 'string' }
        },
        required: ['moduleType', 'version']
      };

      // Mock entity schema fetch
      mockSchemaFetch(mockEntitySchema);
      // Mock module schema fetch
      mockSchemaFetch(mockModuleSchema);

      const entity = {
        name: 'Test Restaurant',
        entityType: 'restaurant',
        modules: [
          {
            '$ref': '/schemas/templates/module/auth.json',
            moduleType: 'auth',
            version: '1.0.0'
          }
        ]
      };

      const result = await validator.validateEntity(entity, 'restaurant');

      expect(result.valid).toBe(true);
    });

    it('should handle module validation errors gracefully', async () => {
      const validator = new AIMLValidator({ validateModules: true });

      const mockEntitySchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          modules: { type: 'array' }
        }
      };

      mockSchemaFetch(mockEntitySchema);
      // Module schema fetch will fail
      mockSchemaFetchError(404);

      const entity = {
        name: 'Test Restaurant',
        entityType: 'restaurant',
        modules: [
          {
            '$ref': '/schemas/templates/module/invalid.json'
          }
        ]
      };

      const result = await validator.validateEntity(entity, 'restaurant');

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0].message).toContain('Could not validate module');
    });
  });

  describe('cache management', () => {
    it('should cache loaded schemas', async () => {
      const mockSchema = {
        type: 'object',
        properties: { name: { type: 'string' } }
      };

      mockSchemaFetch(mockSchema);

      const entity = { name: 'Test', entityType: 'restaurant' };

      // First validation - should fetch schema
      await validator.validateEntity(entity, 'restaurant');

      // Second validation - should use cached schema
      const result = await validator.validateEntity(entity, 'restaurant');

      expect(result.valid).toBe(true);
      expect(validator.getCacheSize()).toBeGreaterThan(0);
    });

    it('should clear cache', async () => {
      const mockSchema = {
        type: 'object',
        properties: { name: { type: 'string' } }
      };

      mockSchemaFetch(mockSchema);

      const entity = { name: 'Test', entityType: 'restaurant' };
      await validator.validateEntity(entity, 'restaurant');

      expect(validator.getCacheSize()).toBeGreaterThan(0);

      validator.clearCache();
      expect(validator.getCacheSize()).toBe(0);
    });
  });

  describe('entity type detection', () => {
    it('should detect type from entityType property', async () => {
      const mockSchema = { type: 'object', properties: {} };
      mockSchemaFetch(mockSchema);

      const entity = {
        entityType: 'hotel',
        name: 'Test Hotel'
      };

      const result = await validator.validate(entity);
      expect(result.entityType).toBe('hotel');
    });

    it('should detect type from @type property', async () => {
      const mockSchema = { type: 'object', properties: {} };
      mockSchemaFetch(mockSchema);

      const entity = {
        '@type': 'LodgingBusiness',
        name: 'Test Hotel'
      };

      const result = await validator.validate(entity);
      expect(result.entityType).toBe('hotel');
    });

    it('should prefer entityType over @type', async () => {
      const mockSchema = { type: 'object', properties: {} };
      mockSchemaFetch(mockSchema);

      const entity = {
        entityType: 'restaurant',
        '@type': 'Hotel',
        name: 'Test Entity'
      };

      const result = await validator.validate(entity);
      expect(result.entityType).toBe('restaurant');
    });
  });
});
