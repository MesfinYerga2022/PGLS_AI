# Professional Git Branch Setup Script for PGLS AI Platform (PowerShell)
# Run this script to create all necessary branches for professional development

Write-Host "🚀 Setting up professional Git branching structure for PGLS AI Platform..." -ForegroundColor Blue

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in a git repository
try {
    git rev-parse --git-dir 2>$null | Out-Null
} catch {
    Write-Status "Initializing Git repository..."
    git init
}

# Check if remote origin exists
try {
    git remote get-url origin 2>$null | Out-Null
    Write-Warning "Remote origin already exists"
} catch {
    Write-Status "Adding remote origin..."
    git remote add origin https://github.com/MesfinYerga2022/PGLS_AI.git
}

# Create main branch if it doesn't exist
try {
    git show-ref --verify --quiet refs/heads/main 2>$null
    Write-Warning "Main branch already exists"
    git checkout main
} catch {
    Write-Status "Creating main branch..."
    git checkout -b main
    
    # Add all files and make initial commit
    Write-Status "Making initial commit..."
    git add .
    git commit -m "Initial commit: Arcadis AI Platform setup

- Complete React + Vite frontend with Material-UI
- FastAPI backend with OpenAI integration
- Azure AD authentication with MSAL
- Professional documentation and setup guides"
    
    # Push to main
    Write-Status "Pushing main branch..."
    git push -u origin main
    Write-Success "Main branch created and pushed"
}

# Create develop branch
Write-Status "Creating develop branch..."
try {
    git show-ref --verify --quiet refs/heads/develop 2>$null
    Write-Warning "Develop branch already exists"
} catch {
    git checkout -b develop
    git push -u origin develop
    Write-Success "Develop branch created and pushed"
}

# Create staging branch
Write-Status "Creating staging branch..."
try {
    git show-ref --verify --quiet refs/heads/staging 2>$null
    Write-Warning "Staging branch already exists"
} catch {
    git checkout main
    git checkout -b staging
    git push -u origin staging
    Write-Success "Staging branch created and pushed"
}

# Array of feature branches to create
$featureBranches = @(
    "feature/authentication",
    "feature/data-upload",
    "feature/data-visualization",
    "feature/ai-analytics",
    "feature/reporting",
    "feature/admin-panel",
    "feature/ui-ux",
    "feature/backend-api",
    "feature/testing",
    "feature/documentation"
)

# Create feature branches from develop
Write-Status "Creating feature branches..."
git checkout develop

foreach ($branch in $featureBranches) {
    try {
        git show-ref --verify --quiet "refs/heads/$branch" 2>$null
        Write-Warning "$branch already exists"
    } catch {
        Write-Status "Creating $branch..."
        git checkout -b $branch
        git push -u origin $branch
        git checkout develop
        Write-Success "$branch created and pushed"
    }
}

# Create release branch template
Write-Status "Creating release branch template..."
try {
    git show-ref --verify --quiet refs/heads/release/v1.0.0 2>$null
    Write-Warning "Release branch v1.0.0 already exists"
} catch {
    git checkout develop
    git checkout -b release/v1.0.0
    git push -u origin release/v1.0.0
    git checkout develop
    Write-Success "Release branch v1.0.0 created and pushed"
}

# Display branch structure
Write-Success "✅ Professional Git branching structure created!"
Write-Host ""
Write-Host "📋 Created Branches:" -ForegroundColor Yellow
Write-Host "├── main (production)" -ForegroundColor White
Write-Host "├── develop (integration)" -ForegroundColor White
Write-Host "├── staging (pre-production)" -ForegroundColor White
Write-Host "├── release/v1.0.0 (release preparation)" -ForegroundColor White
Write-Host "└── feature branches:" -ForegroundColor White
foreach ($branch in $featureBranches) {
    Write-Host "    ├── $branch" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🔄 Recommended Workflow:" -ForegroundColor Yellow
Write-Host "1. Work on features in feature/* branches" -ForegroundColor White
Write-Host "2. Merge features to develop for integration" -ForegroundColor White
Write-Host "3. Create release branches from develop" -ForegroundColor White
Write-Host "4. Test in staging environment" -ForegroundColor White
Write-Host "5. Deploy to production via main branch" -ForegroundColor White

Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up branch protection rules on GitHub" -ForegroundColor White
Write-Host "2. Configure CI/CD pipeline" -ForegroundColor White
Write-Host "3. Start working on features using:" -ForegroundColor White
Write-Host "   git checkout feature/your-feature-name" -ForegroundColor Cyan
Write-Host "4. Follow commit message conventions in BRANCHING_STRATEGY.md" -ForegroundColor White

Write-Host ""
Write-Success "🎉 Your repository is now professionally structured!"
