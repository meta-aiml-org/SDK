/**
 * AIML Parser SDK v2.0.0 - Official NPM Package
 *
 * Complete schema validation for Meta-AIML.org entity schemas.
 * Supports all 31 entity types across 6 categories with comprehensive validation.
 *
 * @version 2.0.0
 * @author META-AIML.ORG - IURII IURIEV
 * @repository https://github.com/meta-aiml-org/SDK
 * @npm https://www.npmjs.com/package/@meta-aiml/parser
 * @date 2025-06-15
 */

/**
 * @typedef {Object} AIMLValidationError
 * @property {string} field - Field with error
 * @property {string} message - Error message
 * @property {'error'|'warning'|'info'} severity - Error severity
 * @property {'structure'|'schema'|'semantic'|'performance'|'best_practice'} category - Error category
 * @property {string} [suggestion] - Fix suggestion
 * @property {string} [documentation] - Documentation link
 * @property {number} [line] - Line number
 * @property {number} [column] - Column number
 */

/**
 * @typedef {Object} AIMLEntityInfo
 * @property {string} entityType - Entity type
 * @property {string} entityCategory - Entity category
 * @property {string} [subcategory] - Subcategory
 * @property {string} baseSchema - Base schema
 * @property {string[]} modules - Active modules
 * @property {string[]} contexts - Applied contexts
 * @property {boolean} hasSemanticProperties - Has semantic properties
 * @property {boolean} hasIntentContext - Has intent context
 */

/**
 * @typedef {Object} AIMLValidationResult
 * @property {boolean} isValid - Is schema valid
 * @property {AIMLValidationError[]} errors - Critical errors
 * @property {AIMLValidationError[]} warnings - Warnings
 * @property {AIMLValidationError[]} suggestions - Improvement suggestions
 * @property {AIMLEntityInfo} [entityInfo] - Entity information
 * @property {number} score - Quality score (0-100)
 * @property {number} completeness - Completeness score (0-100)
 * @property {Object} performance - Performance metrics
 * @property {number} performance.schemaSize - Schema size in bytes
 * @property {'low'|'medium'|'high'} performance.complexity - Complexity level
 * @property {number} performance.moduleCount - Number of modules
 */

/**
 * @typedef {Object} AIMLSchema
 * @property {string} [@context] - JSON-LD context
 * @property {string} [@id] - Unique identifier
 * @property {string} [@type] - Entity type
 * @property {string} [schemaVersion] - AIML schema version
 * @property {string} [entityType] - AIML entity type
 * @property {string} [entityCategory] - Top-level category
 * @property {string} [subcategory] - Subcategory
 * @property {string|Object} [name] - Name (string or multilingual)
 * @property {string|Object} [description] - Description (string or multilingual)
 * @property {string} [url] - URL
 * @property {string} [shortDescription] - Short description
 * @property {Object} [properties] - Entity properties
 * @property {Object} [modules] - Enabled modules
 * @property {Object} [semanticProperties] - Semantic properties
 * @property {Object} [intentContext] - Intent context
 * @property {string[]} [appliedContexts] - Applied contexts
 */

// AIML v2.0.0 specifications - Complete and accurate
const AIML_CONTEXT = 'https://schemas.meta-aiml.org/v2.0.0/context.jsonld';
const AIML_VERSION = '2.0.0';

const BASE_CATEGORIES = [
  'organization',
  'product_offering',
  'service',
  'creative_work',
  'community',
  'financial_product'
];

const ENTITY_TYPES = {
  organization: [
    'clinic',
    'education_platform',
    'fitness_platform',
    'hotel',
    'restaurant',
    'store'
  ],
  product_offering: [
    'ecommerce_store',
    'marketplace',
    'product',
    'software_product'
  ],
  service: [
    'business_services',
    'generative_ai_platform',
    'real_estate_platform',
    'ridesharing_service',
    'task_management_app',
    'telemedicine_platform',
    'virtual_event_platform',
    'web_app',
    'website_services'
  ],
  creative_work: [
    'blog',
    'event',
    'file_hosting',
    'gaming_platform',
    'news',
    'personal_website',
    'photo_hosting',
    'streaming_platform',
    'video_hosting'
  ],
  community: ['dating_platform', 'social_network'],
  financial_product: ['online_banking']
};

