/**
 * AIML Parser SDK v2.0.1 - Updated to match UI validator logic exactly
 *
 * Complete schema validation for Meta-AIML.org entity schemas.
 * Supports all 31 entity types across 6 categories with comprehensive validation.
 * NOW WITH SAME LOGIC AS UI VALIDATOR (META-AIML Intelligent Scoring Engine)
 *
 * @version 2.0.1
 * @author META-AIML.ORG - IURII IURIEV
 * @repository https://github.com/meta-aiml-org/SDK
 * @npm https://www.npmjs.com/package/@meta-aiml/parser
 * @date 2025-07-02
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
 * @property {boolean} hasEntityCapabilities - Has entity capabilities (v2.0.1)
 * @property {boolean} hasSiteCapabilities - Has site capabilities (v2.0.1)
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
 * @property {Object} [name] - Multilingual name object (required in v2.0.1)
 * @property {Object} [description] - Multilingual description object (required in v2.0.1)
 * @property {string} [url] - URL
 * @property {string} [shortDescription] - Short description
 * @property {Object} [properties] - Entity properties
 * @property {Object} [modules] - Enabled modules
 * @property {Object} [entityCapabilities] - Entity capabilities (NEW in v2.0.1)
 * @property {Object} [siteCapabilities] - Site capabilities (NEW in v2.0.1)
 */

// AIML v2.0.1 specifications - Updated to match UI validator exactly
const AIML_CONTEXT = "https://schemas.meta-aiml.org/v2.0.1/context.jsonld";
const AIML_VERSION = "2.0.1";

const BASE_CATEGORIES = [
  "organization",
  "product_offering",
  "service",
  "creative_work",
  "community",
  "financial_product"
];

const ENTITY_TYPES = {
  organization: [
    "clinic", "education_platform", "fitness_platform", "hotel", "restaurant", "store"
  ],
  product_offering: [
    "ecommerce_store", "marketplace", "product", "software_product"
  ],
  service: [
    "business_services", "generative_ai_platform", "real_estate_platform",
    "ridesharing_service", "task_management_app", "telemedicine_platform",
    "virtual_event_platform", "web_app", "website_services"
  ],
  creative_work: [
    "blog", "event", "file_hosting", "gaming_platform", "news",
    "personal_website", "photo_hosting", "streaming_platform", "video_hosting"
  ],
  community: ["dating_platform", "social_network"],
  financial_product: ["online_banking"]
};

const SUBCATEGORIES = {
  ecommerce_platform: ["ecommerce_store", "marketplace", "store"],
  hospitality: ["hotel", "restaurant"],
  healthcare_services: ["clinic", "fitness_platform", "telemedicine_platform"],
  education_services: ["education_platform"],
  ai_platform: ["generative_ai_platform"],
  professional_services: ["business_services"],
  ridesharing_services: ["ridesharing_service"],
  website_services: ["website_services"],
  property_services: ["real_estate_platform"],
  physical_product: ["product"],
  digital_product: ["file_hosting", "personal_website", "software_product", "task_management_app", "web_app"],
  media_entertainment: ["blog", "gaming_platform", "news", "photo_hosting", "streaming_platform", "video_hosting"],
  social_platform: ["dating_platform", "social_network"],
  event_platform: ["event", "virtual_event_platform"],
  financial_services: ["online_banking"]
};

// Enhanced subcategory validation rules - SAME AS UI VALIDATOR
const SUBCATEGORY_VALIDATION_RULES = {
  professional_services: {
    allowedCategories: ["service"],
    description: "Professional and business services"
  },
  event_platform: {
    allowedCategories: ["creative_work", "service"],
    description: "Event organization and management platforms"
  },
  physical_product: {
    allowedCategories: ["product_offering"],
    description: "Physical goods and products"
  },
  website_services: {
    allowedCategories: ["service"],
    description: "Website development and maintenance services"
  },
  gaming_platform: {
    allowedCategories: ["creative_work"],
    description: "Gaming and interactive entertainment platforms"
  }
};

