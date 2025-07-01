# Professional Git Branching Strategy for PGLS AI Platform

## 🌿 Branch Structure

### Main Branches
- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`staging`** - Pre-production testing

### Feature Branches
- **`feature/authentication`** - Azure AD integration and MSAL setup
- **`feature/data-upload`** - File upload and data processing
- **`feature/data-visualization`** - Charts and visualization components
- **`feature/ai-analytics`** - OpenAI integration and NLQ
- **`feature/reporting`** - Export and reporting functionality
- **`feature/admin-panel`** - User management and admin features
- **`feature/ui-ux`** - Material-UI theming and responsive design

### Support Branches
- **`hotfix/`** - Critical production fixes
- **`release/`** - Release preparation
- **`bugfix/`** - Non-critical bug fixes

## 🚀 Setup Commands

### 1. Initialize Git Flow
```bash
# Navigate to your project directory
cd "c:\Users\yergam1481\OneDrive - ARCADIS\Documents\Arcadis AI\pgls_ai"

# Initialize git if not already done
git init

# Add remote origin (replace with your actual repo URL)
git remote add origin https://github.com/MesfinYerga2022/PGLS_AI.git

# Create and switch to main branch
git checkout -b main

# Add all files and make initial commit
git add .
git commit -m "Initial commit: Arcadis AI Platform setup"

# Push to main branch
git push -u origin main
```

### 2. Create Development Branch
```bash
# Create and switch to develop branch
git checkout -b develop
git push -u origin develop
```

### 3. Create Staging Branch
```bash
# Create and switch to staging branch
git checkout -b staging
git push -u origin staging
```

### 4. Create Feature Branches
```bash
# Authentication feature
git checkout develop
git checkout -b feature/authentication
git push -u origin feature/authentication

# Data upload feature
git checkout develop
git checkout -b feature/data-upload
git push -u origin feature/data-upload

# Data visualization feature
git checkout develop
git checkout -b feature/data-visualization
git push -u origin feature/data-visualization

# AI analytics feature
git checkout develop
git checkout -b feature/ai-analytics
git push -u origin feature/ai-analytics

# Reporting feature
git checkout develop
git checkout -b feature/reporting
git push -u origin feature/reporting

# Admin panel feature
git checkout develop
git checkout -b feature/admin-panel
git push -u origin feature/admin-panel

# UI/UX feature
git checkout develop
git checkout -b feature/ui-ux
git push -u origin feature/ui-ux
```

## 🔄 Workflow Process

### Working on Features
1. **Start a new feature:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Work on your feature:**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: add specific functionality"
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request:**
   - From `feature/your-feature-name` to `develop`
   - Request code review
   - Merge after approval

### Release Process
1. **Create release branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. **Testing and bug fixes:**
   ```bash
   # Make final adjustments
   git commit -m "fix: final release preparations"
   git push origin release/v1.0.0
   ```

3. **Merge to staging for testing:**
   ```bash
   git checkout staging
   git merge release/v1.0.0
   git push origin staging
   ```

4. **Deploy to production:**
   ```bash
   git checkout main
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin main --tags
   ```

### Hotfix Process
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
# Make fix
git commit -m "hotfix: resolve critical issue"
git push origin hotfix/critical-fix
# Create PR to main and develop
```

## 📋 Commit Message Convention

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): implement Azure AD integration"
git commit -m "fix(charts): resolve scatter plot rendering issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): apply consistent Material-UI theming"
```

## 🔒 Branch Protection Rules

### Recommended Settings for GitHub:
1. **Main Branch:**
   - Require pull request reviews
   - Require status checks
   - Restrict pushes to admins only

2. **Develop Branch:**
   - Require pull request reviews
   - Require up-to-date branches

3. **Feature Branches:**
   - Allow direct pushes for development
   - Require clean merge to develop

## 🚀 Deployment Strategy

### Environments
- **Development**: Auto-deploy from `develop` branch
- **Staging**: Auto-deploy from `staging` branch
- **Production**: Manual deploy from `main` branch

### CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

## 📚 Best Practices

1. **Always work on feature branches**
2. **Keep commits small and focused**
3. **Write descriptive commit messages**
4. **Regularly sync with develop branch**
5. **Use pull requests for code review**
6. **Tag releases with semantic versioning**
7. **Keep branches up to date**
8. **Delete merged feature branches**

## 🔧 Useful Git Commands

```bash
# View all branches
git branch -a

# Switch to branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Merge branch
git merge branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# View commit history
git log --oneline --graph

# Sync with remote
git fetch --all
git pull origin branch-name

# Stash changes
git stash
git stash pop
```

---

**Next Steps:**
1. Run the setup commands in order
2. Set up branch protection rules on GitHub
3. Configure CI/CD pipeline
4. Start working on features using the defined workflow
