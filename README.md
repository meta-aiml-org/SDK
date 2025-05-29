# @meta-aiml/parser

Official JavaScript SDK for AIML (AI Markup Language) schema validation and processing.

[![npm version](https://badge.fury.io/js/@meta-aiml%2Fparser.svg)](https://www.npmjs.com/package/@meta-aiml/parser)
[![License: Source-Available](https://img.shields.io/badge/License-Source--Available-blue.svg)](https://github.com/meta-aiml/sdk/blob/main/LICENSE)

## Features

- 🔍 **Schema Validation** - Validate AIML schemas against JSON Schema definitions
- 🚀 **Entity Parsing** - Parse and process AIML entity data with type safety
- 📝 **TypeScript Support** - Full TypeScript definitions for all schema types
- 🔧 **Module Processing** - Process and validate module configurations
- 🌐 **Browser Compatible** - Works in both Node.js and browser environments
- 📚 **Rich Documentation** - Comprehensive API docs and examples

## Installation

### NPM
```bash
npm install @meta-aiml/parser
```

### Yarn
```bash
yarn add @meta-aiml/parser
```

### Browser CDN
```html
<script src="https://cdn.meta-aiml.org/sdk/AIMLParser.js"></script>
```

## Quick Start

### ES6 Modules
```javascript
import { AIMLParser, AIMLValidator } from '@meta-aiml/parser';

// Create parser instance
const parser = new AIMLParser({
  entityType: 'restaurant',
  autoDetectType: true,
  validateOnParse: true
});

// Parse entity data
const restaurantData = {
  "@context": "https://schemas.meta-aiml.org",
  "@type": "Restaurant",
  "entityType": "restaurant",
  "name": "Joe's Pizza",
  "description": "Best pizza in town"
};

const restaurant = await parser.parseEntity(restaurantData);
console.log(restaurant);
```

### CommonJS
```javascript
const { AIMLParser, AIMLValidator } = require('@meta-aiml/parser');

const parser = new AIMLParser();
// ... rest same as above
```

### Browser
```html
<script src="https://cdn.meta-aiml.org/sdk/AIMLParser.js"></script>
<script>
const parser = new AIMLParser.AIMLParser({
  entityType: 'restaurant'
});

// Auto-generate form
parser.generateForm('#my-form');

// Listen for results
document.addEventListener('aiml-form-result', (event) => {
  if (event.detail.success) {
    console.log('Generated entity:', event.detail.entity);
  } else {
    console.error('Error:', event.detail.error);
  }
});
</script>
```

## API Reference

### AIMLParser

#### Constructor
```typescript
new AIMLParser(options?: ParserOptions)
```

**Options:**
- `entityType?: SchemaType` - Default entity type
- `autoDetectType?: boolean` - Auto-detect entity type from data (default: true)
- `processModules?: boolean` - Process modules during parsing (default: true)
- `validateOnParse?: boolean` - Validate during parsing (default: true)

#### Methods

##### `parseEntity(data: any, entityType?: SchemaType): Promise<AIMLEntity>`
Parse raw data into AIML entity.

```javascript
const entity = await parser.parseEntity({
  "@context": "https://schemas.meta-aiml.org",
  "@type": "Restaurant",
  "entityType": "restaurant",
  "name": "My Restaurant"
});
```

##### `extractModules(entity: AIMLEntity): AIMLModule[]`
Extract modules from entity.

```javascript
const modules = parser.extractModules(entity);
console.log(modules); // [{ moduleType: 'auth', version: '1.0.0', ... }]
```

##### `validate(entity: AIMLEntity): Promise<ValidationResult>`
Validate entity against schema.

```javascript
const result = await parser.validate(entity);
if (!result.valid) {
  console.log('Validation errors:', result.errors);
}
```

##### `generateForm(selector: string, entityType?: SchemaType): void`
Generate HTML form (browser only).

```javascript
parser.generateForm('#form-container', 'restaurant');
```

### AIMLValidator

#### Constructor
```typescript
new AIMLValidator(options?: ValidatorOptions)
```

**Options:**
- `schemaBaseUrl?: string` - Base URL for schemas (default: 'https://schemas.meta-aiml.org')
- `strictMode?: boolean` - Strict validation mode (default: true)
- `validateModules?: boolean` - Validate modules (default: true)
- `allowAdditionalProperties?: boolean` - Allow additional properties (default: false)

#### Methods

##### `validate(entity: any): Promise<ValidationResult>`
Validate AIML entity.

##### `validateEntity(entity: any, schemaType: SchemaType): Promise<ValidationResult>`
Validate entity against specific schema type.

## Entity Types

Supported entity types:
- `restaurant` - Restaurant entities
- `hotel` - Hotel entities
- `ecommerce_store` - E-commerce store entities
- `organization` - Organization entities
- `product` - Product entities
- `service` - Service entities
- `blog` - Blog entities
- `clinic` - Medical clinic entities
- `education_platform` - Education platform entities
- `gaming_platform` - Gaming platform entities
- `marketplace` - Marketplace entities
- `news` - News organization entities
- `social_network` - Social network entities
- `streaming_platform` - Streaming platform entities

## Examples

### Restaurant Entity
```javascript
const restaurant = await parser.parseEntity({
  "@context": "https://schemas.meta-aiml.org",
  "@type": "Restaurant",
  "entityType": "restaurant",
  "name": "Joe's Pizza",
  "description": "Authentic Italian pizza",
  "cuisine": ["Italian", "Pizza"],
  "priceRange": "$$",
  "address": {
    "streetAddress": "123 Main St",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001"
  },
  "modules": [
    {
      "$ref": "/schemas/templates/module/location.json"
    },
    {
      "$ref": "/schemas/templates/module/payments.json"
    }
  ]
});
```

### E-commerce Store
```javascript
const store = await parser.parseEntity({
  "@context": "https://schemas.meta-aiml.org",
  "@type": "OnlineStore",
  "entityType": "ecommerce_store",
  "name": "Tech Gadgets Store",
  "description": "Latest tech gadgets and accessories",
  "categories": [
    {
      "id": "electronics",
      "name": "Electronics",
      "description": "Electronic devices and accessories"
    }
  ],
  "paymentMethods": ["credit_card", "paypal", "apple_pay"],
  "modules": [
    {
      "$ref": "/schemas/templates/module/payments.json"
    },
    {
      "$ref": "/schemas/templates/module/logistics.json"
    }
  ]
});
```

### Validation Only
```javascript
const validator = new AIMLValidator({
  strictMode: true,
  validateModules: true
});

const result = await validator.validate(entityData);

if (result.valid) {
  console.log('✅ Entity is valid');
} else {
  console.log('❌ Validation errors:');
  result.errors.forEach(error => {
    console.log(`  ${error.path}: ${error.message}`);
  });
}
```

## Module System

AIML supports a modular architecture where entities can include various modules:

```javascript
const entityWithModules = {
  // ... entity data
  "modules": [
    {
      "$ref": "/schemas/templates/module/auth.json",
      "required": true,
      "properties": {
        "authProvider": "oauth2",
        "supportedMethods": ["google", "facebook"]
      }
    },
    {
      "$ref": "/schemas/templates/module/payments.json",
      "required": true,
      "properties": {
        "supportedGateways": ["stripe", "paypal"]
      }
    }
  ]
};
```

Available modules:
- `auth` - Authentication
- `payments` - Payment processing
- `location` - Geolocation services
- `notifications` - Notification systems
- `search` - Search functionality
- `security` - Security features
- `multilingual` - Multi-language support
- And more...

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  RestaurantEntity,
  ValidationResult,
  AIMLModule
} from '@meta-aiml/parser';

const restaurant: RestaurantEntity = {
  "@context": "https://schemas.meta-aiml.org",
  "@type": "Restaurant",
  entityType: "restaurant",
  name: "My Restaurant",
  cuisine: ["Italian"]
};

const result: ValidationResult = await parser.validate(restaurant);
```

## Error Handling

```javascript
try {
  const entity = await parser.parseEntity(data);
  console.log('Parsed successfully:', entity);
} catch (error) {
  if (error.message.includes('Validation failed')) {
    console.log('Schema validation error');
  } else if (error.message.includes('Could not detect entity type')) {
    console.log('Please specify entityType');
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

## Browser Events

When using `generateForm()`, listen for events:

```javascript
document.addEventListener('aiml-form-result', (event) => {
  const { success, entity, error } = event.detail;

  if (success) {
    console.log('Generated entity:', entity);
    // Send to server, display preview, etc.
  } else {
    console.error('Form error:', error);
    // Show error message to user
  }
});
```

## Performance

- **Caching**: Schemas are cached automatically
- **Lazy Loading**: Schemas loaded on-demand
- **Preloading**: Preload common schemas for better performance

```javascript
import { SchemaLoader } from '@meta-aiml/parser';

const loader = new SchemaLoader();
await loader.preloadSchemas(['restaurant', 'hotel', 'product']);
```

## License

**Source-Available License** © 2025 Meta AIML Team

This project is source-available under a custom license that permits:
- ✅ **Usage** - Use in your applications and projects (including commercial)
- ✅ **Inspection** - View and study the source code
- ✅ **Learning** - Educational and research purposes

But prohibits:
- 🚫 **Modification** - Cannot alter or create derivative works
- 🚫 **Redistribution** - Cannot share or republish the source code
- 🚫 **Forking** - Cannot create competing implementations

The project maintainer retains full control over development direction, feature roadmap, and contribution acceptance.

See [LICENSE](./LICENSE) file for complete terms.

## Links

- 📖 [Documentation](https://meta-aiml.org/docs)
- 🏠 [Homepage](https://meta-aiml.org)
- 📦 [NPM Package](https://www.npmjs.com/package/@meta-aiml/parser)
- 📋 [Schema Repository](https://schemas.meta-aiml.org)
