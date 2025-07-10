# @meta-aiml/parser

[![npm version](https://badge.fury.io/js/%40meta-aiml%2Fparser.svg)](https://badge.fury.io/js/%40meta-aiml%2Fparser)
[![License: Source-Available](https://img.shields.io/badge/License-Source--Available-blue.svg)](https://meta-aiml.org/terms/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> **AIML Parser SDK v2.0.1** - Official validation library for Meta-AIML.org entity schemas

**🎯 SAME VALIDATION LOGIC AS UI VALIDATOR** - Complete schema validation for **31 entity types** across **6 categories** with META-AIML Intelligent Scoring Engine and comprehensive v2.0.1 compliance.

## ⭐ NEW in v2.0.1

### 🔄 **Enhanced Validation System**
- **entityCapabilities**: Objective business capabilities with boolean functional features
- **siteCapabilities**: Website interaction capabilities and user actions
- **META-AIML Intelligent Scoring Engine**: Google PageSpeed-like quality zones (EXCELLENT 90-100, GOOD 50-89, POOR 0-49)
- **Exact UI Validator Logic**: Same validation rules, scoring, and completeness calculation as the official UI validator

### 📋 **Critical Required Fields (v2.0.1)**
```json
{
  "@context": "https://schemas.meta-aiml.org/v2.0.1/context.jsonld",
  "@id": "https://example.com/entity",
  "@type": "EntityTypeName",
  "schemaVersion": "2.0.1",
  "entityType": "entity_type",
  "entityCategory": "category",
  "subcategory": "subcategory",
  "name": { "en": "Name" },
  "description": { "en": "Description 50+ characters" }
}
```

## 🚀 Quick Start

### Installation

```bash
npm install @meta-aiml/parser
```

### Basic Usage

```javascript
const AIMLParser = require('@meta-aiml/parser');

// Validate a schema using EXACT SAME LOGIC as UI validator
const parser = new AIMLParser();
const result = parser.validate({
  "@context": "https://schemas.meta-aiml.org/v2.0.1/context.jsonld",
  "@id": "https://bellavista.com/entity",
  "@type": "Restaurant",
  "schemaVersion": "2.0.1",
  "entityType": "restaurant",
  "entityCategory": "organization",
  "subcategory": "hospitality",
  "name": {
    "en": "Bella Vista Restaurant",
    "es": "Restaurante Bella Vista"
  },
  "description": {
    "en": "A cozy neighborhood restaurant serving fresh, local cuisine with modern twist and exceptional dining experience in a warm and inviting atmosphere."
  },
  "url": "https://bellavista.com",
  // NEW v2.0.1 FIELDS - Required for complete validation
  "entityCapabilities": {
    "functionalFeatures": {
      "acceptsReservations": true,
      "hasDelivery": true,
      "hasTakeout": true,
      "acceptsCreditCards": true,
      "hasWifi": true
    },
    "contentTypes": ["menu", "photos", "reviews", "location"],
    "businessModel": "restaurant",
    "paymentMethods": ["credit_card", "cash", "digital_wallet"]
  },
  "siteCapabilities": {
    "availableActions": ["view_menu", "make_reservation", "order_delivery"],
    "interactionMethods": ["online_form", "phone_call"],
    "supportedDevices": ["desktop", "mobile", "tablet"],
    "languages": ["en", "es"]
  },
  // Required module for restaurant entities
  "modules": {
    "location": {
      "version": "2.0.1",
      "enabled": true
    }
  }
});

if (result.isValid) {
  console.log(`✅ Valid schema! Score: ${result.score}/100`);
  console.log(`📊 Completeness: ${result.completeness}%`);

  // Quality zones (same as UI validator)
  if (result.score >= 90) {
    console.log('🟢 EXCELLENT - Production ready!');
  } else if (result.score >= 50) {
    console.log('🟡 GOOD - Minor improvements needed');
  } else {
    console.log('🔴 POOR - Address critical errors');
  }
} else {
  console.log('❌ Validation errors:', result.errors);
  console.log('⚠️ Warnings:', result.warnings);
}
```

## 📊 META-AIML Intelligent Scoring Engine

Same scoring algorithm as the official UI validator:

### 🎯 Quality Zones:
- **🟢 EXCELLENT (90-100)**: No warnings, with completeness bonus for 100 points
- **🟡 GOOD (50-89)**: Functional schema with warnings or minor errors (≤3)
- **🔴 POOR (0-49)**: Critical issues requiring immediate attention (>3 errors)

### 🧮 Scoring Algorithm:
```javascript
// Base calculation: 100 - (ERRORS×30 + WARNINGS×10 + SUGGESTIONS×5)
// Enhanced logic:
// - No warnings → 90 + (completeness × 10%) up to 100
// - Has errors (≤3) → minimum 50 points (Good zone)
// - Multiple errors (>3) → may fall to Poor zone (floor 25 points)
```

## 🏗️ Complete Entity Type Coverage

### **📊 Organization (6 types)**
- `clinic` - Healthcare clinics (*Required modules: auth, security, compliance*)
- `education_platform` - Educational platforms (*Required: auth, user-management*)
- `fitness_platform` - Fitness and wellness centers
- `hotel` - Hotels and accommodation (*Required: location, payments*)
- `restaurant` - Food service establishments (*Required: location*)
- `store` - Physical retail stores

### **🛍️ Product Offering (4 types)**
- `ecommerce_store` - Online stores (*Required: auth, payments*)
- `marketplace` - Multi-vendor marketplaces (*Required: auth, payments, user-management*)
- `product` - Physical products
- `software_product` - Digital software products

### **🔧 Service (9 types)**
- `business_services` - Professional services
- `generative_ai_platform` - AI platforms (*Required: auth, security*)
- `real_estate_platform` - Property services
- `ridesharing_service` - Transportation (*Required: auth, location*)
- `task_management_app` - Productivity apps
- `telemedicine_platform` - Remote healthcare (*Required: auth, security, compliance, streaming*)
- `virtual_event_platform` - Online events
- `web_app` - Web applications
- `website_services` - Website development services

### **🎨 Creative Work (9 types)**
- `blog` - Content publishing platforms
- `event` - Events and gatherings
- `file_hosting` - File storage services
- `gaming_platform` - Gaming platforms
- `news` - News and media outlets
- `personal_website` - Personal websites
- `photo_hosting` - Image sharing platforms
- `streaming_platform` - Media streaming
- `video_hosting` - Video platforms

### **👥 Community (2 types)**
- `dating_platform` - Dating platforms
- `social_network` - Social networks (*Required: auth, user-management*)

### **💰 Financial Product (1 type)**
- `online_banking` - Digital banking (*Required: auth, security, compliance*)

## 🔧 Complete API Reference

### Constructor

```javascript
const parser = new AIMLParser(options);
```

**Options:**
- `debug` (boolean): Enable debug mode
- `strict` (boolean): Enable strict validation
- `version` (string): Target AIML version (default: "2.0.1")

### Core Validation Methods

#### `validate(data)`
Complete schema validation with META-AIML Intelligent Scoring Engine.

```javascript
const result = parser.validate(schema);
// Returns: AIMLValidationResult with exact same logic as UI validator
```

#### `isValid(data)`
Quick boolean validation check.

```javascript
const valid = parser.isValid(schema);
// Returns: boolean
```

#### `getEntityInfo(data)`
Extract detailed entity information.

```javascript
const info = parser.getEntityInfo(schema);
// Returns: AIMLEntityInfo | null
```

### Static Methods

```javascript
// Quick validation (same as UI validator)
const result = AIMLParser.validate(schema, options);

// Factory methods
const prodParser = AIMLParser.createProduction();
const devParser = AIMLParser.createDevelopment();

// Utility methods
const version = AIMLParser.getVersion(); // "2.0.1"
const entityTypes = AIMLParser.getEntityTypes(); // All 31 types
const categories = AIMLParser.getEntityCategories(); // 6 categories
const modules = AIMLParser.getModules(); // 15 available modules
const subcategories = AIMLParser.getSubcategories(); // 15 subcategories
```

## 📊 Validation Result Structure

```javascript
{
  isValid: boolean,           // Overall validation status
  errors: AIMLValidationError[],     // Critical errors (30 points each)
  warnings: AIMLValidationError[],   // Warnings (10 points each)
  suggestions: AIMLValidationError[], // Suggestions (5 points each)
  entityInfo: {               // Entity information
    entityType: string,       // One of 31 supported types
    entityCategory: string,   // One of 6 base categories
    subcategory: string,      // One of 15 subcategories
    baseSchema: string,       // Base schema category
    modules: string[],        // Active modules (max 15)
    hasEntityCapabilities: boolean,  // NEW v2.0.1
    hasSiteCapabilities: boolean     // NEW v2.0.1
  },
  score: number,              // META-AIML Intelligent Scoring Engine (0-100)
  completeness: number,       // Completeness percentage (0-100)
  performance: {              // Performance metrics
    schemaSize: number,       // Schema size in bytes
    complexity: 'low'|'medium'|'high', // Complexity assessment
    moduleCount: number       // Number of enabled modules
  }
}
```

## ⚡ v2.0.1 Enhanced Features

### **NEW: entityCapabilities (Required)**
Objective, verifiable business capabilities:

```javascript
"entityCapabilities": {
  "functionalFeatures": {
    // Boolean values for objective verification
    "acceptsReservations": true,
    "hasDelivery": true,
    "acceptsCreditCards": true,
    "hasWifi": true
  },
  "contentTypes": ["menu", "photos", "reviews"], // Available content
  "businessModel": "restaurant",                 // Business model type
  "paymentMethods": ["credit_card", "cash"]      // Supported payments
}
```

### **NEW: siteCapabilities (Required)**
Website interaction and accessibility features:

```javascript
"siteCapabilities": {
  "availableActions": ["view_menu", "make_reservation"], // User actions
  "interactionMethods": ["online_form", "phone_call"],   // Contact methods
  "contentAccess": ["public", "members_only"],           // Access levels
  "supportedDevices": ["desktop", "mobile", "tablet"],   // Device support
  "languages": ["en", "es"],                             // UI languages
  "realTimeFeatures": ["real_time_availability"]         // Real-time features
}
```

## 🔍 Complete Examples

### Marketplace Entity (Product Offering)

```javascript
const marketplaceSchema = {
  "@context": "https://schemas.meta-aiml.org/v2.0.1/context.jsonld",
  "@id": "https://techbazaar.com/entity",
  "@type": "Marketplace",
  "schemaVersion": "2.0.1",
  "entityType": "marketplace",
  "entityCategory": "product_offering",
  "subcategory": "ecommerce_platform",
  "name": {
    "en": "TechBazaar Global Marketplace",
    "es": "Mercado Global TechBazaar"
  },
  "description": {
    "en": "Leading B2B2C technology marketplace connecting vendors and buyers worldwide with comprehensive product catalog and secure payment processing."
  },
  "url": "https://techbazaar.com",
  "shortDescription": "Global technology marketplace platform",

  // Required v2.0.1 fields
  "entityCapabilities": {
    "functionalFeatures": {
      "supportsOnlinePayments": true,
      "hasShoppingCart": true,
      "hasUserAccounts": true,
      "hasProductReviews": true,
      "hasVendorVerification": true
    },
    "contentTypes": ["products", "reviews", "guides", "vendor_profiles"],
    "businessModel": "marketplace",
    "paymentMethods": ["credit_card", "paypal", "digital_wallet"]
  },
  "siteCapabilities": {
    "availableActions": ["browse_products", "compare_products", "add_to_cart", "checkout"],
    "interactionMethods": ["online_form", "live_chat", "email"],
    "supportedDevices": ["desktop", "mobile", "tablet"],
    "languages": ["en", "es", "zh"]
  },

  // Required modules for marketplace
  "modules": {
    "auth": { "version": "2.0.1", "enabled": true },
    "payments": { "version": "2.0.1", "enabled": true },
    "user-management": { "version": "2.0.1", "enabled": true }
  }
};

const result = AIMLParser.validate(marketplaceSchema);
console.log(`Score: ${result.score}/100 - ${result.score >= 90 ? 'EXCELLENT' : result.score >= 50 ? 'GOOD' : 'POOR'}`);
```

## 🚀 Advanced Usage

### Comprehensive Error Handling

```javascript
const result = parser.validate(schema);

// Same error structure as UI validator
if (!result.isValid) {
  console.log('🔴 Critical Errors (Must Fix):');
  result.errors.forEach(error => {
    console.log(`  - ${error.field}: ${error.message}`);
    if (error.suggestion) {
      console.log(`    💡 ${error.suggestion}`);
    }
  });

  console.log('🟡 Warnings (Recommended):');
  result.warnings.forEach(warning => {
    console.log(`  - ${warning.field}: ${warning.message}`);
  });

  console.log('🔵 Suggestions (Optional):');
  result.suggestions.forEach(suggestion => {
    console.log(`  - ${suggestion.field}: ${suggestion.message}`);
  });
}

// Quality assessment (same as UI validator)
const getQualityZone = (score) => {
  if (score >= 90) return { name: 'EXCELLENT', color: 'green', description: 'Production ready' };
  if (score >= 50) return { name: 'GOOD', color: 'orange', description: 'Minor improvements needed' };
  return { name: 'POOR', color: 'red', description: 'Critical issues' };
};

const zone = getQualityZone(result.score);
console.log(`${zone.name} (${result.score}/100) - ${zone.description}`);
```

### Batch Validation

```javascript
const schemas = [restaurantSchema, marketplaceSchema, clinicSchema];
const results = schemas.map(schema => AIMLParser.validate(schema));

// Quality distribution (same logic as UI validator)
const excellent = results.filter(r => r.score >= 90).length;
const good = results.filter(r => r.score >= 50 && r.score < 90).length;
const poor = results.filter(r => r.score < 50).length;

console.log(`Quality Distribution: ${excellent} Excellent, ${good} Good, ${poor} Poor`);
```

## 📋 Required Fields by Category

### Critical Fields (All entities)
```javascript
// ERRORS if missing
const criticalRequired = [
  '@context',      // Must be "https://schemas.meta-aiml.org/v2.0.1/context.jsonld"
  '@id',           // Unique URI identifier
  '@type',         // Pascal Case entity name
  'schemaVersion', // Must be "2.0.1"
  'entityType',    // snake_case type (one of 31)
  'entityCategory',// one of 6 base categories
  'subcategory',   // must match entityType
  'name',          // Multilingual object (minimum "en")
  'description'    // Multilingual object (minimum "en", 50+ chars)
];
```

### Required Modules by Entity Type
```javascript
const requiredModules = {
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
  "telemedicine_platform": ["auth", "security", "compliance", "streaming"]
};
```

## 🌐 Browser Usage

### CDN (UMD)
```html
<script src="https://unpkg.com/@meta-aiml/parser@2.1.0/dist/aiml-parser.min.js"></script>
<script>
  const parser = new AIMLParser();
  const result = parser.validate(mySchema);

  // Same quality assessment as UI validator
  if (result.score >= 90) {
    console.log('🟢 EXCELLENT - Ready for production!');
  }
</script>
```

### ES Modules
```html
<script type="module">
  import AIMLParser from 'https://unpkg.com/@meta-aiml/parser@2.1.0/dist/index.esm.js';

  const result = AIMLParser.validate(schema);
  console.log(`META-AIML Score: ${result.score}/100`);
</script>
```

## 🏗️ Schema Hierarchy

All AIML v2.0.1 schemas follow this exact structure:

```
@type → entityCategory → subcategory → entityType
```

**Examples:**
- `Restaurant → organization → hospitality → restaurant`
- `Marketplace → product_offering → ecommerce_platform → marketplace`
- `SocialNetwork → community → social_platform → social_network`

### Complete Subcategories (15 total)
- `ecommerce_platform`, `hospitality`, `healthcare_services`
- `education_services`, `ai_platform`, `professional_services`
- `ridesharing_services`, `website_services`, `property_services`
- `physical_product`, `digital_product`, `media_entertainment`
- `social_platform`, `event_platform`, `financial_services`

## ✅ Migration from v2.0.0

### Removed in v2.0.1
- ❌ `semanticProperties` - Subjective AI qualities
- ❌ `intentContext` - User intent contexts
- ❌ `appliedContexts` - External context references
- ❌ `context/` folder - Geographic/cultural contexts

### Added in v2.0.1
- ✅ `entityCapabilities` - Objective business capabilities
- ✅ `siteCapabilities` - Website interaction features
- ✅ Enhanced validation with exact UI validator logic
- ✅ META-AIML Intelligent Scoring Engine with quality zones

## 🔄 Changelog

### v2.1.0 (Latest)
- 🎯 **EXACT UI VALIDATOR LOGIC**: Same validation rules, scoring, and completeness
- 🔧 Enhanced error messages with actionable suggestions
- 📊 META-AIML Intelligent Scoring Engine with quality zones
- 🚀 Complete v2.0.1 support with new required fields

## 🤝 Contributing


Thank you for your interest.

However, this project does **not accept external contributions** at this time.

Please do not submit pull requests or feature requests.

We appreciate your understanding.

## 📄 License

Source-Available License - see [LICENSE](LICENSE) file.

## 🔗 Links

- **GitHub Repository**: https://github.com/meta-aiml-org/SDK
- **NPM Package**: https://www.npmjs.com/package/@meta-aiml/parser
- **Meta-AIML.org**: https://meta-aiml.org
- **Schema Documentation**: https://meta-aiml.org/docs
- **UI Validator**: https://meta-aiml.org/playground


---

**Built for AI agents and developers.** 🤖✨

*Validated with the same engine that powers the official Meta-AIML.org UI validator.*
