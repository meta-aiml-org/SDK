/**
 * AIML Parser SDK v2.0.0 - Basic Usage Examples
 *
 * This file demonstrates basic usage patterns for the AIML Parser SDK.
 * Run with: node examples/basic-usage.js
 */

const AIMLParser = require('../src/index.js');

console.log('🚀 AIML Parser SDK v2.0.0 - Basic Usage Examples\n');

// Example 1: Basic validation
console.log('📋 Example 1: Basic Schema Validation');
console.log('=====================================\n');

const basicSchema = {
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
    "en": "A delightful garden restaurant featuring farm-to-table cuisine and seasonal ingredients sourced from local farms"
  },
  "url": "https://gardenbistro.com"
};

const parser = new AIMLParser();
const result = parser.validate(basicSchema);

if (result.isValid) {
  console.log(`✅ Schema is valid!`);
  console.log(`📊 Quality Score: ${result.score}/100`);
  console.log(`📈 Completeness: ${result.completeness}%`);
  console.log(`🏗️ Entity: ${result.entityInfo.entityType} (${result.entityInfo.entityCategory})`);
} else {
  console.log('❌ Schema validation failed');
  result.errors.forEach(error => {
    console.log(`   - ${error.field}: ${error.message}`);
  });
}

console.log('\n');

// Example 2: Advanced schema with modules
console.log('📋 Example 2: Advanced Schema with Modules');
console.log('==========================================\n');

const advancedSchema = {
  "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
  "@id": "https://techbazaar.com/entity",
  "@type": "Marketplace",
  "schemaVersion": "2.0.0",
  "entityType": "marketplace",
  "entityCategory": "product_offering",
  "subcategory": "ecommerce_platform",
  "name": {
    "en": "TechBazaar Global Marketplace",
    "es": "Mercado Global TechBazaar"
  },
  "description": {
    "en": "Leading B2B2C technology marketplace connecting vendors and buyers worldwide with cutting-edge AI recommendations"
  },
  "url": "https://techbazaar.com",
  "shortDescription": "Global technology marketplace platform",
  "properties": {
    "vendorCount": 50000,
    "activeListings": 2500000,
    "supportedCountries": 195
  },
  "modules": {
    "payments": {
      "version": "2.0.0",
      "enabled": true,
      "providers": ["stripe", "paypal", "apple_pay"]
    },
    "search": {
      "version": "2.0.0",
      "enabled": true,
      "features": ["semantic_search", "autocomplete", "faceted_search"]
    },
    "recommendations": {
      "version": "2.0.0",
      "enabled": true,
      "algorithms": ["collaborative_filtering", "content_based", "hybrid_ml"]
    },
    "multilingual": {
      "version": "2.0.0",
      "enabled": true,
      "supported_languages": ["en", "es", "fr", "de", "zh"]
    }
  },
  "semanticProperties": {
    "subjectiveQualities": {
      "userExperience": {
        "rating": 0.92,
        "description": "Highly intuitive interface with excellent mobile experience",
        "confidence": 0.95
      },
      "trustworthiness": {
        "rating": 0.89,
        "description": "Strong vendor verification and buyer protection"
      }
    },
    "intentAlignment": {
      "purchase": {
        "alignment": 0.95,
        "description": "Optimized for seamless purchasing experience"
      },
      "discovery": {
        "alignment": 0.88,
        "description": "Advanced search and recommendation capabilities"
      }
    }
  },
  "intentContext": {
    "primaryIntents": ["purchase", "compare", "discover"],
    "userJourney": ["browse", "search", "compare", "purchase", "track"]
  },
  "appliedContexts": ["geographical_context", "regulatory_context"]
};

const advancedResult = parser.validate(advancedSchema);

console.log(`📊 Advanced Schema Results:`);
console.log(`   Valid: ${advancedResult.isValid ? '✅' : '❌'}`);
console.log(`   Score: ${advancedResult.score}/100`);
console.log(`   Completeness: ${advancedResult.completeness}%`);
console.log(`   Performance: ${advancedResult.performance.complexity} complexity`);
console.log(`   Schema Size: ${advancedResult.performance.schemaSize} bytes`);
console.log(`   Modules: ${advancedResult.performance.moduleCount}`);

