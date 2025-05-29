import { AIMLValidator } from './validator';
import { SchemaLoader } from './schema-loader';
import { ModuleProcessor } from './module-processor';
import type {
  AIMLEntity,
  ParserOptions,
  SchemaType,
  ValidationResult,
  AIMLModule
} from './types';

export class AIMLParser {
  private validator: AIMLValidator;
  private schemaLoader: SchemaLoader;
  private moduleProcessor: ModuleProcessor;
  private options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.options = {
      autoDetectType: true,
      processModules: true,
      validateOnParse: true,
      ...options
    };

    this.validator = new AIMLValidator();
    this.schemaLoader = new SchemaLoader();
    this.moduleProcessor = new ModuleProcessor();
  }

  /**
   * Parse raw data into AIML entity
   */
  async parseEntity(data: any, entityType?: SchemaType): Promise<AIMLEntity> {
    // Validate input
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input data: must be an object');
    }

    // Detect or use provided entity type
    const detectedType = entityType || this.detectEntityType(data);
    if (!detectedType) {
      throw new Error('Could not detect entity type. Please specify entityType parameter.');
    }

    // Validate if enabled
    if (this.options.validateOnParse) {
      const validation = await this.validator.validateEntity(data, detectedType);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }
    }

    // Create base entity
    const entity: AIMLEntity = {
      '@context': data['@context'] || 'https://schemas.meta-aiml.org',
      '@id': data['@id'] || this.generateEntityId(detectedType, data.name),
      '@type': data['@type'] || this.capitalizeType(detectedType),
      entityType: detectedType,
      name: data.name,
      ...data
    };

    // Process modules if enabled
    if (this.options.processModules && data.modules) {
      entity.modules = await this.moduleProcessor.processModules(data.modules);
    }

    return entity;
  }

  /**
   * Extract modules from entity
   */
  extractModules(entity: AIMLEntity): AIMLModule[] {
    if (!entity.modules) {
      return [];
    }

    return entity.modules.filter((module): module is AIMLModule => {
      return typeof module === 'object' &&
             module !== null &&
             'moduleType' in module;
    });
  }

  /**
   * Validate entity
   */
  async validate(entity: AIMLEntity): Promise<ValidationResult> {
    return this.validator.validate(entity);
  }

  /**
   * Generate form configuration from entity type
   */
  async generateFormConfig(entityType: SchemaType): Promise<any> {
    const schema = await this.schemaLoader.loadEntitySchema(entityType);
    return this.convertSchemaToFormConfig(schema);
  }

  /**
   * Generate HTML form from entity type
   */
  generateForm(selector: string, entityType?: SchemaType): void {
    if (typeof document === 'undefined') {
      throw new Error('generateForm can only be used in browser environment');
    }

    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    const type = entityType || this.options.entityType;
    if (!type) {
      throw new Error('Entity type must be specified');
    }

    // Generate form HTML
    this.generateFormConfig(type).then(config => {
      element.innerHTML = this.renderForm(config);
      this.attachFormHandlers(element, config);
    }).catch(error => {
      element.innerHTML = `<div class="error">Failed to generate form: ${error.message}</div>`;
    });
  }

  /**
   * Detect entity type from data
   */
  private detectEntityType(data: any): SchemaType | null {
    if (!this.options.autoDetectType) {
      return null;
    }

    // Check explicit entityType
    if (data.entityType) {
      return data.entityType as SchemaType;
    }

    // Check @type
    if (data['@type']) {
      const typeMap: Record<string, SchemaType> = {
        'Restaurant': 'restaurant',
        'Hotel': 'hotel',
        'LodgingBusiness': 'hotel',
        'Store': 'ecommerce_store',
        'OnlineStore': 'ecommerce_store',
        'Organization': 'organization',
        'Product': 'product'
      };

      return typeMap[data['@type']] || null;
    }

    // Heuristic detection based on properties
    if (data.cuisine || data.menu) return 'restaurant';
    if (data.rooms || data.amenities) return 'hotel';
    if (data.products || data.categories) return 'ecommerce_store';
    if (data.posts || data.articles) return 'blog';

    return null;
  }

  /**
   * Generate entity ID
   */
  private generateEntityId(entityType: SchemaType, name?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const safeName = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'entity';

    return `urn:aiml:${entityType}:${safeName}-${timestamp}-${randomId}`;
  }

  /**
   * Capitalize entity type for @type
   */
  private capitalizeType(entityType: SchemaType): string {
    const typeMap: Record<SchemaType, string> = {
      'restaurant': 'Restaurant',
      'hotel': 'Hotel',
      'ecommerce_store': 'OnlineStore',
      'organization': 'Organization',
      'product': 'Product',
      'service': 'Service',
      'blog': 'Blog',
      'clinic': 'MedicalClinic',
      'dating_platform': 'SocialNetwork',
      'education_platform': 'EducationalOrganization',
      'gaming_platform': 'SoftwareApplication',
      'marketplace': 'OnlineStore',
      'news': 'NewsMediaOrganization',
      'social_network': 'SocialNetwork',
      'streaming_platform': 'BroadcastService'
    };

    return typeMap[entityType] || entityType.charAt(0).toUpperCase() + entityType.slice(1);
  }

  /**
   * Convert JSON Schema to form configuration
   */
  private convertSchemaToFormConfig(schema: any): any {
    const config = {
      title: schema.title || 'Entity Form',
      description: schema.description,
      fields: []
    };

    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        if (typeof prop === 'object' && prop !== null) {
          config.fields.push(this.convertPropertyToField(key, prop as any));
        }
      }
    }

    return config;
  }

  /**
   * Convert schema property to form field
   */
  private convertPropertyToField(name: string, property: any): any {
    const field: any = {
      name,
      label: property.title || name,
      description: property.description,
      required: false // Will be set by parent schema
    };

    switch (property.type) {
      case 'string':
        field.type = property.format === 'email' ? 'email' :
                   property.format === 'uri' ? 'url' :
                   property.maxLength && property.maxLength > 100 ? 'textarea' : 'text';
        field.maxLength = property.maxLength;
        field.pattern = property.pattern;
        break;

      case 'number':
      case 'integer':
        field.type = 'number';
        field.minimum = property.minimum;
        field.maximum = property.maximum;
        break;

      case 'boolean':
        field.type = 'checkbox';
        break;

      case 'array':
        field.type = 'array';
        field.items = property.items;
        break;

      default:
        field.type = 'text';
    }

    if (property.enum) {
      field.type = 'select';
      field.options = property.enum.map((value: any) => ({
        value,
        label: value
      }));
    }

    return field;
  }

  /**
   * Render form HTML
   */
  private renderForm(config: any): string {
    let html = `
      <form class="aiml-form">
        <h2>${config.title}</h2>
        ${config.description ? `<p class="description">${config.description}</p>` : ''}
    `;

    for (const field of config.fields) {
      html += this.renderField(field);
    }

    html += `
        <button type="submit">Generate AIML</button>
      </form>
    `;

    return html;
  }

  /**
   * Render individual form field
   */
  private renderField(field: any): string {
    const required = field.required ? 'required' : '';
    const fieldId = `field-${field.name}`;

    let input = '';
    switch (field.type) {
      case 'textarea':
        input = `<textarea id="${fieldId}" name="${field.name}" ${required}></textarea>`;
        break;

      case 'select':
        const options = field.options.map((opt: any) =>
          `<option value="${opt.value}">${opt.label}</option>`
        ).join('');
        input = `<select id="${fieldId}" name="${field.name}" ${required}>${options}</select>`;
        break;

      case 'checkbox':
        input = `<input type="checkbox" id="${fieldId}" name="${field.name}">`;
        break;

      default:
        input = `<input type="${field.type}" id="${fieldId}" name="${field.name}" ${required}>`;
    }

    return `
      <div class="field">
        <label for="${fieldId}">${field.label}</label>
        ${input}
        ${field.description ? `<small>${field.description}</small>` : ''}
      </div>
    `;
  }

  /**
   * Attach form event handlers
   */
  private attachFormHandlers(element: Element, config: any): void {
    const form = element.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data: any = {};

      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      try {
        const entity = await this.parseEntity(data);
        this.dispatchFormResult(element, { success: true, entity });
      } catch (error) {
        this.dispatchFormResult(element, {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Dispatch form result event
   */
  private dispatchFormResult(element: Element, result: any): void {
    const event = new CustomEvent('aiml-form-result', {
      detail: result,
      bubbles: true
    });
    element.dispatchEvent(event);
  }
}
