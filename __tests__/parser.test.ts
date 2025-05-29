import { AIMLParser } from '../src/parser';
import { mockSchemaFetch, mockSchemaFetchError } from './setup';

describe('AIMLParser', () => {
  let parser: AIMLParser;

  beforeEach(() => {
    parser = new AIMLParser();
  });

  describe('constructor', () => {
    it('should create parser with default options', () => {
      const parser = new AIMLParser();
      expect(parser).toBeInstanceOf(AIMLParser);
    });

    it('should create parser with custom options', () => {
      const parser = new AIMLParser({
        entityType: 'restaurant',
        autoDetectType: false,
        processModules: false,
        validateOnParse: false
      });
      expect(parser).toBeInstanceOf(AIMLParser);
    });
  });

  describe('parseEntity', () => {
    it('should parse valid restaurant entity', async () => {
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

      const data = {
        '@context': 'https://schemas.meta-aiml.org',
        '@type': 'Restaurant',
        entityType: 'restaurant',
        name: 'Test Restaurant'
      };

      const result = await parser.parseEntity(data);

      expect(result.entityType).toBe('restaurant');
      expect(result.name).toBe('Test Restaurant');
      expect(result['@context']).toBe('https://schemas.meta-aiml.org');
      expect(result['@type']).toBe('Restaurant');
    });

    it('should auto-detect entity type from @type', async () => {
      const mockSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      };

      mockSchemaFetch(mockSchema);

      const data = {
        '@type': 'Restaurant',
        name: 'Test Restaurant'
      };

      const result = await parser.parseEntity(data);

      expect(result.entityType).toBe('restaurant');
      expect(result['@type']).toBe('Restaurant');
    });

    it('should throw error for invalid input', async () => {
      await expect(parser.parseEntity(null))
        .rejects
        .toThrow('Invalid input data: must be an object');

      await expect(parser.parseEntity('string'))
        .rejects
        .toThrow('Invalid input data: must be an object');
    });

    it('should throw error when entity type cannot be detected', async () => {
      const data = {
        name: 'Test Entity'
      };

      await expect(parser.parseEntity(data))
        .rejects
        .toThrow('Could not detect entity type');
    });

    it('should generate entity ID if not provided', async () => {
      const mockSchema = { type: 'object', properties: {} };
      mockSchemaFetch(mockSchema);

      const data = {
        '@type': 'Restaurant',
        entityType: 'restaurant',
        name: 'Test Restaurant'
      };

      const result = await parser.parseEntity(data);

      expect(result['@id']).toBeDefined();
      expect(result['@id']).toMatch(/^urn:aiml:restaurant:/);
    });
  });

  describe('extractModules', () => {
    it('should extract modules from entity', () => {
      const entity = {
        '@context': 'https://schemas.meta-aiml.org',
        '@id': 'test',
        '@type': 'Restaurant',
        entityType: 'restaurant',
        name: 'Test Restaurant',
        modules: [
          {
            moduleType: 'auth',
            version: '1.0.0',
            required: true,
            properties: {}
          },
          {
            moduleType: 'payments',
            version: '1.0.0',
            required: false,
            properties: {}
          }
        ]
      };

      const modules = parser.extractModules(entity);

      expect(modules).toHaveLength(2);
      expect(modules[0].moduleType).toBe('auth');
      expect(modules[1].moduleType).toBe('payments');
    });

    it('should return empty array if no modules', () => {
      const entity = {
        '@context': 'https://schemas.meta-aiml.org',
        '@id': 'test',
        '@type': 'Restaurant',
        entityType: 'restaurant',
        name: 'Test Restaurant'
      };

      const modules = parser.extractModules(entity);

      expect(modules).toEqual([]);
    });
  });

  describe('generateFormConfig', () => {
    it('should generate form config from schema', async () => {
      const mockSchema = {
        title: 'Restaurant Schema',
        description: 'Schema for restaurant entities',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Restaurant Name',
            description: 'The name of the restaurant'
          },
          cuisine: {
            type: 'array',
            title: 'Cuisine Types',
            items: { type: 'string' }
          }
        }
      };

      mockSchemaFetch(mockSchema);

      const config = await parser.generateFormConfig('restaurant');

      expect(config.title).toBe('Restaurant Schema');
      expect(config.description).toBe('Schema for restaurant entities');
      expect(config.fields).toHaveLength(2);
      expect(config.fields[0].name).toBe('name');
      expect(config.fields[0].type).toBe('text');
      expect(config.fields[1].name).toBe('cuisine');
      expect(config.fields[1].type).toBe('array');
    });
  });

  describe('browser environment', () => {
    it('should throw error when generateForm is called in non-browser environment', () => {
      expect(() => {
        parser.generateForm('#test');
      }).toThrow('generateForm can only be used in browser environment');
    });
  });

  describe('validation integration', () => {
    it('should validate entity during parsing when enabled', async () => {
      const parser = new AIMLParser({ validateOnParse: true });

      const mockSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      };

      mockSchemaFetch(mockSchema);

      const data = {
        '@type': 'Restaurant',
        entityType: 'restaurant'
        // Missing required 'name' field
      };

      await expect(parser.parseEntity(data))
        .rejects
        .toThrow('Validation failed');
    });

    it('should skip validation when disabled', async () => {
      const parser = new AIMLParser({ validateOnParse: false });

      const data = {
        '@type': 'Restaurant',
        entityType: 'restaurant'
        // Missing required fields
      };

      const result = await parser.parseEntity(data);

      expect(result.entityType).toBe('restaurant');
    });
  });
});