if (advancedResult.entityInfo) {
  console.log(`   Entity Info:`);
  console.log(`     - Type: ${advancedResult.entityInfo.entityType}`);
  console.log(`     - Category: ${advancedResult.entityInfo.entityCategory}`);
  console.log(`     - Subcategory: ${advancedResult.entityInfo.subcategory}`);
  console.log(`     - Modules: ${advancedResult.entityInfo.modules.join(', ')}`);
  console.log(`     - Semantic Properties: ${advancedResult.entityInfo.hasSemanticProperties ? '✅' : '❌'}`);
  console.log(`     - Intent Context: ${advancedResult.entityInfo.hasIntentContext ? '✅' : '❌'}`);
}

console.log('\n');

// Example 3: Error handling
console.log('📋 Example 3: Error Handling');
console.log('============================\n');

const invalidSchema = {
  "@context": "https://wrong-context.com",
  "entityType": "invalid_type",
  "entityCategory": "invalid_category",
  "name": "Missing description and other required fields"
};

const errorResult = parser.validate(invalidSchema);

console.log(`❌ Invalid Schema Results:`);
console.log(`   Valid: ${errorResult.isValid}`);
console.log(`   Score: ${errorResult.score}/100`);

console.log(`\n🚨 Errors (${errorResult.errors.length}):`);
errorResult.errors.forEach((error, index) => {
  console.log(`   ${index + 1}. ${error.field}: ${error.message}`);
  if (error.suggestion) {
    console.log(`      💡 Suggestion: ${error.suggestion}`);
  }
});

console.log(`\n⚠️  Warnings (${errorResult.warnings.length}):`);
errorResult.warnings.forEach((warning, index) => {
  console.log(`   ${index + 1}. ${warning.field}: ${warning.message}`);
});

console.log('\n');

// Example 4: Static methods
console.log('📋 Example 4: Static Methods and Utilities');
console.log('==========================================\n');

console.log(`📌 AIML Version: ${AIMLParser.getVersion()}`);
console.log(`📌 Total Entity Types: ${AIMLParser.getEntityTypes().length}`);
console.log(`📌 Categories: ${AIMLParser.getEntityCategories().join(', ')}`);
console.log(`📌 Available Modules: ${AIMLParser.getModules().length}`);
console.log(`📌 Available Contexts: ${AIMLParser.getContexts().length}`);

console.log(`\n🏗️ Entity Types by Category:`);
const categories = AIMLParser.getEntityCategories();
const allTypes = AIMLParser.getEntityTypes();

categories.forEach(category => {
  // This is a simplified way to show types by category
  // In a real app, you might want to access the internal mapping
  console.log(`   ${category}: [multiple types available]`);
});

console.log('\n');

// Example 5: Factory methods
console.log('📋 Example 5: Factory Methods');
console.log('=============================\n');

// Production parser (strict mode)
const prodParser = AIMLParser.createProduction();
console.log('🏭 Production parser created (strict mode)');

// Development parser (debug mode)
const devParser = AIMLParser.createDevelopment();
console.log('🔧 Development parser created (debug mode)');

// Quick static validation
const quickResult = AIMLParser.validate(basicSchema);
console.log(`⚡ Quick static validation: ${quickResult.isValid ? '✅' : '❌'}`);

console.log('\n');

// Example 6: Convenience methods
console.log('📋 Example 6: Convenience Methods');
console.log('=================================\n');

// Quick validation check
const isValidSchema = parser.isValid(basicSchema);
console.log(`🔍 Quick validation check: ${isValidSchema ? '✅' : '❌'}`);

// Get entity info only
const entityInfo = parser.getEntityInfo(advancedSchema);
if (entityInfo) {
  console.log(`📋 Entity Info for advanced schema:`);
  console.log(`   Type: ${entityInfo.entityType}`);
  console.log(`   Category: ${entityInfo.entityCategory}`);
  console.log(`   Modules: ${entityInfo.modules.length}`);
}

console.log('\n🎉 Examples completed successfully!\n');

// Example output information
console.log('💡 Try these examples:');
console.log('   - Modify the schemas above to see different validation results');
console.log('   - Add or remove modules to see how it affects scoring');
console.log('   - Try different entity types and categories');
console.log('   - Experiment with semantic properties for AI optimization');
console.log('\n📚 For more examples, check the website:');
console.log('   https://meta-aiml.org/examples/\n');