const SUBCATEGORIES = {
  ecommerce_platform: ['ecommerce_store', 'marketplace', 'store'],
  hospitality: ['hotel', 'restaurant'],
  healthcare_services: ['clinic', 'fitness_platform', 'telemedicine_platform'],
  education_services: ['education_platform'],
  ai_platform: ['generative_ai_platform'],
  professional_services: ['business_services'],
  ridesharing_services: ['ridesharing_service'],
  website_services: ['website_services'],
  property_services: ['real_estate_platform'],
  physical_product: ['product'],
  digital_product: [
    'file_hosting',
    'personal_website',
    'software_product',
    'task_management_app',
    'web_app'
  ],
  media_entertainment: [
    'blog',
    'gaming_platform',
    'news',
    'photo_hosting',
    'streaming_platform',
    'video_hosting'
  ],
  social_platform: ['dating_platform', 'social_network'],
  event_platform: ['event', 'virtual_event_platform'],
  financial_services: ['online_banking']
};

// Enhanced subcategory validation rules
const SUBCATEGORY_VALIDATION_RULES = {
  professional_services: {
    allowedCategories: ['service'],
    description: 'Professional and business services'
  },
  event_platform: {
    allowedCategories: ['creative_work', 'service'],
    description: 'Event organization and management platforms'
  },
  physical_product: {
    allowedCategories: ['product_offering'],
    description: 'Physical goods and products'
  },
  website_services: {
    allowedCategories: ['service'],
    description: 'Website development and maintenance services'
  },
  gaming_platform: {
    allowedCategories: ['creative_work'],
    description: 'Gaming and interactive entertainment platforms'
  }
};

const AVAILABLE_MODULES = [
  'auth',
  'compliance',
  'location',
  'logistics',
  'multilingual',
  'notification',
  'payments',
  'recommendations',
  'search',
  'security',
  'streaming',
  'subscription',
  'user_management',
  'warranty'
];

const AVAILABLE_CONTEXTS = [
  'cultural_context',
  'geographical_context',
  'regulatory_context'
];

/**
 * AIML Parser SDK v2.0.0 - Official Release
 *
 * Comprehensive validation library for AIML entity schemas
 * Supporting all 31 entity types across 6 categories.
 *
 * @class AIMLParser
 */
class AIMLParser {
  /**
   * Initialize AIML Parser
   *
   * @param {Object} [options] - Parser configuration
   * @param {boolean} [options.debug=false] - Enable debug mode
   * @param {boolean} [options.strict=false] - Enable strict validation
   * @param {string} [options.version='2.0.0'] - Target AIML version
   */
  constructor(options = {}) {
    this.config = {
      debug: options.debug || false,
      strict: options.strict || false,
      version: options.version || AIML_VERSION
    };

    // State for validation
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  /**
   * Validate AIML schema
   *
   * @param {string|Object} data - Schema to validate (JSON string or object)
   * @returns {AIMLValidationResult} Validation result
   *
   * @example
   * const parser = new AIMLParser();
   * const result = parser.validate(mySchema);
   * if (result.isValid) {
   *   console.log('Valid!', result.score);
   * } else {
   *   console.log('Errors:', result.errors);
   * }
   */
  validate(data) {
    // Reset state
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];

    let schema;
    try {
      schema = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      this._addError(
        'JSON',
        'Invalid JSON syntax',
        'structure',
        'Please check for missing commas, brackets, or quotes'
      );
      return this._buildResult(false, null);
    }

    // Core validation pipeline
    this._validateRequiredFields(schema);
    this._validateContext(schema);
    this._validateVersioning(schema);
    this._validateEntityStructure(schema);
    this._validateNames(schema);
    this._validateModules(schema);
    this._validateSemanticProperties(schema);
    this._validateBestPractices(schema);

    const entityInfo = this._extractEntityInfo(schema);
    const isValid = this.errors.length === 0;

    return this._buildResult(isValid, entityInfo, schema);
  }

  /**
   * Quick validation without detailed analysis
   * @param {string|Object} data - Schema to validate
   * @returns {boolean} True if valid
   */
  isValid(data) {
    return this.validate(data).isValid;
  }

  /**
   * Get detailed entity information
   * @param {string|Object} data - Schema to analyze
   * @returns {AIMLEntityInfo|null} Entity information
   */
  getEntityInfo(data) {
    const result = this.validate(data);
    return result.entityInfo;
  }

