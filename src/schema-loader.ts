import type { SchemaType } from './types';

export class SchemaLoader {
  private cache: Map<string, any> = new Map();
  private baseUrl: string;

  constructor(baseUrl = 'https://schemas.meta-aiml.org') {
    this.baseUrl = baseUrl;
  }

  /**
   * Load entity schema
   */
  async loadEntitySchema(entityType: SchemaType): Promise<any> {
    const cacheKey = `entity_${entityType}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const url = `${this.baseUrl}/entity/${entityType}.json`;
    const schema = await this.fetchSchema(url);

    this.cache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Load component schema
   */
  async loadComponentSchema(componentName: string): Promise<any> {
    const cacheKey = `component_${componentName}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const url = `${this.baseUrl}/components/${componentName}.json`;
    const schema = await this.fetchSchema(url);

    this.cache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Load module schema
   */
  async loadModuleSchema(moduleName: string): Promise<any> {
    const cacheKey = `module_${moduleName}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const url = `${this.baseUrl}/templates/module/${moduleName}.json`;
    const schema = await this.fetchSchema(url);

    this.cache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Load schema from URL
   */
  async loadSchemaFromUrl(url: string): Promise<any> {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const schema = await this.fetchSchema(url);
    this.cache.set(url, schema);

    return schema;
  }

  /**
   * Load schema registry
   */
  async loadRegistry(): Promise<any> {
    const cacheKey = 'registry';

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const url = `${this.baseUrl}/registry.json`;
    const registry = await this.fetchSchema(url);

    this.cache.set(cacheKey, registry);
    return registry;
  }

  /**
   * Get available entity types
   */
  async getAvailableEntityTypes(): Promise<SchemaType[]> {
    try {
      const registry = await this.loadRegistry();
      return registry.entities ? Object.keys(registry.entities) as SchemaType[] : [];
    } catch (error) {
      // Fallback to known types
      return [
        'restaurant',
        'hotel',
        'ecommerce_store',
        'organization',
        'product',
        'service',
        'blog',
        'clinic',
        'dating_platform',
        'education_platform',
        'gaming_platform',
        'marketplace',
        'news',
        'social_network',
        'streaming_platform'
      ];
    }
  }

  /**
   * Get available modules
   */
  async getAvailableModules(): Promise<string[]> {
    try {
      const registry = await this.loadRegistry();
      return registry.modules ? Object.keys(registry.modules) : [];
    } catch (error) {
      // Fallback to known modules
      return [
        'auth',
        'payments',
        'notifications',
        'location',
        'search',
        'security',
        'multilingual',
        'compliance',
        'logistics',
        'recommendations',
        'streaming',
        'subscription',
        'user_management',
        'warranty'
      ];
    }
  }

  /**
   * Preload schemas for better performance
   */
  async preloadSchemas(entityTypes: SchemaType[]): Promise<void> {
    const promises = entityTypes.map(type =>
      this.loadEntitySchema(type).catch(error => {
        console.warn(`Failed to preload schema for ${type}:`, error);
      })
    );

    await Promise.all(promises);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Set base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    this.cache.clear(); // Clear cache when base URL changes
  }

  /**
   * Fetch schema from URL
   */
  private async fetchSchema(url: string): Promise<any> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const schema = await response.json();

      // Validate basic schema structure
      if (!schema || typeof schema !== 'object') {
        throw new Error('Invalid schema format');
      }

      return schema;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error loading schema from ${url}`);
      }
      throw new Error(`Failed to load schema from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
