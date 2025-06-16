# Changelog

All notable changes to the `@meta-aiml/parser` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-06-15

### ✨ Initial Release

#### Core Features
- **Complete AIML v2.0.0 Support**: All 31 entity types across 6 categories
- **Universal Compatibility**: Works in Node.js and browsers (UMD, ES modules, CommonJS)
- **TypeScript Ready**: Full TypeScript definitions included
- **Zero Dependencies**: Lightweight and fast validation

#### Entity Support
- **Organization Entities** (6): clinic, education_platform, fitness_platform, hotel, restaurant, store
- **Product Offering Entities** (4): ecommerce_store, marketplace, product, software_product
- **Service Entities** (9): business_services, generative_ai_platform, real_estate_platform, ridesharing_service, task_management_app, telemedicine_platform, virtual_event_platform, web_app, website_services
- **Creative Work Entities** (9): blog, event, file_hosting, gaming_platform, news, personal_website, photo_hosting, streaming_platform, video_hosting
- **Community Entities** (2): dating_platform, social_network
- **Financial Product Entities** (1): online_banking

#### Validation Features
- **Hierarchical Validation**: `@type → entityCategory → subcategory → entityType`
- **Module Validation**: All 14 standard AIML modules
- **Semantic Properties**: AI-optimized validation for semantic fields
- **Intent Context**: User journey and intent validation
- **Performance Metrics**: Schema size and complexity analysis
- **Quality Scoring**: 0-100 scoring system with detailed breakdowns

#### Developer Experience
- **Comprehensive Error Reporting**: Detailed errors, warnings, and suggestions
- **Multiple Validation Modes**: Production, development, and custom configurations
- **Static Utility Methods**: Easy access to entity types, categories, and modules
- **Factory Methods**: Pre-configured parser instances
- **Batch Validation Support**: Validate multiple schemas efficiently

#### API Methods
- `validate(data)` - Complete validation with detailed analysis
- `isValid(data)` - Quick boolean validation
- `getEntityInfo(data)` - Extract entity information
- Static methods: `AIMLParser.validate()`, `AIMLParser.createProduction()`, etc.
- Utility methods: `getVersion()`, `getEntityTypes()`, `getModules()`, etc.

### 🔧 Technical Details

#### Architecture
- **Modular Design**: Clean separation of validation concerns
- **Performance Optimized**: Fast validation with minimal overhead
- **Memory Efficient**: No memory leaks or excessive allocations
- **Error Resilient**: Graceful handling of malformed input

#### Validation Pipeline
1. JSON syntax validation
2. Required field validation
3. Context and versioning validation
4. Entity structure validation
5. Name and description validation
6. Module configuration validation
7. Semantic properties validation
8. Best practices validation

#### Output Structure
```javascript
{
  isValid: boolean,
  errors: AIMLValidationError[],
  warnings: AIMLValidationError[],
  suggestions: AIMLValidationError[],
  entityInfo: AIMLEntityInfo,
  score: number,
  completeness: number,
  performance: AIMLPerformanceMetrics
}
```

### 📦 Package Structure

```
@meta-aiml/parser@2.0.0
├── dist/
│   ├── index.js          # CommonJS build
│   ├── index.esm.js      # ES modules build
│   ├── index.d.ts        # TypeScript definitions
│   └── aiml-parser.min.js # Browser UMD build
├── src/
│   ├── index.js          # Main source file
│   └── index.d.ts        # TypeScript definitions
├── README.md
├── CHANGELOG.md
├── LICENSE
└── package.json
```

### 🚀 Migration from v1.0.0

**Version 1.0.0 is now DEPRECATED and unsupported.**

#### What Changed
- Complete schema format redesign
- New entity categorization system
- Enhanced module system
- New semantic properties structure
- Different validation API

#### Migration Steps
1. **No automatic migration** - schemas must be rewritten
2. Update entity structure to use new hierarchy
3. Migrate to new module format
4. Add semantic properties for AI optimization
5. Update validation code to use new API

#### Example Migration

**Old v1.0.0 format:**
```javascript
// v1.0.0 format (DEPRECATED)
{
  "type": "restaurant",
  "name": "Garden Bistro"
  // ... old format
}
```

**New v2.0.0 format:**
```javascript
// v2.0.0 format
{
  "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
  "@type": "Restaurant",
  "entityType": "restaurant",
  "entityCategory": "organization",
  "subcategory": "hospitality",
  "name": {
    "en": "Garden Bistro"
  },
  "description": {
    "en": "A delightful garden restaurant"
  }
  // ... new format
}
```

### ⚠️ Important Notes

- **Breaking Changes**: This version is completely incompatible with v1.0.0
- **No Migration Path**: Existing v1.0.0 schemas must be rewritten
- **Deprecation**: v1.0.0 is now deprecated and will not receive updates
- **Documentation**: All documentation refers to v2.0.0 format only

### 🔗 Resources

- **GitHub**: https://github.com/meta-aiml-org/SDK
- **Documentation**: https://meta-aiml.org/docs
- **Schema Examples**: Available in the repository
- **TypeScript Support**: Full type definitions included

---

## [1.0.0] - DEPRECATED

⚠️ **This version is deprecated and no longer supported.**

Version 1.0.0 has been completely superseded by v2.0.0 with a fundamentally different architecture.

### Deprecation Notice

- **End of Life**: December 31, 2025
- **Security Updates**: None planned
- **Bug Fixes**: None planned
- **Support**: Community support only

### Migration Required

All users of v1.0.0 must migrate to v2.0.0. Please refer to the migration guide above.

---

**For complete documentation and examples, visit our [website](https://meta-aiml.org/).**