  /**
   * Validate required fields
   * @private
   */
  _validateRequiredFields(schema) {
    const required = [
      '@context',
      'entityType',
      'entityCategory',
      'name',
      'description'
    ];

    required.forEach((field) => {
      if (!schema[field]) {
        this._addError(
          field,
          `Required field '${field}' is missing`,
          'structure',
          `Add the ${field} field to your schema`
        );
      }
    });

    // Check for recommended fields
    const recommended = [
      '@id',
      '@type',
      'schemaVersion',
      'url',
      'shortDescription'
    ];
    recommended.forEach((field) => {
      if (!schema[field]) {
        this._addWarning(
          field,
          `Recommended field '${field}' is missing`,
          'best_practice',
          `Consider adding ${field} for better schema completeness`
        );
      }
    });
  }

  /**
   * Validate @context
   * @private
   */
  _validateContext(schema) {
    if (schema['@context'] && schema['@context'] !== AIML_CONTEXT) {
      this._addError(
        '@context',
        'Invalid @context value',
        'structure',
        `Use "${AIML_CONTEXT}" for AIML v2.0.0 schemas`
      );
    }
  }

  /**
   * Validate versioning
   * @private
   */
  _validateVersioning(schema) {
    if (schema.schemaVersion && schema.schemaVersion !== AIML_VERSION) {
      this._addWarning(
        'schemaVersion',
        `Schema version ${schema.schemaVersion} might not be current`,
        'schema',
        `Consider using version ${AIML_VERSION} for latest features`
      );
    }
  }

  /**
   * Validate entity structure
   * @private
   */
  _validateEntityStructure(schema) {
    // Validate entity category
    if (
      schema.entityCategory &&
      !BASE_CATEGORIES.includes(schema.entityCategory)
    ) {
      this._addError(
        'entityCategory',
        `Invalid entity category: ${schema.entityCategory}`,
        'schema',
        `Use one of: ${BASE_CATEGORIES.join(', ')}`
      );
    }

    // Validate entity type against category
    if (schema.entityType && schema.entityCategory) {
      const validTypes = ENTITY_TYPES[schema.entityCategory] || [];
      if (validTypes.length > 0 && !validTypes.includes(schema.entityType)) {
        this._addError(
          'entityType',
          `Entity type '${schema.entityType}' is not valid for category '${schema.entityCategory}'`,
          'schema',
          `Valid types for ${schema.entityCategory}: ${validTypes.join(', ')}`
        );
      }
    }

    // Validate subcategory
    if (schema.subcategory) {
      const validSubcategories = Object.keys(SUBCATEGORIES);
      if (!validSubcategories.includes(schema.subcategory)) {
        this._addWarning(
          'subcategory',
          `Subcategory '${schema.subcategory}' might not be standard`,
          'schema',
          `Common subcategories: ${validSubcategories.join(', ')}`
        );
      }

      // Validate subcategory against entity category using additional rules
      if (
        schema.entityCategory &&
        SUBCATEGORY_VALIDATION_RULES[schema.subcategory]
      ) {
        const rule = SUBCATEGORY_VALIDATION_RULES[schema.subcategory];
        if (!rule.allowedCategories.includes(schema.entityCategory)) {
          this._addError(
            'subcategory',
            `Subcategory '${schema.subcategory}' is not valid for category '${schema.entityCategory}'`,
            'schema',
            `Valid categories for ${schema.subcategory}: ${rule.allowedCategories.join(', ')}`
          );
        }
      }

      // Validate entity type against subcategory
      if (schema.entityType && SUBCATEGORIES[schema.subcategory]) {
        const validTypesForSubcategory = SUBCATEGORIES[schema.subcategory];
        if (!validTypesForSubcategory.includes(schema.entityType)) {
          this._addError(
            'entityType',
            `Entity type '${schema.entityType}' is not valid for subcategory '${schema.subcategory}'`,
            'schema',
            `Valid types for ${schema.subcategory}: ${validTypesForSubcategory.join(', ')}`
          );
        }
      }
    }
  }

