# GitHub Branch Protection Setup Guide

## 🔒 Setting Up Branch Protection Rules

After creating your branches, you'll need to set up protection rules on GitHub to maintain code quality and prevent accidental changes to important branches.

## 📋 Step-by-Step Instructions

### 1. Access Repository Settings
1. Go to your repository: https://github.com/MesfinYerga2022/PGLS_AI
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar

### 2. Protect Main Branch

Click **Add rule** and configure:

**Branch name pattern:** `main`

**Protection Settings:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Search and add: `Frontend CI/CD`, `Backend CI/CD`, `Security & Quality`
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits**
- ✅ **Require linear history**
- ✅ **Include administrators**
- ✅ **Restrict pushes that create files**
- ✅ **Allow force pushes: Everyone** (❌ Disabled)
- ✅ **Allow deletions** (❌ Disabled)

### 3. Protect Develop Branch

Click **Add rule** and configure:

**Branch name pattern:** `develop`

**Protection Settings:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
  - ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Add: `Frontend CI/CD`, `Backend CI/CD`
- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators**

### 4. Protect Staging Branch

Click **Add rule** and configure:

**Branch name pattern:** `staging`

**Protection Settings:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
- ✅ **Require status checks to pass before merging**
  - Add: `Frontend CI/CD`, `Backend CI/CD`, `Security & Quality`
- ✅ **Include administrators**

### 5. Protect Release Branches

Click **Add rule** and configure:

**Branch name pattern:** `release/*`

**Protection Settings:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `2`
- ✅ **Require status checks to pass before merging**
- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators**

## 🔧 Additional GitHub Settings

### Repository Settings

1. **General Settings**
   - ✅ Allow merge commits
   - ✅ Allow squash merging
   - ❌ Allow rebase merging
   - ✅ Always suggest updating pull request branches
   - ✅ Allow auto-merge
   - ✅ Automatically delete head branches

2. **Security Settings**
   - Go to **Settings** → **Security & analysis**
   - ✅ Enable **Dependency graph**
   - ✅ Enable **Dependabot alerts**
   - ✅ Enable **Dependabot security updates**
   - ✅ Enable **Secret scanning**

### 3. Collaborator Permissions

1. Go to **Settings** → **Manage access**
2. Set appropriate permissions:
   - **Admin**: Lead developers, DevOps team
   - **Write**: Core development team
   - **Read**: Stakeholders, reviewers

## 📝 Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## 📋 Pull Request Description

### What changes does this PR introduce?
- [ ] Feature implementation
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement
- [ ] Other (specify): ___________

### 🔗 Related Issues
Closes #issue_number

### 📸 Screenshots (if applicable)
<!-- Add screenshots or GIFs demonstrating the changes -->

### ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated
- [ ] No breaking changes introduced
- [ ] All CI checks pass

### 🧪 Testing
<!-- Describe how you tested these changes -->

### 📚 Additional Notes
<!-- Any additional information for reviewers -->

### 🔍 Review Focus Areas
<!-- Highlight specific areas where you want focused review -->
```

## 🏷️ Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**🐛 Bug Description**
A clear and concise description of what the bug is.

**🔄 Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**✅ Expected Behavior**
A clear and concise description of what you expected to happen.

**📸 Screenshots**
If applicable, add screenshots to help explain your problem.

**💻 Environment**
- OS: [e.g. Windows 10, macOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**📋 Additional Context**
Add any other context about the problem here.
```

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**🚀 Feature Description**
A clear and concise description of what you want to happen.

**💭 Motivation**
Why is this feature needed? What problem does it solve?

**📋 Acceptance Criteria**
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

**🎨 Mockups/Examples**
If applicable, add sketches or examples of the desired feature.

**📚 Additional Context**
Add any other context or screenshots about the feature request here.
```

## 🚦 Workflow Rules Summary

### Feature Development
```
feature/xyz → develop → staging → main
     ↑           ↑         ↑       ↑
   Direct     PR with    PR with  PR with
   commits    1 review   1 review 2 reviews
```

### Hotfix Process
```
main → hotfix/xyz → main
                 ↘ develop
```

### Release Process
```
develop → release/vX.X.X → staging → main
                        ↘ develop
```

## 📧 Team Notifications

Set up GitHub notifications:
1. Go to **Settings** → **Notifications**
2. Configure for your team:
   - **Participating**: Immediate email
   - **Watching**: Immediate email for releases
   - **Security alerts**: Immediate email

## 🔄 Automated Branch Updates

Consider setting up GitHub Apps:
- **Mergify**: Automated merge rules
- **Kodiak**: Smart merge queue
- **Renovate**: Dependency updates

---

**⚠️ Important Notes:**
- Always test branch protection rules with a test repository first
- Coordinate with your team before implementing strict rules
- Document any exceptions or special procedures
- Regularly review and update protection settings as the team grows
