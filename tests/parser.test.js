/**
 * AIML Parser SDK v2.0.0 - Test Suite
 *
 * Comprehensive tests for the AIML Parser SDK functionality.
 */

const AIMLParser = require('../src/index.js');

describe('AIML Parser SDK v2.0.0', () => {
  let parser;

  beforeEach(() => {
    parser = new AIMLParser();
  });

  describe('Constructor and Configuration', () => {
    test('should create parser with default options', () => {
      const parser = new AIMLParser();
      expect(parser.config.debug).toBe(false);
      expect(parser.config.strict).toBe(false);
      expect(parser.config.version).toBe('2.0.0');
    });

    test('should create parser with custom options', () => {
      const parser = new AIMLParser({
        debug: true,
        strict: true,
        version: '2.0.0'
      });
      expect(parser.config.debug).toBe(true);
      expect(parser.config.strict).toBe(true);
      expect(parser.config.version).toBe('2.0.0');
    });
  });

  describe('Static Methods', () => {
    test('should return correct version', () => {
      expect(AIMLParser.getVersion()).toBe('2.0.0');
    });

    test('should return all entity types', () => {
      const types = AIMLParser.getEntityTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBe(31); // Total number of entity types
      expect(types).toContain('restaurant');
      expect(types).toContain('marketplace');
      expect(types).toContain('hotel');
    });

    test('should return all entity categories', () => {
      const categories = AIMLParser.getEntityCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toEqual([
        'organization',
        'product_offering',
        'service',
        'creative_work',
        'community',
        'financial_product'
      ]);
    });

    test('should return all modules', () => {
      const modules = AIMLParser.getModules();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBe(14);
      expect(modules).toContain('auth');
      expect(modules).toContain('payments');
      expect(modules).toContain('multilingual');
    });

    test('should return all contexts', () => {
      const contexts = AIMLParser.getContexts();
      expect(Array.isArray(contexts)).toBe(true);
      expect(contexts).toEqual([
        'cultural_context',
        'geographical_context',
        'regulatory_context'
      ]);
    });

    test('should validate config', () => {
      expect(AIMLParser.validateConfig({})).toBe(true);
      expect(AIMLParser.validateConfig({ debug: true })).toBe(true);
      expect(AIMLParser.validateConfig(null)).toBe(false);
      expect(AIMLParser.validateConfig('string')).toBe(false);
    });
  });

  describe('Factory Methods', () => {
    test('should create production parser', () => {
      const prodParser = AIMLParser.createProduction();
      expect(prodParser.config.debug).toBe(false);
      expect(prodParser.config.strict).toBe(true);
    });

    test('should create development parser', () => {
      const devParser = AIMLParser.createDevelopment();
      expect(devParser.config.debug).toBe(true);
      expect(devParser.config.strict).toBe(false);
    });
  });

  describe('Valid Schema Validation', () => {
    const validRestaurantSchema = {
      "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
      "@type": "Restaurant",
      "entityType": "restaurant",
      "entityCategory": "organization",
      "subcategory": "hospitality",
      "name": {
        "en": "The Garden Bistro"
      },
      "description": {
        "en": "A delightful garden restaurant featuring farm-to-table cuisine"
      }
    };

    test('should validate correct restaurant schema', () => {
      const result = parser.validate(validRestaurantSchema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.score).toBeGreaterThan(0);
    });

    test('should extract entity info correctly', () => {
      const result = parser.validate(validRestaurantSchema);
      expect(result.entityInfo).toBeDefined();
      expect(result.entityInfo.entityType).toBe('restaurant');
      expect(result.entityInfo.entityCategory).toBe('organization');
      expect(result.entityInfo.subcategory).toBe('hospitality');
      expect(result.entityInfo.baseSchema).toBe('organization');
    });

    test('should calculate performance metrics', () => {
      const result = parser.validate(validRestaurantSchema);
      expect(result.performance).toBeDefined();
      expect(result.performance.schemaSize).toBeGreaterThan(0);
      expect(['low', 'medium', 'high']).toContain(result.performance.complexity);
      expect(result.performance.moduleCount).toBe(0);
    });

    test('should calculate completeness score', () => {
      const result = parser.validate(validRestaurantSchema);
      expect(result.completeness).toBeGreaterThan(0);
      expect(result.completeness).toBeLessThanOrEqual(100);
    });
  });

  describe('Advanced Schema with Modules', () => {
    const advancedSchema = {
      "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
      "@id": "https://example.com/marketplace",
      "@type": "Marketplace",
      "schemaVersion": "2.0.0",
      "entityType": "marketplace",
      "entityCategory": "product_offering",
      "subcategory": "ecommerce_platform",
      "name": {
        "en": "TechBazaar"
      },
      "description": {
        "en": "Global technology marketplace connecting vendors and buyers worldwide"
      },
      "url": "https://techbazaar.com",
      "shortDescription": "Global technology marketplace",
      "modules": {
        "payments": {
          "version": "2.0.0",
          "enabled": true
        },
        "search": {
          "version": "2.0.0",
          "enabled": true
        }
      },
      "semanticProperties": {
        "subjectiveQualities": {
          "userExperience": {
            "rating": 0.9,
            "description": "Excellent user experience"
          }
        },
        "intentAlignment": {
          "purchase": {
            "alignment": 0.95
          }
        }
      }
    };

    test('should validate advanced schema', () => {
      const result = parser.validate(advancedSchema);
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThan(80); // Should have high score
    });

    test('should detect semantic properties', () => {
      const result = parser.validate(advancedSchema);
      expect(result.entityInfo.hasSemanticProperties).toBe(true);
    });

    test('should count modules correctly', () => {
      const result = parser.validate(advancedSchema);
      expect(result.performance.moduleCount).toBe(2);
      expect(result.entityInfo.modules).toEqual(['payments', 'search']);
    });
  });

  describe('Invalid Schema Validation', () => {
    test('should handle invalid JSON', () => {
      const result = parser.validate('{"invalid": json}');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('JSON');
    });

    test('should detect missing required fields', () => {
      const invalidSchema = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld"
        // Missing required fields
      };

      const result = parser.validate(invalidSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      const requiredFields = ['entityType', 'entityCategory', 'name', 'description'];
      requiredFields.forEach(field => {
        expect(result.errors.some(e => e.field === field)).toBe(true);
      });
    });

    test('should detect invalid context', () => {
      const invalidSchema = {
        "@context": "https://wrong-context.com",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": { "en": "Test" },
        "description": { "en": "Test description" }
      };

      const result = parser.validate(invalidSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === '@context')).toBe(true);
    });

    test('should detect invalid entity category', () => {
      const invalidSchema = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "invalid_category",
        "name": { "en": "Test" },
        "description": { "en": "Test description" }
      };

      const result = parser.validate(invalidSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'entityCategory')).toBe(true);
    });

    test('should detect mismatched entity type and category', () => {
      const invalidSchema = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "service", // Should be organization
        "name": { "en": "Test" },
        "description": { "en": "Test description" }
      };

      const result = parser.validate(invalidSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'entityType')).toBe(true);
    });
  });

  describe('Semantic Properties Validation', () => {
    test('should validate semantic property ratings', () => {
      const invalidSchema = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": { "en": "Test" },
        "description": { "en": "Test description" },
        "semanticProperties": {
          "subjectiveQualities": {
            "userExperience": {
              "rating": 1.5 // Invalid: should be 0-1
            }
          }
        }
      };

      const result = parser.validate(invalidSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'semanticProperties')).toBe(true);
    });

    test('should validate intent alignment values', () => {
      const invalidSchema = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": { "en": "Test" },
        "description": { "en": "Test description" },
        "semanticProperties": {
          "intentAlignment": {
            "purchase": {
              "alignment": -0.5 // Invalid: should be 0-1
            }
          }
        }
      };

      const result = parser.validate(invalidSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'semanticProperties')).toBe(true);
    });
  });

  describe('Convenience Methods', () => {
    const validSchema = {
      "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
      "entityType": "restaurant",
      "entityCategory": "organization",
      "name": { "en": "Test" },
      "description": { "en": "Test description" }
    };

    test('should provide quick validation', () => {
      expect(parser.isValid(validSchema)).toBe(true);
      expect(parser.isValid({})).toBe(false);
    });

    test('should extract entity info', () => {
      const info = parser.getEntityInfo(validSchema);
      expect(info).toBeDefined();
      expect(info.entityType).toBe('restaurant');
      expect(info.entityCategory).toBe('organization');
    });

    test('should return null for invalid entity info', () => {
      const info = parser.getEntityInfo({});
      expect(info).toBeNull();
    });
  });

  describe('Static Validation', () => {
    const validSchema = {
      "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
      "entityType": "restaurant",
      "entityCategory": "organization",
      "name": { "en": "Test" },
      "description": { "en": "Test description" }
    };

    test('should provide static validation method', () => {
      const result = AIMLParser.validate(validSchema);
      expect(result.isValid).toBe(true);
    });

    test('should accept options in static method', () => {
      const result = AIMLParser.validate(validSchema, { debug: true });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Module Validation', () => {
    test('should warn about non-standard modules', () => {
      const schemaWithCustomModule = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": { "en": "Test" },
        "description": { "en": "Test description" },
        "modules": {
          "custom_module": {
            "enabled": true
          }
        }
      };

      const result = parser.validate(schemaWithCustomModule);
      expect(result.warnings.some(w => w.field === 'modules')).toBe(true);
    });

    test('should suggest module improvements', () => {
      const schemaWithIncompleteModule = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": { "en": "Test" },
        "description": { "en": "Test description" },
        "modules": {
          "payments": {
            // Missing version and enabled fields
          }
        }
      };

      const result = parser.validate(schemaWithIncompleteModule);
      expect(result.warnings.length + result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Best Practices Validation', () => {
    test('should validate URL format', () => {
      const schemaWithInvalidURL = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": { "en": "Test" },
        "description": { "en": "Test description" },
        "url": "not-a-valid-url"
      };

      const result = parser.validate(schemaWithInvalidURL);
      expect(result.warnings.some(w => w.field === 'url')).toBe(true);
    });

    test('should suggest longer descriptions', () => {
      const schemaWithShortDescription = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": { "en": "Test" },
        "description": { "en": "Short" }
      };

      const result = parser.validate(schemaWithShortDescription);
      expect(result.suggestions.some(s => s.field === 'description')).toBe(true);
    });
  });

  describe('Language Code Validation', () => {
    test('should validate ISO language codes', () => {
      const schemaWithInvalidLangCode = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": {
          "en": "Test",
          "invalid-lang": "Test"
        },
        "description": { "en": "Test description" }
      };

      const result = parser.validate(schemaWithInvalidLangCode);
      expect(result.warnings.some(w => w.field === 'name')).toBe(true);
    });

    test('should recommend English language', () => {
      const schemaWithoutEnglish = {
        "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
        "entityType": "restaurant",
        "entityCategory": "organization",
        "name": {
          "es": "Restaurante"
        },
        "description": { "es": "Descripción del restaurante" }
      };

      const result = parser.validate(schemaWithoutEnglish);
      expect(result.warnings.some(w => w.field === 'name' || w.field === 'description')).toBe(true);
    });
  });
});