  /**
   * Validate names
   * @private
   */
  _validateNames(schema) {
    // Validate name structure (can be string or multilingual object)
    if (schema.name) {
      if (typeof schema.name === 'object') {
        if (!schema.name.en) {
          this._addWarning(
            'name',
            'English name (en) is recommended in multilingual names',
            'best_practice',
            'Add an "en" field for better international compatibility'
          );
        }

        Object.keys(schema.name).forEach((lang) => {
          if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
            this._addWarning(
              'name',
              `Language code '${lang}' might not be valid ISO 639-1 format`,
              'best_practice',
              'Use ISO 639-1 language codes (e.g., "en", "es", "fr", "en-US")'
            );
          }
        });
      } else if (typeof schema.name === 'string') {
        this._addSuggestion(
          'name',
          'Consider using multilingual name object for better i18n support',
          'best_practice',
          'Convert string to object: {"en": "Your Name"}'
        );
      }
    }

    // Same validation for description
    if (schema.description && typeof schema.description === 'object') {
      if (!schema.description.en) {
        this._addWarning(
          'description',
          'English description (en) is recommended',
          'best_practice'
        );
      }
    }
  }

  /**
   * Validate modules
   * @private
   */
  _validateModules(schema) {
    if (schema.modules) {
      Object.keys(schema.modules).forEach((moduleKey) => {
        if (!AVAILABLE_MODULES.includes(moduleKey)) {
          this._addWarning(
            'modules',
            `Module '${moduleKey}' is not a standard AIML module`,
            'schema',
            `Standard modules: ${AVAILABLE_MODULES.join(', ')}`
          );
        }

        const module = schema.modules[moduleKey];
        if (module && typeof module === 'object') {
          if (!module.version) {
            this._addWarning(
              `modules.${moduleKey}`,
              'Module should include version field',
              'best_practice',
              'Add version field for better compatibility tracking'
            );
          }

          if (!module.enabled) {
            this._addSuggestion(
              `modules.${moduleKey}`,
              'Consider adding enabled field to module',
              'best_practice',
              'Add "enabled": true/false for better module management'
            );
          }
        }
      });
    }
  }

  /**
   * Validate semantic properties
   * @private
   */
  _validateSemanticProperties(schema) {
    if (schema.semanticProperties) {
      const semantic = schema.semanticProperties;

      // Check for standard semantic properties
      if (semantic.subjectiveQualities) {
        Object.values(semantic.subjectiveQualities).forEach((quality) => {
          if (quality && typeof quality === 'object') {
            if (quality.rating && (quality.rating < 0 || quality.rating > 1)) {
              this._addError(
                'semanticProperties',
                'Semantic quality ratings should be between 0 and 1',
                'semantic',
                'Use decimal values between 0.0 and 1.0'
              );
            }
          }
        });
      }

      if (semantic.intentAlignment) {
        Object.values(semantic.intentAlignment).forEach((intent) => {
          if (intent && typeof intent === 'object') {
            if (
              intent.alignment &&
              (intent.alignment < 0 || intent.alignment > 1)
            ) {
              this._addError(
                'semanticProperties',
                'Intent alignment should be between 0 and 1',
                'semantic'
              );
            }
          }
        });
      }
    } else {
      this._addSuggestion(
        'semanticProperties',
        'Consider adding semantic properties for better AI understanding',
        'semantic',
        'Add subjectiveQualities and intentAlignment for enhanced semantic analysis'
      );
    }
  }

  /**
   * Validate best practices
   * @private
   */
  _validateBestPractices(schema) {
    // URL validation
    if (schema.url && !/^https?:\/\/.+/.test(schema.url)) {
      this._addWarning(
        'url',
        'URL should start with http:// or https://',
        'best_practice'
      );
    }

    // Description length check
    if (schema.description) {
      const desc =
        typeof schema.description === 'string'
          ? schema.description
          : schema.description.en;
      if (desc && desc.length < 50) {
        this._addSuggestion(
          'description',
          'Description is quite short, consider adding more detail',
          'best_practice',
          'Aim for at least 50-100 characters for better SEO and understanding'
        );
      }
    }

    // Check for applied contexts
    if (schema.appliedContexts) {
      schema.appliedContexts.forEach((context) => {
        if (!AVAILABLE_CONTEXTS.includes(context)) {
          this._addWarning(
            'appliedContexts',
            `Context '${context}' is not a standard AIML context`,
            'schema',
            `Available contexts: ${AVAILABLE_CONTEXTS.join(', ')}`
          );
        }
      });
    }
  }

  /**
   * Extract entity info
   * @private
   */
  _extractEntityInfo(schema) {
    if (!schema.entityType || !schema.entityCategory) return null;

    const modules = schema.modules ? Object.keys(schema.modules) : [];
    const contexts = schema.appliedContexts || [];

    return {
      entityType: schema.entityType,
      entityCategory: schema.entityCategory,
      subcategory: schema.subcategory,
      baseSchema: schema.entityCategory,
      modules,
      contexts,
      hasSemanticProperties: !!schema.semanticProperties,
      hasIntentContext: !!schema.intentContext
    };
  }

  /**
   * Build validation result
   * @private
   */
  _buildResult(isValid, entityInfo, schema) {
    const score = this._calculateScore();
    const completeness = this._calculateCompleteness(schema);
    const performance = this._calculatePerformance(schema);

    return {
      isValid,
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions,
      entityInfo,
      score,
      completeness,
      performance
    };
  }

  /**
   * Calculate score
   * @private
   */
  _calculateScore() {
    const errorWeight = 30;
    const warningWeight = 10;
    const suggestionWeight = 5;

    const deductions =
      this.errors.length * errorWeight +
      this.warnings.length * warningWeight +
      this.suggestions.length * suggestionWeight;

    return Math.max(0, 100 - deductions);
  }

  /**
   * Calculate completeness
   * @private
   */
  _calculateCompleteness(schema) {
    if (!schema) return 0;

    const fields = [
      '@context',
      '@id',
      '@type',
      'schemaVersion',
      'entityType',
      'entityCategory',
      'subcategory',
      'name',
      'description',
      'url',
      'shortDescription',
      'properties',
      'modules',
      'semanticProperties',
      'intentContext',
      'appliedContexts'
    ];

    const presentFields = fields.filter((field) => schema[field] !== undefined);
    return Math.round((presentFields.length / fields.length) * 100);
  }

  /**
   * Calculate performance
   * @private
   */
  _calculatePerformance(schema) {
    if (!schema) return { schemaSize: 0, complexity: 'low', moduleCount: 0 };

    const schemaSize = JSON.stringify(schema).length;
    const moduleCount = schema.modules ? Object.keys(schema.modules).length : 0;

    let complexity = 'low';
    if (moduleCount > 5 || schemaSize > 5000) complexity = 'high';
    else if (moduleCount > 2 || schemaSize > 2000) complexity = 'medium';

    return { schemaSize, complexity, moduleCount };
  }

  /**
   * Add error
   * @private
   */
  _addError(field, message, category, suggestion) {
    this.errors.push({
      field,
      message,
      severity: 'error',
      category,
      suggestion
    });
  }

  /**
   * Add warning
   * @private
   */
  _addWarning(field, message, category, suggestion) {
    this.warnings.push({
      field,
      message,
      severity: 'warning',
      category,
      suggestion
    });
  }

  /**
   * Add suggestion
   * @private
   */
  _addSuggestion(field, message, category, suggestion) {
    this.suggestions.push({
      field,
      message,
      severity: 'info',
      category,
      suggestion
    });
  }
}

// Static validation method - convenience method
AIMLParser.validate = (data, options = {}) => {
  const parser = new AIMLParser(options);
  return parser.validate(data);
};

// Static factory methods
AIMLParser.createProduction = () =>
  new AIMLParser({
    debug: false,
    strict: true
  });

AIMLParser.createDevelopment = () =>
  new AIMLParser({
    debug: true,
    strict: false
  });

// Utility methods
AIMLParser.getVersion = () => AIML_VERSION;

AIMLParser.getEntityTypes = () => {
  const allTypes = [];
  Object.values(ENTITY_TYPES).forEach((types) => {
    allTypes.push(...types);
  });
  return allTypes.sort();
};

AIMLParser.getEntityCategories = () => BASE_CATEGORIES;

AIMLParser.getModules = () => AVAILABLE_MODULES;

AIMLParser.getContexts = () => AVAILABLE_CONTEXTS;

AIMLParser.getSubcategories = () => Object.keys(SUBCATEGORIES);

AIMLParser.validateConfig = (options) =>
  !!(options && typeof options === 'object');

// Export
module.exports = AIMLParser;
