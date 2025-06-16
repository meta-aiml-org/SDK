# @meta-aiml/parser

[![npm version](https://badge.fury.io/js/%40meta-aiml%2Fparser.svg)](https://badge.fury.io/js/%40meta-aiml%2Fparser)
[![License: Source-Available](https://img.shields.io/badge/License-Source--Available-blue.svg)](https://meta-aiml.org/terms/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> **AIML Parser SDK v2.0.0** - Official validation library for Meta-AIML.org entity schemas

Complete schema validation for **31 entity types** across **6 categories** with comprehensive validation, semantic analysis, and performance metrics.

## 🚀 Quick Start

### Installation

```bash
npm install @meta-aiml/parser
```

### Basic Usage

```javascript
const AIMLParser = require('@meta-aiml/parser');

// Validate a schema
const parser = new AIMLParser();
const result = parser.validate({
  "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
  "@type": "Restaurant",
  "entityType": "restaurant",
  "entityCategory": "organization",
  "subcategory": "hospitality",
  "name": {
    "en": "The Garden Bistro",
    "es": "Bistro El Jardín"
  },
  "description": {
    "en": "A delightful garden restaurant with farm-to-table cuisine"
  }
});

if (result.isValid) {
  console.log(`✅ Valid schema! Score: ${result.score}/100`);
  console.log(`📊 Completeness: ${result.completeness}%`);
} else {
  console.log('❌ Validation errors:', result.errors);
}
```

### TypeScript Support

```typescript
import AIMLParser, { AIMLSchema, AIMLValidationResult } from '@meta-aiml/parser';

const schema: AIMLSchema = {
  '@context': 'https://schemas.meta-aiml.org/v2.0.0/context.jsonld',
  entityType: 'marketplace',
  entityCategory: 'product_offering',
  // ... rest of schema
};

const result: AIMLValidationResult = AIMLParser.validate(schema);
```

## 📋 Features

### ✅ Complete AIML v2.0.0 Support
- **31 Entity Types**: All official AIML entities
- **6 Categories**: organization, product_offering, service, creative_work, community, financial_product
- **14 Modules**: auth, payments, search, multilingual, and more
- **15 Subcategories**: Complete hierarchical validation

### 🧠 AI-Optimized Validation
- **Semantic Properties**: Validate AI-specific fields
- **Intent Context**: User journey and intent validation
- **Performance Metrics**: Schema size and complexity analysis
- **Quality Scoring**: 0-100 scoring system

### 🛠️ Developer Experience
- **TypeScript Ready**: Full type definitions included
- **Universal Compatibility**: Works in Node.js and browsers
- **Detailed Errors**: Comprehensive error reporting with suggestions
- **Zero Dependencies**: Lightweight and fast

## 🏗️ Entity Categories & Types

<details>
<summary><strong>📊 Organization (6 types)</strong></summary>

- `clinic` - Healthcare clinics
- `education_platform` - Educational institutions
- `fitness_platform` - Fitness and wellness centers
- `hotel` - Hospitality and accommodation
- `restaurant` - Food service establishments
- `store` - Physical retail stores
</details>

<details>
<summary><strong>🛍️ Product Offering (4 types)</strong></summary>

- `ecommerce_store` - Online retail stores
- `marketplace` - Multi-vendor marketplaces
- `product` - Physical products
- `software_product` - Digital software products
</details>

<details>
<summary><strong>🔧 Service (9 types)</strong></summary>

- `business_services` - Professional services
- `generative_ai_platform` - AI generation platforms
- `real_estate_platform` - Property services
- `ridesharing_service` - Transportation services
- `task_management_app` - Productivity applications
- `telemedicine_platform` - Remote healthcare
- `virtual_event_platform` - Online events
- `web_app` - Web applications
- `website_services` - Website development
</details>

<details>
<summary><strong>🎨 Creative Work (9 types)</strong></summary>

- `blog` - Content publishing platforms
- `event` - Events and gatherings
- `file_hosting` - File storage services
- `gaming_platform` - Gaming platforms
- `news` - News and media outlets
- `personal_website` - Personal websites
- `photo_hosting` - Image sharing platforms
- `streaming_platform` - Media streaming
- `video_hosting` - Video platforms
</details>

<details>
<summary><strong>👥 Community (2 types)</strong></summary>

- `dating_platform` - Dating and relationship platforms
- `social_network` - Social networking platforms
</details>

<details>
<summary><strong>💰 Financial Product (1 type)</strong></summary>

- `online_banking` - Digital banking platforms
</details>

## 🔧 API Reference

### Constructor

```javascript
const parser = new AIMLParser(options);
```

**Options:**
- `debug` (boolean): Enable debug mode
- `strict` (boolean): Enable strict validation
- `version` (string): Target AIML version

### Methods

#### `validate(data)`
Complete schema validation with detailed analysis.

```javascript
const result = parser.validate(schema);
// Returns: AIMLValidationResult
```

#### `isValid(data)`
Quick validation check.

```javascript
const valid = parser.isValid(schema);
// Returns: boolean
```

#### `getEntityInfo(data)`
Extract entity information.

```javascript
const info = parser.getEntityInfo(schema);
// Returns: AIMLEntityInfo | null
```

### Static Methods

```javascript
// Quick validation
const result = AIMLParser.validate(schema, options);

// Factory methods
const prodParser = AIMLParser.createProduction();
const devParser = AIMLParser.createDevelopment();

// Utility methods
const version = AIMLParser.getVersion(); // "2.0.0"
const entityTypes = AIMLParser.getEntityTypes();
const categories = AIMLParser.getEntityCategories();
const modules = AIMLParser.getModules();
const contexts = AIMLParser.getContexts();
```

## 📊 Validation Result

```javascript
{
  isValid: boolean,           // Overall validation status
  errors: AIMLValidationError[],     // Critical errors
  warnings: AIMLValidationError[],   // Warnings
  suggestions: AIMLValidationError[], // Improvement suggestions
  entityInfo: {               // Entity information
    entityType: string,
    entityCategory: string,
    subcategory?: string,
    baseSchema: string,
    modules: string[],
    contexts: string[],
    hasSemanticProperties: boolean,
    hasIntentContext: boolean
  },
  score: number,              // Quality score (0-100)
  completeness: number,       // Completeness percentage
  performance: {              // Performance metrics
    schemaSize: number,
    complexity: 'low'|'medium'|'high',
    moduleCount: number
  }
}
```

## 🌐 Browser Usage

### CDN (UMD)

```html
<script src="https://unpkg.com/@meta-aiml/parser@2.0.0/dist/aiml-parser.min.js"></script>
<script>
  const parser = new AIMLParser();
  const result = parser.validate(mySchema);
</script>
```

### ES Modules

```html
<script type="module">
  import AIMLParser from 'https://unpkg.com/@meta-aiml/parser@2.0.0/dist/index.esm.js';

  const parser = new AIMLParser();
  const result = parser.validate(mySchema);
</script>
```

## 🔍 Examples

### Restaurant Entity

```javascript
const restaurantSchema = {
  "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
  "@id": "https://example.com/restaurant",
  "@type": "Restaurant",
  "schemaVersion": "2.0.0",
  "entityType": "restaurant",
  "entityCategory": "organization",
  "subcategory": "hospitality",
  "name": {
    "en": "The Garden Bistro",
    "es": "Bistro El Jardín"
  },
  "description": {
    "en": "A delightful garden restaurant featuring farm-to-table cuisine"
  },
  "url": "https://gardenbistro.com",
  "modules": {
    "location": {
      "version": "2.0.0",
      "enabled": true
    },
    "multilingual": {
      "version": "2.0.0",
      "enabled": true,
      "supported_languages": ["en", "es"]
    }
  },
  "semanticProperties": {
    "subjectiveQualities": {
      "ambiance": {
        "rating": 0.9,
        "description": "Cozy garden setting"
      }
    }
  }
};

const result = AIMLParser.validate(restaurantSchema);
console.log(result);
```

### E-commerce Marketplace

```javascript
const marketplaceSchema = {
  "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
  "entityType": "marketplace",
  "entityCategory": "product_offering",
  "subcategory": "ecommerce_platform",
  "name": "TechBazaar",
  "description": "Global technology marketplace",
  "modules": {
    "payments": { "enabled": true },
    "search": { "enabled": true },
    "recommendations": { "enabled": true }
  }
};
```

## 🚀 Advanced Usage

### Custom Validation Configuration

```javascript
const strictParser = new AIMLParser({
  debug: true,
  strict: true,
  version: '2.0.0'
});

const result = strictParser.validate(schema);
```

### Batch Validation

```javascript
const schemas = [schema1, schema2, schema3];
const results = schemas.map(schema => AIMLParser.validate(schema));

const validSchemas = results.filter(r => r.isValid);
const invalidSchemas = results.filter(r => !r.isValid);
```

### Error Handling

```javascript
const result = parser.validate(schema);

if (!result.isValid) {
  console.log('Critical Errors:');
  result.errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
    if (error.suggestion) {
      console.log(`  💡 ${error.suggestion}`);
    }
  });

  console.log('Warnings:');
  result.warnings.forEach(warning => {
    console.log(`- ${warning.field}: ${warning.message}`);
  });
}
```

## 🏗️ Build & Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## 📋 Schema Structure

AIML schemas follow this hierarchy:

```
@type → entityCategory → subcategory → entityType
```

Example: `Hotel → organization → hospitality → hotel`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/meta-aiml-org/SDK/blob/main/CONTRIBUTING.md) for details.

## 📄 License

Source-Available License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub Repository**: https://github.com/meta-aiml-org/SDK
- **NPM Package**: https://www.npmjs.com/package/@meta-aiml/parser
- **Meta-AIML.org**: https://meta-aiml.org
- **Schema Documentation**: https://meta-aiml.org/docs
- **Issue Tracker**: https://github.com/meta-aiml-org/SDK/issues

## 👨‍💻 Author

**META-AIML.ORG - IURII IURIEV**

---

*Built for AI agents and developers.*
