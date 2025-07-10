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

// Standard AIML modules (15 total)
const STANDARD_MODULES = [
  "auth", "payments", "multilingual", "search", "user-management",
  "location", "streaming", "subscription", "security", "compliance",
  "logistics", "notification", "recommendations", "warranty", "enhanced-auth"
];

// Required modules by entity type (from required_fields_v2.0.1.md)
const REQUIRED_MODULES = {
  clinic: ["auth", "security", "compliance"],
  education_platform: ["auth", "user-management"],
  hotel: ["location", "payments"],
  restaurant: ["location"],
  ecommerce_store: ["auth", "payments"],
  marketplace: ["auth", "payments", "user-management"],
  generative_ai_platform: ["auth", "security"],
  ridesharing_service: ["auth", "location"],
  social_network: ["auth", "user-management"],
  online_banking: ["auth", "security", "compliance"],
  telemedicine_platform: ["auth", "security", "compliance", "streaming"]
};

// Language code validation pattern
const ISO_639_1_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;

/**
 * Main AIML Parser class with v2.0.1 validation logic
 */
class AIMLParser {
  constructor(options = {}) {
    this.config = {
      debug: options.debug || false,
      strict: options.strict || false,
      version: options.version || AIML_VERSION,
      ...options
    };
  }

  /**
   * Comprehensive schema validation - main method
   * @param {Object} data - Schema to validate
   * @returns {AIMLValidationResult} Validation result
   */
  validate(data) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    try {
      if (!data || typeof data !== "object") {
        errors.push({
          field: "root",
          message: "Schema must be a valid JSON object",
          severity: "error",
          category: "structure",
          suggestion: "Provide a valid JSON object"
        });

        return {
          isValid: false,
          errors,
          warnings,
          suggestions,
          score: 0,
          completeness: 0,
          performance: {
            schemaSize: 0,
            complexity: "low",
            moduleCount: 0
          }
        };
      }

      // 1. Critical required fields validation (ERRORS)
      this._validateRequiredFields(data, errors);

      // 2. Context and version validation
      this._validateContextAndVersion(data, errors);

      // 3. Entity hierarchy validation
      this._validateEntityHierarchy(data, errors, warnings);

      // 4. Multilingual validation (v2.0.1 requirement)
      this._validateMultilingual(data, errors, warnings);

      // 5. v2.0.1 New fields validation
      this._validateV201Fields(data, warnings);

      // 6. Module validation
      this._validateModules(data, warnings, suggestions);

      // 7. URL and format validation
      this._validateFormats(data, warnings, suggestions);

      // Calculate metrics
      const entityInfo = this._extractEntityInfo(data);
      const performance = this._calculatePerformance(data);
      const completeness = this._calculateCompleteness(data);
      const score = this._calculateIntelligentScore(errors, warnings, suggestions, completeness);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
        entityInfo,
        score,
        completeness,
        performance
      };

    } catch (error) {
      errors.push({
        field: "validation",
        message: `Validation error: ${error.message}`,
        severity: "error",
        category: "structure"
      });

      return {
        isValid: false,
        errors,
        warnings,
        suggestions,
        score: 0,
        completeness: 0,
        performance: {
          schemaSize: 0,
          complexity: "low",
          moduleCount: 0
        }
      };
    }
  }

  /**
   * Validate critical required fields (ERRORS if missing)
   */
  _validateRequiredFields(data, errors) {
    const requiredFields = ["@context", "@id", "@type", "schemaVersion", "entityType", "entityCategory", "name", "description"];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push({
          field,
          message: `Critical required field '${field}' is missing`,
          severity: "error",
          category: "structure",
          suggestion: `Add the ${field} field to your schema (required for v2.0.1 compliance)`
        });
      }
    }
  }

  /**
   * Validate @context and schemaVersion (exact match required)
   */
  _validateContextAndVersion(data, errors) {
    if (data["@context"] && data["@context"] !== AIML_CONTEXT) {
      errors.push({
        field: "@context",
        message: "Invalid @context value - must be exact",
        severity: "error",
        category: "structure",
        suggestion: `Use exactly "${AIML_CONTEXT}" for AIML v2.0.1 schemas`
      });
    }

    if (data.schemaVersion && data.schemaVersion !== AIML_VERSION) {
      errors.push({
        field: "schemaVersion",
        message: `Invalid schema version - expected ${AIML_VERSION}`,
        severity: "error",
        category: "structure",
        suggestion: `Set schemaVersion to "${AIML_VERSION}"`
      });
    }

    if (!data.schemaVersion) {
      errors.push({
        field: "schemaVersion",
        message: "schemaVersion is required for v2.0.1 compliance",
        severity: "error",
        category: "structure",
        suggestion: `Add "schemaVersion": "${AIML_VERSION}"`
      });
    }
  }

  /**
   * Validate entity hierarchy
   */
  _validateEntityHierarchy(data, errors, warnings) {
    if (data.entityCategory && !BASE_CATEGORIES.includes(data.entityCategory)) {
      errors.push({
        field: "entityCategory",
        message: `Invalid entity category: ${data.entityCategory}`,
        severity: "error",
        category: "structure",
        suggestion: `Use one of: ${BASE_CATEGORIES.join(", ")}`
      });
    }

    if (data.entityType && data.entityCategory) {
      const allowedTypes = ENTITY_TYPES[data.entityCategory] || [];
      if (!allowedTypes.includes(data.entityType)) {
        errors.push({
          field: "entityType",
          message: `Invalid entity type '${data.entityType}' for category '${data.entityCategory}'`,
          severity: "error",
          category: "structure",
          suggestion: `Use one of: ${allowedTypes.join(", ")}`
        });
      }
    }

    // Subcategory validation
    if (data.subcategory && data.entityType) {
      const foundSubcategory = Object.keys(SUBCATEGORIES).find(subcat =>
        SUBCATEGORIES[subcat].includes(data.entityType)
      );
      if (foundSubcategory && data.subcategory !== foundSubcategory) {
        warnings.push({
          field: "subcategory",
          message: `Subcategory mismatch: expected '${foundSubcategory}' for entity type '${data.entityType}'`,
          severity: "warning",
          category: "structure",
          suggestion: `Set subcategory to "${foundSubcategory}"`
        });
      }
    }
  }

  /**
   * Validate multilingual fields (v2.0.1 requirement)
   */
  _validateMultilingual(data, errors, warnings) {
    // name must be multilingual object
    if (data.name) {
      if (typeof data.name === "string") {
        errors.push({
          field: "name",
          message: "name must be a multilingual object in v2.0.1",
          severity: "error",
          category: "structure",
          suggestion: 'Convert to object format: {"en": "Your Name", "es": "Tu Nombre"}'
        });
      } else if (typeof data.name === "object") {
        if (!data.name.en) {
          warnings.push({
            field: "name",
            message: "English (en) name is recommended",
            severity: "warning",
            category: "best_practice",
            suggestion: 'Add English translation: "en": "English Name"'
          });
        }
        this._validateLanguageCodes(data.name, "name", warnings);
      }
    }

    // description must be multilingual object
    if (data.description) {
      if (typeof data.description === "string") {
        errors.push({
          field: "description",
          message: "description must be a multilingual object in v2.0.1",
          severity: "error",
          category: "structure",
          suggestion: 'Convert to object format: {"en": "Your Description", "es": "Tu Descripción"}'
        });
      } else if (typeof data.description === "object") {
        if (!data.description.en) {
          warnings.push({
            field: "description",
            message: "English (en) description is recommended",
            severity: "warning",
            category: "best_practice",
            suggestion: 'Add English translation: "en": "English Description"'
          });
        }

        // Check minimum length for English description
        if (data.description.en && data.description.en.length < 50) {
          warnings.push({
            field: "description",
            message: "English description should be at least 50 characters",
            severity: "warning",
            category: "best_practice",
            suggestion: "Provide a more detailed English description"
          });
        }

        this._validateLanguageCodes(data.description, "description", warnings);
      }
    }
  }

  /**
   * Validate v2.0.1 new fields
   */
  _validateV201Fields(data, warnings) {
    if (!data.entityCapabilities) {
      warnings.push({
        field: "entityCapabilities",
        message: "NEW v2.0.1 field 'entityCapabilities' is missing",
        severity: "warning",
        category: "semantic",
        suggestion: "Add entityCapabilities object with functionalFeatures, contentTypes, businessModel, paymentMethods"
      });

      warnings.push({
        field: "entityCapabilities",
        message: "Missing entityCapabilities - required in v2.0.1 for objective business features",
        severity: "warning",
        category: "semantic"
      });
    }

    if (!data.siteCapabilities) {
      warnings.push({
        field: "siteCapabilities",
        message: "NEW v2.0.1 field 'siteCapabilities' is missing",
        severity: "warning",
        category: "semantic",
        suggestion: "Add siteCapabilities object with availableActions, interactionMethods, contentAccess, supportedDevices, languages, realTimeFeatures"
      });

      warnings.push({
        field: "siteCapabilities",
        message: "Missing siteCapabilities - required in v2.0.1 for website interaction features",
        severity: "warning",
        category: "semantic"
      });
    }
  }

  /**
   * Validate language codes
   */
  _validateLanguageCodes(multilingualObj, fieldName, warnings) {
    for (const [langCode, value] of Object.entries(multilingualObj)) {
      if (!ISO_639_1_PATTERN.test(langCode)) {
        warnings.push({
          field: fieldName,
          message: `Invalid language code: ${langCode}`,
          severity: "warning",
          category: "structure",
          suggestion: "Use valid ISO 639-1 format (e.g., 'en', 'es', 'fr', 'en-US')"
        });
      }

      if (!value || (typeof value === "string" && value.trim() === "")) {
        warnings.push({
          field: fieldName,
          message: `Empty value for language '${langCode}'`,
          severity: "warning",
          category: "best_practice",
          suggestion: `Provide content for language '${langCode}' or remove the language`
        });
      }
    }
  }

  /**
   * Validate modules
   */
  _validateModules(data, warnings, suggestions) {
    const moduleNames = data.modules ? Object.keys(data.modules) : [];

    // Check for required modules (always check, even if no modules field)
    if (data.entityType && REQUIRED_MODULES[data.entityType]) {
      const required = REQUIRED_MODULES[data.entityType];
      const missing = required.filter(mod => !moduleNames.includes(mod));

      for (const missingModule of missing) {
        warnings.push({
          field: "modules",
          message: `Required module '${missingModule}' is missing for entity type '${data.entityType}'`,
          severity: "warning",
          category: "structure",
          suggestion: `Add the '${missingModule}' module for ${data.entityType} entities`
        });
      }
    }

    // Check for non-standard modules (only if modules exist)
    if (data.modules) {
      const nonStandard = moduleNames.filter(mod => !STANDARD_MODULES.includes(mod));
      for (const module of nonStandard) {
        suggestions.push({
          field: "modules",
          message: `Non-standard module: ${module}`,
          severity: "info",
          category: "best_practice",
          suggestion: `Consider using standard AIML modules: ${STANDARD_MODULES.join(", ")}`
        });
      }
    }
  }

  /**
   * Validate formats (URLs, etc.)
   */
  _validateFormats(data, warnings, suggestions) {
    // Recommended fields
    if (!data.url) {
      warnings.push({
        field: "url",
        message: "Strongly recommended field 'url' is missing",
        severity: "warning",
        category: "best_practice"
      });
    } else {
      try {
        new URL(data.url);
      } catch {
        warnings.push({
          field: "url",
          message: "Invalid URL format",
          severity: "warning",
          category: "structure",
          suggestion: "Provide a valid HTTP/HTTPS URL"
        });
      }
    }

    if (!data.shortDescription) {
      warnings.push({
        field: "shortDescription",
        message: "Strongly recommended field 'shortDescription' is missing",
        severity: "warning",
        category: "best_practice"
      });
    }
  }

  /**
   * Extract entity information
   */
  _extractEntityInfo(data) {
    if (!data.entityType) return null;

    const modules = data.modules ? Object.keys(data.modules) : [];
    const baseSchema = data.entityCategory || "unknown";

    return {
      entityType: data.entityType,
      entityCategory: data.entityCategory,
      subcategory: data.subcategory,
      baseSchema,
      modules,
      hasEntityCapabilities: !!data.entityCapabilities,
      hasSiteCapabilities: !!data.siteCapabilities
    };
  }

  /**
   * Calculate performance metrics
   */
  _calculatePerformance(data) {
    const schemaSize = JSON.stringify(data).length;
    const moduleCount = data.modules ? Object.keys(data.modules).length : 0;

    let complexity = "low";
    if (moduleCount > 5 || schemaSize > 2000) complexity = "medium";
    if (moduleCount > 10 || schemaSize > 5000) complexity = "high";

    return {
      schemaSize,
      complexity,
      moduleCount
    };
  }

  /**
   * Calculate completeness score
   */
  _calculateCompleteness(data) {
    const fields = [
      "@context", "@id", "@type", "schemaVersion", "entityType",
      "entityCategory", "subcategory", "name", "description",
      "url", "shortDescription", "properties", "modules",
      "entityCapabilities", "siteCapabilities"
    ];

    const present = fields.filter(field => data[field] !== undefined).length;
    return Math.round((present / fields.length) * 100);
  }

  /**
   * META-AIML Intelligent Scoring Engine v2.0.1
   */
  _calculateIntelligentScore(errors, warnings, suggestions, completeness) {
    // Base calculation: 100 - (ERRORS×30 + WARNINGS×10 + SUGGESTIONS×5)
    let score = 100 - (errors.length * 30 + warnings.length * 10 + suggestions.length * 5);

    // Intelligent Scoring Engine logic:
    if (warnings.length === 0 && errors.length === 0) {
      // No WARNINGS → start from 90 + (completeness × 10%) up to 100
      score = Math.max(90, 90 + (completeness * 0.1));
    } else if (errors.length > 0 && errors.length <= 3) {
      // Has ERRORS but ≤3 → minimum 50 points (Good zone)
      score = Math.max(50, score);
    } else if (errors.length > 3) {
      // Many ERRORS >3 → can fall to Poor zone (floor at 25 points)
      score = Math.max(25, score);
    }

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Quick validation method
   */
  isValid(data) {
    return this.validate(data).isValid;
  }

  /**
   * Extract entity info only
   */
  getEntityInfo(data) {
    try {
      return this._extractEntityInfo(data);
    } catch {
      return null;
    }
  }

  // Static methods
  static validate(data, options = {}) {
    const parser = new AIMLParser(options);
    return parser.validate(data);
  }

  static isValid(data, options = {}) {
    return AIMLParser.validate(data, options).isValid;
  }

  static getEntityInfo(data) {
    const parser = new AIMLParser();
    return parser.getEntityInfo(data);
  }

  static createProduction() {
    return new AIMLParser({ debug: false, strict: true });
  }

  static createDevelopment() {
    return new AIMLParser({ debug: true, strict: false });
  }

  static getVersion() {
    return AIML_VERSION;
  }

  static getEntityTypes() {
    return Object.values(ENTITY_TYPES).flat();
  }

  static getEntityCategories() {
    return BASE_CATEGORIES;
  }

  static getModules() {
    return STANDARD_MODULES;
  }

  static getRequiredModules(entityType) {
    return REQUIRED_MODULES[entityType] || [];
  }

  static validateConfig(config) {
    return config !== null && typeof config === "object";
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== "undefined" && module.exports) {
  // eslint-disable-next-line @next/next/no-assign-module-variable
  module.exports = AIMLParser;
} else if (typeof window !== "undefined") {
  window.AIMLParser = AIMLParser;
}
