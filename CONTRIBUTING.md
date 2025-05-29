# Contributing to @meta-aiml/parser

Thank you for your interest in contributing to the AIML Parser SDK! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/sdk.git
   cd sdk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📝 Development Workflow

### Code Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our style guide
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run type-check
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new functionality"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Open PR on GitHub
   ```

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes

Examples:
```bash
feat: add support for new entity type
fix: resolve validation error for modules
docs: update API documentation
test: add tests for parser functionality
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place tests in `__tests__/` directory
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

Example test:
```javascript
import { AIMLParser } from '../src/parser';

describe('AIMLParser', () => {
  let parser: AIMLParser;

  beforeEach(() => {
    parser = new AIMLParser();
  });

  it('should parse valid restaurant entity', async () => {
    const data = {
      "@context": "https://schemas.meta-aiml.org",
      "@type": "Restaurant",
      "entityType": "restaurant",
      "name": "Test Restaurant"
    };

    const result = await parser.parseEntity(data);

    expect(result.entityType).toBe('restaurant');
    expect(result.name).toBe('Test Restaurant');
  });

  it('should throw error for invalid data', async () => {
    await expect(parser.parseEntity(null))
      .rejects
      .toThrow('Invalid input data');
  });
});
```

## 📚 Documentation

### API Documentation

- Update JSDoc comments for public methods
- Include parameter types and descriptions
- Provide usage examples

Example:
```typescript
/**
 * Parse raw data into AIML entity
 * @param data - Raw entity data object
 * @param entityType - Optional entity type override
 * @returns Promise resolving to parsed AIML entity
 * @throws Error if data is invalid or parsing fails
 * @example
 * ```typescript
 * const entity = await parser.parseEntity({
 *   "@type": "Restaurant",
 *   "entityType": "restaurant",
 *   "name": "My Restaurant"
 * });
 * ```
 */
async parseEntity(data: any, entityType?: SchemaType): Promise<AIMLEntity>
```

### README Updates

When adding new features:
- Update installation instructions if needed
- Add examples for new functionality
- Update API reference section
- Add to feature list if significant

## 🎯 Types of Contributions

### 🐛 Bug Reports

Found a bug? Please create an issue with:

- **Clear title** describing the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Code sample** demonstrating the issue
- **Environment details** (Node.js version, browser, etc.)

### 💡 Feature Requests

Have an idea? Create an issue with:

- **Clear description** of the feature
- **Use case** explaining why it's needed
- **Proposed API** if applicable
- **Alternative solutions** considered

### 📖 Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add missing examples
- Improve API documentation
- Translate documentation

### 🚀 Code Contributions

Areas where we especially welcome contributions:

- **New entity type support**
- **Performance optimizations**
- **Browser compatibility improvements**
- **Additional validation features**
- **Module system enhancements**
- **TypeScript type improvements**

## 🔍 Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type annotations
- Use interfaces for object shapes
- Prefer `const` over `let` when possible

### Formatting

We use Prettier for code formatting:
```bash
npm run format
```

### Linting

We use ESLint for code quality:
```bash
npm run lint
npm run lint:fix
```

## 🔄 Release Process

Releases are handled by maintainers:

1. Version bump using semantic versioning
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to NPM automatically via GitHub Actions

## 🤝 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Be collaborative** and helpful
- **Be patient** with newcomers
- **Focus on constructive feedback**

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Spam or off-topic discussions
- Sharing private information without permission

## 📞 Getting Help

Need help contributing?

- 💬 Create a discussion on GitHub
- 📧 Email: sdk@meta-aiml.org
- 📖 Check our [documentation](https://meta-aiml.org/docs)

## 🏆 Recognition

Contributors will be:

- Listed in our CONTRIBUTORS.md file
- Mentioned in release notes for significant contributions
- Given credit in documentation for major features

## 📋 Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention
- [ ] PR description explains changes clearly

Thank you for contributing to AIML Parser! 🎉
