# Contributing to @meta-aiml/parser

Thank you for your interest in contributing to the AIML Parser SDK! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** if provided
3. **Provide detailed information** including:
   - SDK version
   - Node.js version
   - Operating system
   - Schema that caused the issue
   - Expected vs actual behavior
   - Steps to reproduce

### Suggesting Enhancements

We welcome suggestions for new features or improvements:

1. **Check existing feature requests** first
2. **Create a detailed enhancement request** with:
   - Use case description
   - Proposed solution
   - Alternative solutions considered
   - Expected benefits

### Contributing Code

#### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Git

#### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/SDK.git
cd SDK

# Install dependencies
npm install

# Run tests to ensure everything works
npm test
```

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test           # Run all tests
   npm run lint       # Check code style
   npm run build      # Test build process
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new validation feature"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

- **JavaScript ES6+**: Use modern JavaScript features
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use for code formatting
- **JSDoc**: Document all public methods and classes

### Testing

- **Unit Tests**: Required for all new features
- **Coverage**: Maintain minimum 80% code coverage
- **Test Cases**: Include both positive and negative test cases
- **Edge Cases**: Test boundary conditions and error scenarios

### Documentation

- **README**: Update if adding new features
- **JSDoc**: Document all public APIs
- **Examples**: Add examples for new functionality
- **CHANGELOG**: Update for all changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat: add new entity validation
fix: correct schema parsing error
docs: update API documentation
test: add tests for new feature
refactor: improve validation performance
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Test additions or modifications
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `style`: Code style changes
- `build`: Build system changes

## 🏗️ Project Structure

```
src/
├── index.js          # Main SDK file
├── index.d.ts        # TypeScript definitions
tests/
├── parser.test.js    # Test suite
examples/
├── basic-usage.js    # Usage examples
docs/
├── README.md         # Main documentation
├── CHANGELOG.md      # Version history
├── CONTRIBUTING.md   # This file
```

## 🧪 Testing Guidelines

### Writing Tests

```javascript
describe('Feature Name', () => {
  test('should handle valid input', () => {
    const result = parser.validate(validSchema);
    expect(result.isValid).toBe(true);
  });

  test('should handle invalid input', () => {
    const result = parser.validate(invalidSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
```

### Test Categories

- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test component interactions
- **Validation Tests**: Test schema validation logic
- **Performance Tests**: Test performance characteristics

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 📚 Documentation Guidelines

### API Documentation

Use JSDoc for all public methods:

```javascript
/**
 * Validate AIML schema
 * @param {string|Object} data - Schema to validate
 * @returns {AIMLValidationResult} Validation result
 * @example
 * const result = parser.validate(schema);
 * console.log(result.isValid);
 */
validate(data) {
  // Implementation
}
```

### Examples

Provide clear, runnable examples:

```javascript
// ✅ Good example
const parser = new AIMLParser();
const schema = {
  "@context": "https://schemas.meta-aiml.org/v2.0.0/context.jsonld",
  "entityType": "restaurant",
  // ... complete example
};
const result = parser.validate(schema);

// ❌ Incomplete example
const result = parser.validate(someSchema);
```

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Creating Releases

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create and push git tag
4. Publish to npm
5. Create GitHub release

## 🛡️ Security

### Reporting Security Issues

**Do not create public issues for security vulnerabilities.**

Instead:
1. Email security@meta-aiml.org
2. Include detailed information
3. Allow time for investigation
4. Coordinate disclosure timeline

### Security Guidelines

- No sensitive data in code or tests
- Validate all input parameters
- Use secure coding practices
- Keep dependencies updated

## 💬 Communication

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: security@meta-aiml.org for security issues

### Community Guidelines

- Be respectful and constructive
- Help others learn and grow
- Share knowledge and experience
- Follow the code of conduct

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ✅ Checklist for Contributors

Before submitting a pull request:

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Commit messages follow convention
- [ ] No breaking changes (or clearly documented)

## 🎉 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Invited to join the contributors team

Thank you for contributing to @meta-aiml/parser! 🚀