const AVAILABLE_MODULES = [
  "auth", "compliance", "enhanced-auth", "location", "logistics", "multilingual",
  "notification", "payments", "recommendations", "search", "security",
  "streaming", "subscription", "user-management", "warranty"
];

// Required modules by entity type (from required_fields_v2.0.1.md) - SAME AS UI VALIDATOR
const REQUIRED_MODULES = {
  "clinic": ["auth", "security", "compliance"],
  "education_platform": ["auth", "user-management"],
  "hotel": ["location", "payments"],
  "restaurant": ["location"],
  "ecommerce_store": ["auth", "payments"],
  "marketplace": ["auth", "payments", "user-management"],
  "generative_ai_platform": ["auth", "security"],
  "ridesharing_service": ["auth", "location"],
  "social_network": ["auth", "user-management"],
  "online_banking": ["auth", "security", "compliance"],
  "telemedicine_platform": ["auth", "security", "compliance", "streaming"],
  "dating_platform": ["auth", "user-management"]
};

/**
 * AIML Parser SDK v2.0.1 - Official Release
 *
 * NOW WITH EXACT SAME LOGIC AS UI VALIDATOR
 * ✅ Same validation rules
 * ✅ Same scoring system (META-AIML Intelligent Scoring Engine)
 * ✅ Same completeness calculation
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
   * @param {string} [options.version='2.0.1'] - Target AIML version
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
   * Validate AIML schema - SAME LOGIC AS UI VALIDATOR
   *
   * @param {string|Object} data - Schema to validate (JSON string or object)
   * @returns {AIMLValidationResult} Validation result
   */
  validate(data) {
    // Reset state
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];

    // Handle null/undefined gracefully - FIXED ERROR HANDLING
    if (data === null) {
      this._addError('input', 'Input data is null', 'structure',
        'Provide a valid AIML schema object or JSON string');
      return this._buildResult(false, null);
    }

    if (data === undefined) {
      this._addError('input', 'Input data is undefined', 'structure',
        'Provide a valid AIML schema object or JSON string');
      return this._buildResult(false, null);
    }

    // Handle empty input gracefully
    if (data === '' || (typeof data === 'string' && data.trim() === '')) {
      this._addError('input', 'Input data is empty', 'structure',
        'Provide a valid AIML schema object or JSON string');
      return this._buildResult(false, null);
    }

    let schema;
    try {
      schema = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      this._addError('JSON', 'Invalid JSON syntax', 'structure',
        'Please check for missing commas, brackets, or quotes');
      return this._buildResult(false, null);
    }

    // Core validation pipeline - SAME AS UI VALIDATOR
    this._validateRequiredFields(schema);
    this._validateContext(schema);
    this._validateVersioning(schema);
    this._validateEntityStructure(schema);
    this._validateNames(schema);
    this._validateModules(schema);
    this._validateEntityCapabilities(schema);
    this._validateSiteCapabilities(schema);
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
   * Validate required fields - SAME AS UI VALIDATOR
   * @private
   */
  _validateRequiredFields(schema) {
    // Critical required fields (ERRORS if missing) from required_fields_v2.0.1.md
    const criticalRequired = ['@context', '@id', '@type', 'schemaVersion', 'entityType', 'entityCategory', 'name', 'description'];

    criticalRequired.forEach(field => {
      if (!schema[field]) {
        this._addError(field, `Critical required field '${field}' is missing`, 'structure',
          `Add the ${field} field to your schema (required for v2.0.1 compliance)`);
      }
    });

    // Strongly recommended fields (WARNINGS if missing)
    const stronglyRecommended = ['url', 'shortDescription'];
    stronglyRecommended.forEach(field => {
      if (!schema[field]) {
        this._addWarning(field, `Strongly recommended field '${field}' is missing`, 'best_practice',
          `Add ${field} for better schema completeness and usability`);
      }
    });

    // NEW v2.0.1 required fields
    const newRequiredFields = ['entityCapabilities', 'siteCapabilities'];
    newRequiredFields.forEach(field => {
      if (!schema[field]) {
        this._addWarning(field, `NEW v2.0.1 field '${field}' is missing`, 'semantic',
          `Add ${field} - new requirement in v2.0.1 for comprehensive entity description`);
      }
    });

    // Category-specific required fields
    if (schema.entityCategory) {
      switch (schema.entityCategory) {
        case 'organization':
          if (!schema.foundingDate) {
            this._addWarning('foundingDate', 'foundingDate is required for organization entities', 'schema',
              'Add foundingDate in ISO 8601 format (YYYY-MM-DD)');
          }
          break;
        case 'product_offering':
          if (!schema.properties) {
            this._addWarning('properties', 'properties object is required for product_offering entities', 'schema',
              'Add properties object with product/offering characteristics');
          }
          break;
        case 'service':
          if (!schema.serviceType) {
            this._addSuggestion('serviceType', 'serviceType is recommended for service entities', 'schema',
              'Add serviceType to specify the type of service provided');
          }
          break;
        case 'creative_work':
          if (!schema.properties) {
            this._addSuggestion('properties', 'properties object is recommended for creative_work entities', 'schema',
              'Add properties object with content characteristics');
          }
          break;
      }
    }
  }

  /**
   * Validate @context - SAME AS UI VALIDATOR
   * @private
   */
  _validateContext(schema) {
    if (!schema['@context']) {
      this._addError('@context', '@context is required for JSON-LD compliance', 'structure',
        `Add "@context": "${AIML_CONTEXT}"`);
    } else if (schema['@context'] !== AIML_CONTEXT) {
      this._addError('@context', 'Invalid @context value - must be exact', 'structure',
        `Use exactly "${AIML_CONTEXT}" for AIML v2.0.1 schemas`);
    }
  }

  /**
   * Validate versioning - SAME AS UI VALIDATOR
   * @private
   */
  _validateVersioning(schema) {
    if (!schema.schemaVersion) {
      this._addError('schemaVersion', 'schemaVersion is required for v2.0.1 compliance', 'structure',
        `Add "schemaVersion": "${AIML_VERSION}"`);
    } else if (schema.schemaVersion !== AIML_VERSION) {
      this._addError('schemaVersion', `Invalid schema version: ${schema.schemaVersion}`, 'schema',
        `Must be exactly "${AIML_VERSION}" for current META-AIML compliance`);
    }
  }

  /**
   * Validate entity structure - SAME AS UI VALIDATOR
   * @private
   */
  _validateEntityStructure(schema) {
    // Validate entity category
    if (schema.entityCategory && !BASE_CATEGORIES.includes(schema.entityCategory)) {
      this._addError('entityCategory', `Invalid entity category: ${schema.entityCategory}`, 'schema',
        `Use one of: ${BASE_CATEGORIES.join(', ')}`);
    }

    // Validate entity type against category
    if (schema.entityType && schema.entityCategory) {
      const validTypes = ENTITY_TYPES[schema.entityCategory] || [];
      if (validTypes.length > 0 && !validTypes.includes(schema.entityType)) {
        this._addError('entityType',
          `Entity type '${schema.entityType}' is not valid for category '${schema.entityCategory}'`,
          'schema',
          `Valid types for ${schema.entityCategory}: ${validTypes.join(', ')}`);
      }
    }

    // Validate subcategory
    if (schema.subcategory) {
      const validSubcategories = Object.keys(SUBCATEGORIES);
      if (!validSubcategories.includes(schema.subcategory)) {
        this._addWarning('subcategory', `Subcategory '${schema.subcategory}' might not be standard`, 'schema',
          `Common subcategories: ${validSubcategories.join(', ')}`);
      }

      // Validate subcategory against entity category using additional rules
      if (schema.entityCategory && SUBCATEGORY_VALIDATION_RULES[schema.subcategory]) {
        const rule = SUBCATEGORY_VALIDATION_RULES[schema.subcategory];
        if (!rule.allowedCategories.includes(schema.entityCategory)) {
          this._addError('subcategory',
            `Subcategory '${schema.subcategory}' is not valid for category '${schema.entityCategory}'`,
            'schema',
            `Valid categories for ${schema.subcategory}: ${rule.allowedCategories.join(', ')}`);
        }
      }

      // Validate entity type against subcategory
      if (schema.entityType && SUBCATEGORIES[schema.subcategory]) {
        const validTypesForSubcategory = SUBCATEGORIES[schema.subcategory];
        if (!validTypesForSubcategory.includes(schema.entityType)) {
          this._addError('entityType',
            `Entity type '${schema.entityType}' is not valid for subcategory '${schema.subcategory}'`,
            'schema',
            `Valid types for ${schema.subcategory}: ${validTypesForSubcategory.join(', ')}`);
        }
      }
    }
  }

  /**
   * Validate names - SAME AS UI VALIDATOR
   * @private
   */
  _validateNames(schema) {
    // Validate name structure - must be multilingual object in v2.0.1
    if (schema.name) {
      if (typeof schema.name === 'string') {
        this._addError('name', 'name must be a multilingual object in v2.0.1', 'structure',
          'Convert to object format: {"en": "Your Name", "es": "Tu Nombre"}');
      } else if (typeof schema.name === 'object') {
        if (!schema.name.en) {
          this._addError('name', 'English name (en) is required in multilingual names', 'structure',
            'Add "en" field - English is required for international compatibility');
        }

        Object.keys(schema.name).forEach(lang => {
          if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
            this._addWarning('name', `Language code '${lang}' might not be valid ISO 639-1 format`, 'best_practice',
              'Use ISO 639-1 language codes (e.g., "en", "es", "fr", "en-US")');
          }

          // Check for empty values
          if (!schema.name[lang] || schema.name[lang].trim() === '') {
            this._addWarning('name', `Empty name value for language '${lang}'`, 'structure',
              'Provide meaningful names for all declared languages');
          }
        });
      }
    }

    // Validate description structure - must be multilingual object in v2.0.1
    if (schema.description) {
      if (typeof schema.description === 'string') {
        this._addError('description', 'description must be a multilingual object in v2.0.1', 'structure',
          'Convert to object format: {"en": "Your Description"}');
      } else if (typeof schema.description === 'object') {
        if (!schema.description.en) {
          this._addError('description', 'English description (en) is required', 'structure',
            'Add "en" field - English description is mandatory');
        }

        // Check description length (minimum 50 characters for English)
        if (schema.description.en && schema.description.en.length < 50) {
          this._addWarning('description', 'English description should be at least 50 characters', 'best_practice',
            'Provide detailed description for better understanding and SEO');
        }

        Object.keys(schema.description).forEach(lang => {
          if (!schema.description[lang] || schema.description[lang].trim() === '') {
            this._addWarning('description', `Empty description value for language '${lang}'`, 'structure',
              'Provide meaningful descriptions for all declared languages');
          }
        });
      }
    }
  }

  /**
   * Validate modules - SAME AS UI VALIDATOR
   * @private
   */
  _validateModules(schema) {
    // Check for required modules based on entity type
    if (schema.entityType && REQUIRED_MODULES[schema.entityType]) {
      const requiredModules = REQUIRED_MODULES[schema.entityType];
      const presentModules = schema.modules ? Object.keys(schema.modules) : [];

      requiredModules.forEach(requiredModule => {
        if (!presentModules.includes(requiredModule)) {
          this._addError('modules', `Required module '${requiredModule}' is missing for ${schema.entityType}`, 'schema',
            `${schema.entityType} entities must include: ${requiredModules.join(', ')}`);
        }
      });
    }

    if (schema.modules) {
      Object.keys(schema.modules).forEach(moduleKey => {
        if (!AVAILABLE_MODULES.includes(moduleKey)) {
          this._addWarning('modules', `Module '${moduleKey}' is not a standard AIML module`, 'schema',
            `Standard modules: ${AVAILABLE_MODULES.join(', ')}`);
        }

        const module = schema.modules[moduleKey];
        if (module && typeof module === 'object') {
          if (!module.version) {
            this._addWarning(`modules.${moduleKey}`, 'Module should include version field', 'best_practice',
              'Add version "2.0.1" for compatibility tracking');
          }

          if (module.enabled === undefined) {
            this._addSuggestion(`modules.${moduleKey}`, 'Consider adding enabled field to module', 'best_practice',
              'Add "enabled": true/false for better module management');
          }

          // Version validation for v2.0.1
          if (module.version && module.version !== "2.0.1") {
            this._addWarning(`modules.${moduleKey}`, `Module version ${module.version} might not be current`, 'schema',
              'Consider using version "2.0.1" for latest features');
          }
        }
      });
    }

    // Check for required modules (always check, even if no modules field)
    if (schema.entityType && REQUIRED_MODULES[schema.entityType]) {
      const requiredModules = REQUIRED_MODULES[schema.entityType];
      const currentModules = schema.modules ? Object.keys(schema.modules) : [];
      const missingModules = requiredModules.filter(mod => !currentModules.includes(mod));

      for (const missingModule of missingModules) {
        this._addWarning('modules', `Required module '${missingModule}' is missing for entity type '${schema.entityType}'`, 'structure',
          `Add the '${missingModule}' module for ${schema.entityType} entities`);
      }
    }
  }

  /**
   * Validate entity capabilities - SAME AS UI VALIDATOR
   * @private
   */
  _validateEntityCapabilities(schema) {
    if (schema.entityCapabilities) {
      const capabilities = schema.entityCapabilities;

      // Check for required functionalFeatures (NEW in v2.0.1)
      if (!capabilities.functionalFeatures) {
        this._addWarning('entityCapabilities', 'Missing functionalFeatures - these define objective business capabilities', 'semantic',
          'Add functionalFeatures object with boolean values for entity capabilities (NEW in v2.0.1)');
      } else {
        // Validate that functionalFeatures are boolean values - critical for objective validation
        Object.entries(capabilities.functionalFeatures).forEach(([key, value]) => {
          if (typeof value !== 'boolean') {
            this._addError('entityCapabilities', `functionalFeatures.${key} should be boolean, got ${typeof value}`, 'semantic',
              'Use true/false values for objective, verifiable business features');
          }
        });

        // Check for meaningful functional features
        const featureCount = Object.keys(capabilities.functionalFeatures).length;
        if (featureCount < 3) {
          this._addSuggestion('entityCapabilities', 'Consider adding more functionalFeatures for comprehensive business description', 'semantic',
            'Add more objective capabilities like acceptsReservations, hasDelivery, acceptsCreditCards, etc.');
        }
      }

      // Check for required contentTypes array
      if (!capabilities.contentTypes || !Array.isArray(capabilities.contentTypes)) {
        this._addWarning('entityCapabilities', 'Missing contentTypes array - define what content types are available', 'semantic',
          'Add contentTypes array (e.g., ["menu", "photos", "reviews", "support"])');
      } else if (capabilities.contentTypes.length === 0) {
        this._addWarning('entityCapabilities', 'contentTypes array is empty - add available content types', 'semantic');
      }

      // Check for businessModel (recommended)
      if (!capabilities.businessModel) {
        this._addSuggestion('entityCapabilities', 'Consider adding businessModel for better business categorization', 'semantic',
          'Add businessModel (e.g., "restaurant", "marketplace", "subscription")');
      }

      // Check for paymentMethods if applicable
      if (capabilities.functionalFeatures?.supportsOnlinePayments === true) {
        if (!capabilities.paymentMethods || !Array.isArray(capabilities.paymentMethods)) {
          this._addSuggestion('entityCapabilities', 'Since online payments are supported, add paymentMethods array', 'semantic',
            'Add paymentMethods array (e.g., ["credit_card", "paypal", "digital_wallet"])');
        }
      }

    } else {
      this._addWarning('entityCapabilities', 'Missing entityCapabilities - required in v2.0.1 for objective business features', 'semantic',
        'Add entityCapabilities with functionalFeatures, contentTypes, and businessModel (NEW in v2.0.1)');
    }
  }

  /**
   * Validate site capabilities - SAME AS UI VALIDATOR
   * @private
   */
  _validateSiteCapabilities(schema) {
    if (schema.siteCapabilities) {
      const capabilities = schema.siteCapabilities;

      // Check for required availableActions array (NEW in v2.0.1)
      if (!capabilities.availableActions || !Array.isArray(capabilities.availableActions)) {
        this._addWarning('siteCapabilities', 'Missing availableActions array - define what users can do on the site', 'semantic',
          'Add availableActions array (e.g., ["view_menu", "make_reservation", "order_delivery"]) - NEW in v2.0.1');
      } else if (capabilities.availableActions.length === 0) {
        this._addWarning('siteCapabilities', 'availableActions array is empty - add user interaction possibilities', 'semantic');
      }

      // Check for interactionMethods - how users can interact with business
      if (!capabilities.interactionMethods || !Array.isArray(capabilities.interactionMethods)) {
        this._addWarning('siteCapabilities', 'Missing interactionMethods - define how users interact with business', 'semantic',
          'Add interactionMethods array (e.g., ["online_form", "phone_call", "email"])');
      }

      // Check for contentAccess levels
      if (!capabilities.contentAccess || !Array.isArray(capabilities.contentAccess)) {
        this._addSuggestion('siteCapabilities', 'Add contentAccess array for content accessibility levels', 'semantic',
          'Add contentAccess (e.g., ["public", "members_only"])');
      }

      // Check for supportedDevices - important for accessibility
      if (!capabilities.supportedDevices || !Array.isArray(capabilities.supportedDevices)) {
        this._addWarning('siteCapabilities', 'Missing supportedDevices - important for accessibility information', 'semantic',
          'Add supportedDevices array (e.g., ["desktop", "mobile", "tablet"])');
      }

      // Check for languages array
      if (!capabilities.languages || !Array.isArray(capabilities.languages)) {
        this._addWarning('siteCapabilities', 'Missing languages array - define interface languages', 'semantic',
          'Add languages array for internationalization (e.g., ["en", "es"])');
      }

      // Check for realTimeFeatures if applicable
      if (!capabilities.realTimeFeatures) {
        this._addSuggestion('siteCapabilities', 'Consider adding realTimeFeatures if site has real-time functionality', 'semantic',
          'Add realTimeFeatures array if applicable (e.g., ["real_time_availability", "instant_booking"])');
      }

    } else {
      this._addWarning('siteCapabilities', 'Missing siteCapabilities - required in v2.0.1 for website interaction features', 'semantic',
        'Add siteCapabilities with availableActions, interactionMethods, and supportedDevices (NEW in v2.0.1)');
    }
  }

  /**
   * Validate best practices - SAME AS UI VALIDATOR
   * @private
   */
  _validateBestPractices(schema) {
    // URL validation
    if (schema.url && !/^https?:\/\/.+/.test(schema.url)) {
      this._addWarning('url', 'URL should start with http:// or https://', 'best_practice');
    }

    // Description length check
    if (schema.description) {
      const desc = typeof schema.description === 'string' ? schema.description : schema.description.en;
      if (desc && desc.length < 50) {
        this._addSuggestion('description', 'Description is quite short, consider adding more detail', 'best_practice',
          'Aim for at least 50-100 characters for better SEO and understanding');
      }
    }
  }

  /**
   * Extract entity info - SAME AS UI VALIDATOR
   * @private
   */
  _extractEntityInfo(schema) {
    if (!schema.entityType || !schema.entityCategory) return null;

    const modules = schema.modules ? Object.keys(schema.modules) : [];

    return {
      entityType: schema.entityType,
      entityCategory: schema.entityCategory,
      subcategory: schema.subcategory,
      baseSchema: schema.entityCategory,
      modules,
      hasEntityCapabilities: !!schema.entityCapabilities,
      hasSiteCapabilities: !!schema.siteCapabilities
    };
  }

  /**
   * Build validation result - SAME AS UI VALIDATOR
   * @private
   */
  _buildResult(isValid, entityInfo, schema) {
    const score = this._calculateScore(schema);
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
   * Calculate score using META-AIML Intelligent Scoring Engine - SAME AS UI VALIDATOR
   * @private
   */
  _calculateScore(schema) {
    const errorWeight = 30;
    const warningWeight = 10;
    const suggestionWeight = 5;

    // Базовый расчет штрафов
    const deductions = (this.errors.length * errorWeight) +
                     (this.warnings.length * warningWeight) +
                     (this.suggestions.length * suggestionWeight);

    const baseScore = Math.max(0, 100 - deductions);

    // 🎯 PAGESPEED-ПОДОБНАЯ СИСТЕМА СКОРИНГА (META-AIML Intelligent Scoring Engine)

    // 🟢 EXCELLENT ZONE (90-100): Нет warnings - качественная схема
    if (this.warnings.length === 0) {
      // Если нет warnings, стартуем с 90 и учитываем completeness для достижения 100
      const completeness = this._calculateCompleteness(schema);
      const excellentScore = 90 + (completeness * 0.1); // 10% влияния completeness
      return Math.min(100, Math.max(90, excellentScore));
    }

    // 🟡 GOOD ZONE (50-89): Есть errors, но схема функциональная
    if (this.errors.length > 0) {
      // Если много критических ошибок (>3), может упасть в Poor зону
      if (this.errors.length > 3) {
        return Math.max(25, baseScore); // Дно на уровне 25
      }
      // Иначе минимум Good зона
      return Math.max(50, baseScore);
    }

    // 🟡 GOOD ZONE (50-89): Нет errors, но есть warnings
    return Math.max(50, baseScore);
  }

  /**
   * Calculate completeness using same logic as UI validator - SAME AS UI VALIDATOR
   * @private
   */
  _calculateCompleteness(schema) {
    if (!schema) return 0;

    // Согласно required_fields_v2.0.1.md - критически обязательные поля (ERRORS)
    const criticalFields = [
      '@context',      // ОБЯЗАТЕЛЬНО точное значение
      '@id',           // Уникальный URI идентификатор
      '@type',         // Pascal Case название типа
      'schemaVersion', // ОБЯЗАТЕЛЬНО "2.0.1"
      'entityType',    // snake_case один из 31 типов
      'entityCategory',// один из 6 базовых категорий
      'subcategory',   // должна соответствовать entityType
      'name',          // Мультиязычные названия (минимум "en")
      'description'    // Мультиязычные описания (минимум "en", 50+ символов)
    ];

    // Настоятельно рекомендуемые поля (WARNINGS)
    const recommendedFields = [
      'url',               // Валидный HTTP/HTTPS URL
      'shortDescription',  // Краткое описание в одну строку
      'logo'              // Для видимых сущностей
    ];

    // НОВЫЕ ПОЛЯ v2.0.1 - объективные возможности
    const newV201Fields = [
      'entityCapabilities',  // Объективные возможности бизнеса
      'siteCapabilities'     // Возможности веб-сайта
    ];

    // Дополнительные поля для полноты
    const enhancementFields = [
      'properties',
      'modules',
      'foundingDate',
      'lastModified'
    ];

    let totalWeight = 0;
    let currentWeight = 0;

    // Критические поля - 50% веса (если нет - критическая ошибка)
    const criticalWeight = 50;
    totalWeight += criticalWeight;

    let criticalPresent = 0;
    criticalFields.forEach(field => {
      if (schema[field] !== undefined) {
        // Дополнительная проверка качества для name и description
        if (field === 'name' || field === 'description') {
          if (typeof schema[field] === 'object' && schema[field] !== null) {
            const langObj = schema[field];
            if (langObj['en'] && langObj['en'].length > 0) {
              if (field === 'description' && langObj['en'].length >= 50) {
                criticalPresent++;
              } else if (field === 'name') {
                criticalPresent++;
              }
            }
          }
        } else {
          criticalPresent++;
        }
      }
    });
    currentWeight += (criticalPresent / criticalFields.length) * criticalWeight;

    // Рекомендуемые поля - 25% веса
    const recommendedWeight = 25;
    totalWeight += recommendedWeight;

    let recommendedPresent = 0;
    recommendedFields.forEach(field => {
      if (schema[field] !== undefined) {
        // Дополнительная проверка для URL
        if (field === 'url') {
          const url = schema[field];
          if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            recommendedPresent++;
          }
        } else {
          recommendedPresent++;
        }
      }
    });
    currentWeight += (recommendedPresent / recommendedFields.length) * recommendedWeight;

    // НОВЫЕ ПОЛЯ v2.0.1 - 15% веса (важно для современных схем)
    const newFieldsWeight = 15;
    totalWeight += newFieldsWeight;

    let newFieldsPresent = 0;
    newV201Fields.forEach(field => {
      if (schema[field] !== undefined) {
        const capabilities = schema[field];
        // Проверяем что не просто {}, а содержит данные
        if (capabilities && Object.keys(capabilities).length > 0) {
          newFieldsPresent++;
        }
      }
    });
    currentWeight += (newFieldsPresent / newV201Fields.length) * newFieldsWeight;

    // Дополнительные поля для достижения 100% - 10% веса
    const enhancementWeight = 10;
    totalWeight += enhancementWeight;

    let enhancementPresent = 0;
    enhancementFields.forEach(field => {
      if (schema[field] !== undefined) {
        if (field === 'modules') {
          const modules = schema[field];
          // Проверяем что есть хотя бы один включенный модуль
          if (modules && Object.keys(modules).length > 0) {
            enhancementPresent++;
          }
        } else {
          enhancementPresent++;
        }
      }
    });
    currentWeight += (enhancementPresent / enhancementFields.length) * enhancementWeight;

    return Math.round((currentWeight / totalWeight) * 100);
  }

  /**
   * Calculate performance - SAME AS UI VALIDATOR
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
   * Add error - SAME AS UI VALIDATOR
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
   * Add warning - SAME AS UI VALIDATOR
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
   * Add suggestion - SAME AS UI VALIDATOR
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
AIMLParser.createProduction = () => new AIMLParser({
    debug: false,
    strict: true
  });

AIMLParser.createDevelopment = () => new AIMLParser({
    debug: true,
    strict: false
  });

// Utility methods
AIMLParser.getVersion = () => AIML_VERSION;

AIMLParser.getEntityTypes = () => {
  const allTypes = [];
  Object.values(ENTITY_TYPES).forEach(types => {
    allTypes.push(...types);
  });
  return allTypes.sort();
};

AIMLParser.getEntityCategories = () => BASE_CATEGORIES;

AIMLParser.getModules = () => AVAILABLE_MODULES;

AIMLParser.getSubcategories = () => Object.keys(SUBCATEGORIES);

// Get required modules for entity type - ADDED from CHANGELOG.md line 90
AIMLParser.getRequiredModules = (entityType) => {
  if (!entityType || typeof entityType !== 'string') {
    return [];
  }
  return REQUIRED_MODULES[entityType] || [];
};

AIMLParser.validateConfig = (options) => options && typeof options === 'object';

// Additional static methods for convenience
AIMLParser.isValid = (data, options = {}) => {
  const result = AIMLParser.validate(data, options);
  return result.isValid;
};

AIMLParser.getEntityInfo = (data) => {
  try {
    const parser = new AIMLParser();
    return parser._extractEntityInfo(data);
  } catch {
    return null;
  }
};

// Export
module.exports = AIMLParser;
