# Contributing to Pattern-Trainer Agent 🤝

Thank you for your interest in contributing to Pattern-Trainer Agent! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git
- MongoDB (optional for development)
- Google Gemini API key (for AI features)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/pattern-trainer-agent.git
   cd pattern-trainer-agent
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/pattern-trainer-agent.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# At minimum, you need:
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:server  # Backend on port 3000
npm run dev:next    # Frontend on port 3001
```

### 4. Verify Setup

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/api/health

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests and test coverage**
- 🔧 **Development tooling**

### Before You Start

1. **Check existing issues** - Look for similar issues or feature requests
2. **Create an issue** - For significant changes, create an issue first to discuss
3. **Assign yourself** - Comment on the issue to let others know you're working on it

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run the application
npm run dev

# Test the specific functionality you changed
# Ensure no regressions in existing features
```

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new algorithm pattern support

- Add support for trie data structure pattern
- Update pattern selection UI
- Add corresponding test cases
- Update documentation"
```

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ui): add dark mode toggle
fix(api): resolve memory leak in problem generation
docs(readme): update installation instructions
test(components): add unit tests for ChallengePanel
```

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 🔍 Pull Request Process

### PR Requirements

1. **Clear Description** - Explain what your PR does and why
2. **Link Issues** - Reference any related issues
3. **Screenshots** - For UI changes, include before/after screenshots
4. **Tests** - Ensure all tests pass
5. **Documentation** - Update docs if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] No regressions found

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs automatically
2. **Code Review** - Maintainers review your code
3. **Feedback** - Address any requested changes
4. **Approval** - Once approved, your PR will be merged

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** - Check if the issue already exists
2. **Check documentation** - Ensure it's not a configuration issue
3. **Try latest version** - Make sure you're using the latest code

### Issue Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Context
Any other relevant information
```

## 🎨 Code Style

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Prefer **const** over **let**
- Use **arrow functions** for callbacks
- Use **async/await** over promises

### React Components

- Use **functional components** with hooks
- Use **TypeScript interfaces** for props
- Follow **component naming conventions**
- Keep components **small and focused**
- Use **custom hooks** for reusable logic

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow **Notion-inspired design** principles
- Use **CSS custom properties** for theming
- Keep styles **component-scoped**

### Example Code Style

```typescript
// ✅ Good
interface ChallengePanelProps {
  patterns: Pattern[];
  selectedPattern: string;
  onPatternChange: (pattern: string) => void;
}

export default function ChallengePanel({
  patterns,
  selectedPattern,
  onPatternChange,
}: ChallengePanelProps) {
  const handlePatternSelect = useCallback((pattern: string) => {
    onPatternChange(pattern);
  }, [onPatternChange]);

  return (
    <div className="notion-card">
      {/* Component content */}
    </div>
  );
}

// ❌ Avoid
export default function ChallengePanel(props) {
  function handlePatternSelect(pattern) {
    props.onPatternChange(pattern);
  }
  // ...
}
```

## 🧪 Testing

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

### Writing Tests

```typescript
// Example unit test
import { render, screen, fireEvent } from '@testing-library/react';
import ChallengePanel from '@/components/ChallengePanel';

describe('ChallengePanel', () => {
  const mockPatterns = [
    { id: 'sliding_window', name: 'Sliding Window', description: 'Test' }
  ];

  it('renders pattern selection', () => {
    render(
      <ChallengePanel
        patterns={mockPatterns}
        selectedPattern=""
        onPatternChange={jest.fn()}
      />
    );
    
    expect(screen.getByText('Select Pattern')).toBeInTheDocument();
  });

  it('calls onPatternChange when pattern is selected', () => {
    const mockOnChange = jest.fn();
    render(
      <ChallengePanel
        patterns={mockPatterns}
        selectedPattern=""
        onPatternChange={mockOnChange}
      />
    );
    
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'sliding_window' }
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('sliding_window');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 Documentation

### Code Documentation

- Use **JSDoc** for functions and classes
- Include **type information** in comments
- Document **complex algorithms** and business logic
- Keep **README files** up to date

### Example Documentation

```typescript
/**
 * Generates a coding problem using AI for the specified pattern
 * @param pattern - The algorithmic pattern to generate a problem for
 * @param difficulty - The difficulty level (easy, medium, hard)
 * @param blind75Examples - Optional examples from Blind 75 for context
 * @returns Promise resolving to the generated problem
 */
async generateProblem(
  pattern: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  blind75Examples: Blind75Problem[] = []
): Promise<ProblemGenerationResult> {
  // Implementation
}
```

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Release notes prepared
- [ ] Tag created on GitHub

## 💡 Ideas for Contributions

### Good First Issues

- 🐛 Fix typos in documentation
- 🎨 Improve UI components
- 🧪 Add unit tests for existing components
- 📚 Improve code comments and documentation
- 🔧 Add development tooling

### Advanced Contributions

- ✨ New algorithmic patterns
- 🤖 AI model improvements
- 📊 Advanced analytics features
- 🔒 Security enhancements
- ⚡ Performance optimizations

## 🆘 Getting Help

### Resources

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Discord** - Real-time chat with the community
- **Documentation** - Comprehensive guides and API docs

### Contact

- **Maintainers**: @maintainer1, @maintainer2
- **Email**: contributors@patterntrainer.dev
- **Discord**: [Join our server](https://discord.gg/patterntrainer)

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** - Contributor list
- **CHANGELOG.md** - Release notes
- **GitHub** - Contributor statistics
- **Community** - Special recognition for significant contributions

---

**Thank you for contributing to Pattern-Trainer Agent! 🎉**

Your contributions help make coding interview preparation more accessible and effective for developers worldwide.
