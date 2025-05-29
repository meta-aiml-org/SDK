# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-XX

### Added
- Initial release of @meta-aiml/parser SDK
- `AIMLParser` class for parsing AIML entities
- `AIMLValidator` class for schema validation
- `SchemaLoader` class for loading schemas from remote URLs
- `ModuleProcessor` class for processing AIML modules
- Full TypeScript support with comprehensive type definitions
- Support for all AIML entity types (restaurant, hotel, ecommerce_store, etc.)
- Browser compatibility with UMD builds
- Auto-detection of entity types from data
- Module system support with validation
- Form generation capabilities for browser environments
- Comprehensive error handling and validation reporting
- Schema caching for improved performance
- Support for JSON Schema Draft 2020-12

### Features
- **Entity Parsing**: Parse raw data into typed AIML entities
- **Schema Validation**: Validate entities against JSON Schema definitions
- **Module Processing**: Handle AIML module configurations
- **Type Safety**: Full TypeScript definitions for all entity types
- **Browser Support**: Works in both Node.js and browser environments
- **Performance**: Schema caching and lazy loading
- **Developer Experience**: Rich error messages and debugging support

### Supported Entity Types
- `restaurant` - Restaurant entities
- `hotel` - Hotel and lodging entities
- `ecommerce_store` - E-commerce store entities
- `organization` - Organization entities
- `product` - Product entities
- `service` - Service entities
- `blog` - Blog and content entities
- `clinic` - Medical clinic entities
- `education_platform` - Educational platform entities
- `gaming_platform` - Gaming platform entities
- `marketplace` - Marketplace entities
- `news` - News organization entities
- `social_network` - Social network entities
- `streaming_platform` - Streaming platform entities

### API
- `AIMLParser.parseEntity()` - Parse entity data
- `AIMLParser.extractModules()` - Extract modules from entities
- `AIMLParser.validate()` - Validate entities
- `AIMLParser.generateForm()` - Generate HTML forms (browser)
- `AIMLValidator.validate()` - Validate AIML entities
- `AIMLValidator.validateEntity()` - Validate against specific schema
- `SchemaLoader.loadEntitySchema()` - Load entity schemas
- `SchemaLoader.loadModuleSchema()` - Load module schemas
- `ModuleProcessor.processModules()` - Process module configurations

[Unreleased]: https://github.com/meta-aiml/sdk/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/meta-aiml/sdk/releases/tag/v1.0.0
