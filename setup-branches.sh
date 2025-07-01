#!/bin/bash

# Professional Git Branch Setup Script for PGLS AI Platform
# Run this script to create all necessary branches for professional development

echo "🚀 Setting up professional Git branching structure for PGLS AI Platform..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_status "Initializing Git repository..."
    git init
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_status "Adding remote origin..."
    git remote add origin https://github.com/MesfinYerga2022/PGLS_AI.git
else
    print_warning "Remote origin already exists"
fi

# Create main branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/main; then
    print_status "Creating main branch..."
    git checkout -b main
    
    # Add all files and make initial commit
    print_status "Making initial commit..."
    git add .
    git commit -m "Initial commit: Arcadis AI Platform setup

- Complete React + Vite frontend with Material-UI
- FastAPI backend with OpenAI integration
- Azure AD authentication with MSAL
- Professional documentation and setup guides"
    
    # Push to main
    print_status "Pushing main branch..."
    git push -u origin main
    print_success "Main branch created and pushed"
else
    print_warning "Main branch already exists"
    git checkout main
fi

# Create develop branch
print_status "Creating develop branch..."
if ! git show-ref --verify --quiet refs/heads/develop; then
    git checkout -b develop
    git push -u origin develop
    print_success "Develop branch created and pushed"
else
    print_warning "Develop branch already exists"
fi

# Create staging branch
print_status "Creating staging branch..."
if ! git show-ref --verify --quiet refs/heads/staging; then
    git checkout main
    git checkout -b staging
    git push -u origin staging
    print_success "Staging branch created and pushed"
else
    print_warning "Staging branch already exists"
fi

# Array of feature branches to create
feature_branches=(
    "feature/authentication"
    "feature/data-upload"
    "feature/data-visualization"
    "feature/ai-analytics"
    "feature/reporting"
    "feature/admin-panel"
    "feature/ui-ux"
    "feature/backend-api"
    "feature/testing"
    "feature/documentation"
)

# Create feature branches from develop
print_status "Creating feature branches..."
git checkout develop

for branch in "${feature_branches[@]}"; do
    if ! git show-ref --verify --quiet refs/heads/$branch; then
        print_status "Creating $branch..."
        git checkout -b $branch
        git push -u origin $branch
        git checkout develop
        print_success "$branch created and pushed"
    else
        print_warning "$branch already exists"
    fi
done

# Create release branch template
print_status "Creating release branch template..."
if ! git show-ref --verify --quiet refs/heads/release/v1.0.0; then
    git checkout develop
    git checkout -b release/v1.0.0
    git push -u origin release/v1.0.0
    git checkout develop
    print_success "Release branch v1.0.0 created and pushed"
else
    print_warning "Release branch v1.0.0 already exists"
fi

# Display branch structure
print_success "✅ Professional Git branching structure created!"
echo ""
echo "📋 Created Branches:"
echo "├── main (production)"
echo "├── develop (integration)"
echo "├── staging (pre-production)"
echo "├── release/v1.0.0 (release preparation)"
echo "└── feature branches:"
for branch in "${feature_branches[@]}"; do
    echo "    ├── $branch"
done

echo ""
echo "🔄 Recommended Workflow:"
echo "1. Work on features in feature/* branches"
echo "2. Merge features to develop for integration"
echo "3. Create release branches from develop"
echo "4. Test in staging environment"
echo "5. Deploy to production via main branch"

echo ""
echo "📚 Next Steps:"
echo "1. Set up branch protection rules on GitHub"
echo "2. Configure CI/CD pipeline"
echo "3. Start working on features using:"
echo "   git checkout feature/your-feature-name"
echo "4. Follow commit message conventions in BRANCHING_STRATEGY.md"

echo ""
print_success "🎉 Your repository is now professionally structured!"
