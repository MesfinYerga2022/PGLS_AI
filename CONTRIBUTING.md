# Contributing to Arcadis AI Platform

Thank you for your interest in contributing to the Arcadis AI Platform! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- Python 3.9 or higher
- Git
- GitHub account

### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Follow the setup instructions in [README_NEW.md](README_NEW.md)

## 🔄 Development Workflow

### 1. Create a Feature Branch
```bash
# Always start from the develop branch
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, readable code
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed

### 3. Commit Your Changes
We follow conventional commit messages:
```bash
git commit -m "feat(component): add new functionality

- Detailed description of changes
- Why the change was made
- Any breaking changes"
```

### Commit Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request
```bash
git push -u origin feature/your-feature-name
```

Then create a Pull Request from your feature branch to the `develop` branch.

## 📝 Code Style Guidelines

### Frontend (React/JavaScript)
- Use ESLint configuration provided
- Use functional components with hooks
- Follow Material-UI best practices
- Use TypeScript types where applicable
- Write meaningful component and variable names

### Backend (Python/FastAPI)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes
- Handle errors appropriately
- Use async/await for asynchronous operations

### General Guidelines
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable and function names
- Avoid code duplication

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
python -m pytest
```

### Test Requirements
- Unit tests for new functions/components
- Integration tests for new features
- All tests must pass before submitting PR
- Maintain or improve test coverage

## 📚 Documentation

- Update README.md if adding new features
- Add inline code documentation
- Update API documentation for backend changes
- Include examples for new functionality

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

Use the bug report template when creating issues.

## ✨ Feature Requests

When requesting features:
- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider alternative approaches
- Provide mockups or examples if helpful

Use the feature request template when creating issues.

## 🔍 Code Review Process

### For Contributors
- Ensure your PR follows the template
- Respond promptly to review feedback
- Keep PRs focused and reasonably sized
- Update documentation and tests as needed

### For Reviewers
- Be constructive and respectful
- Focus on code quality, performance, and maintainability
- Check for security issues
- Verify tests are comprehensive

## 🏗️ Architecture Guidelines

### Frontend Architecture
```
src/
├── components/        # Reusable UI components
├── features/         # Feature-specific components
├── context/          # React context providers
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── services/        # API services
└── assets/          # Static assets
```

### Backend Architecture
```
backend/
├── main.py          # FastAPI application
├── routers/         # API route handlers
├── models/          # Data models
├── services/        # Business logic
├── utils/           # Utility functions
└── tests/           # Test files
```

## 🚀 Deployment

- Features are deployed to development environment from `develop` branch
- Staging deployments from `staging` branch
- Production deployments from `main` branch
- All deployments are automated via GitHub Actions

## 📞 Getting Help

- Check existing issues and documentation first
- Join discussions in GitHub Discussions
- Contact maintainers via GitHub issues
- For Arcadis employees: Use internal communication channels

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Internal Arcadis recognition programs

## 📋 Checklist for Contributors

Before submitting your PR, ensure:
- [ ] Code follows style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR description is complete
- [ ] No merge conflicts exist
- [ ] All CI checks pass

Thank you for contributing to the Arcadis AI Platform! 🎉
