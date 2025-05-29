import { SchemaLoader } from './schema-loader';
import type { AIMLModule, ModuleConfiguration } from './types';

export class ModuleProcessor {
  private schemaLoader: SchemaLoader;
  private moduleCache: Map<string, any> = new Map();

  constructor(schemaLoader?: SchemaLoader) {
    this.schemaLoader = schemaLoader || new SchemaLoader();
  }

  /**
   * Process modules configuration
   */
  async processModules(modules: any[]): Promise<AIMLModule[]> {
    const processedModules: AIMLModule[] = [];

    for (const module of modules) {
      try {
        const processed = await this.processModule(module);
        processedModules.push(processed);
      } catch (error) {
        console.warn(`Failed to process module:`, module, error);
        // Add module with error flag
        processedModules.push({
          moduleType: module.moduleType || 'unknown',
          version: module.version || '1.0.0',
          required: false,
          properties: {
            ...module,
            _error: error instanceof Error ? error.message : 'Processing failed'
          }
        });
      }
    }

    return processedModules;
  }

  /**
   * Process individual module
   */
  async processModule(module: any): Promise<AIMLModule> {
    // Handle $ref modules
    if (module.$ref) {
      return this.processRefModule(module);
    }

    // Handle inline modules
    if (module.moduleType) {
      return this.processInlineModule(module);
    }

    throw new Error('Module must have either $ref or moduleType property');
  }

  /**
   * Process module with $ref
   */
  private async processRefModule(module: any): Promise<AIMLModule> {
    const schema = await this.loadModuleSchema(module.$ref);

    return {
      moduleType: this.extractModuleTypeFromRef(module.$ref),
      version: module.version || schema.version || '1.0.0',
      required: module.required || false,
      properties: {
        ...schema.properties,
        ...module.properties,
        $ref: module.$ref
      }
    };
  }

  /**
   * Process inline module
   */
  private processInlineModule(module: any): AIMLModule {
    return {
      moduleType: module.moduleType,
      version: module.version || '1.0.0',
      required: module.required || false,
      properties: module.properties || {}
    };
  }

  /**
   * Load module schema
   */
  private async loadModuleSchema(ref: string): Promise<any> {
    if (this.moduleCache.has(ref)) {
      return this.moduleCache.get(ref);
    }

    let schema: any;

    if (ref.startsWith('/')) {
      // Relative path - use schema loader
      const moduleName = this.extractModuleTypeFromRef(ref);
      schema = await this.schemaLoader.loadModuleSchema(moduleName);
    } else if (ref.startsWith('http')) {
      // Absolute URL
      schema = await this.schemaLoader.loadSchemaFromUrl(ref);
    } else {
      // Assume it's a module name
      schema = await this.schemaLoader.loadModuleSchema(ref);
    }

    this.moduleCache.set(ref, schema);
    return schema;
  }

  /**
   * Extract module type from $ref path
   */
  private extractModuleTypeFromRef(ref: string): string {
    // Extract from paths like "/schemas/templates/module/auth.json"
    const match = ref.match(/\/([^\/]+)\.json$/);
    return match ? match[1] : ref;
  }

  /**
   * Validate module configuration
   */
  async validateModuleConfig(config: ModuleConfiguration): Promise<boolean> {
    try {
      // Check if module type exists
      const availableModules = await this.schemaLoader.getAvailableModules();
      if (!availableModules.includes(config.moduleType)) {
        return false;
      }

      // Load and validate against schema
      const schema = await this.schemaLoader.loadModuleSchema(config.moduleType);

      // Basic validation - could be enhanced with JSON Schema validation
      if (schema.required) {
        for (const requiredField of schema.required) {
          if (!(requiredField in config.config)) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get module dependencies
   */
  async getModuleDependencies(moduleType: string): Promise<string[]> {
    try {
      const schema = await this.schemaLoader.loadModuleSchema(moduleType);
      return schema.dependencies || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Resolve module dependencies
   */
  async resolveModuleDependencies(modules: string[]): Promise<string[]> {
    const resolved = new Set<string>();
    const queue = [...modules];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (resolved.has(current)) {
        continue;
      }

      resolved.add(current);

      try {
        const dependencies = await this.getModuleDependencies(current);
        for (const dep of dependencies) {
          if (!resolved.has(dep)) {
            queue.push(dep);
          }
        }
      } catch (error) {
        console.warn(`Failed to resolve dependencies for module ${current}:`, error);
      }
    }

    return Array.from(resolved);
  }

  /**
   * Check module compatibility
   */
  async checkModuleCompatibility(modules: string[]): Promise<{
    compatible: boolean;
    conflicts: string[];
    warnings: string[];
  }> {
    const result = {
      compatible: true,
      conflicts: [] as string[],
      warnings: [] as string[]
    };

    // Load all module schemas
    const schemas: Record<string, any> = {};
    for (const moduleType of modules) {
      try {
        schemas[moduleType] = await this.schemaLoader.loadModuleSchema(moduleType);
      } catch (error) {
        result.warnings.push(`Could not load schema for module: ${moduleType}`);
      }
    }

    // Check for conflicts
    for (let i = 0; i < modules.length; i++) {
      for (let j = i + 1; j < modules.length; j++) {
        const moduleA = modules[i];
        const moduleB = modules[j];

        const schemaA = schemas[moduleA];
        const schemaB = schemas[moduleB];

        if (schemaA && schemaB) {
          // Check for conflicting properties
          if (schemaA.conflicts && schemaA.conflicts.includes(moduleB)) {
            result.conflicts.push(`${moduleA} conflicts with ${moduleB}`);
            result.compatible = false;
          }

          if (schemaB.conflicts && schemaB.conflicts.includes(moduleA)) {
            result.conflicts.push(`${moduleB} conflicts with ${moduleA}`);
            result.compatible = false;
          }
        }
      }
    }

    return result;
  }

  /**
   * Get module recommendations
   */
  async getModuleRecommendations(entityType: string): Promise<string[]> {
    try {
      const entitySchema = await this.schemaLoader.loadEntitySchema(entityType as any);
      return entitySchema.recommendedModules || [];
    } catch (error) {
      // Return common modules as fallback
      return ['auth', 'security'];
    }
  }

  /**
   * Clear module cache
   */
  clearCache(): void {
    this.moduleCache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.moduleCache.size;
  }
}
