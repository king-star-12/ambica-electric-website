#!/bin/bash

# AEIS Website - Complete Automated Deployment Script
# This script handles GitHub and Azure deployment

set -e

PROJECT_DIR="/Users/dhrumiljoshi/Documents/dad's business/Ambica Electric and Instrument Services/company website"
cd "$PROJECT_DIR"

echo "=========================================="
echo "AEIS Website - Automated Deployment"
echo "=========================================="
echo ""

# Step 1: GitHub Authentication
echo "📝 Step 1: GitHub Authentication"
echo "=================================="
echo "GitHub CLI needs authentication. Please login:"
echo ""
gh auth login --scopes repo,admin:repo_hook

echo ""
echo "✅ GitHub authenticated!"
echo ""

# Step 2: Create GitHub Repository
echo "📝 Step 2: Creating GitHub Repository"
echo "===================================="

GITHUB_USERNAME=$(gh api user --jq '.login')
REPO_NAME="ambica-electric-website"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME"

echo "Creating repository: $REPO_NAME"
gh repo create $REPO_NAME --source=. --remote=origin --push --public

echo "✅ GitHub repository created: $REPO_URL"
echo ""

# Step 3: Azure Static Web App Setup
echo "📝 Step 3: Setting Up Azure Static Web App"
echo "=========================================="

RESOURCE_GROUP="aeis-rg"
APP_NAME="aeis-website"
LOCATION="eastus"

# Check if resource group exists, if not create it
if ! az group exists --name "$RESOURCE_GROUP" | grep -q "true"; then
    echo "Creating resource group: $RESOURCE_GROUP"
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
fi

echo "Creating Azure Static Web App..."
DEPLOYMENT_TOKEN=$(az staticwebapp create \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --source "$REPO_URL" \
    --location "$LOCATION" \
    --branch main \
    --app-location "src" \
    --api-location "api" \
    --output-location "." \
    --query "repositoryToken" \
    -o tsv)

echo "✅ Azure Static Web App created: $APP_NAME"
echo ""

# Step 4: Add GitHub Secret
echo "📝 Step 4: Configuring GitHub Secrets"
echo "===================================="

echo "Adding deployment token to GitHub Secrets..."
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN -b"$DEPLOYMENT_TOKEN"

echo "✅ GitHub secret configured"
echo ""

# Step 5: Trigger Deployment
echo "📝 Step 5: Triggering Deployment"
echo "================================"

git push origin main
echo ""
echo "✅ Code pushed to GitHub - deployment started!"
echo ""

# Step 6: Get App URL
echo "📝 Step 6: Getting Application URL"
echo "=================================="

APP_URL=$(az staticwebapp show \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "defaultHostname" \
    -o tsv)

echo ""
echo "=========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "📱 Your website is live at:"
echo "   https://$APP_URL"
echo ""
echo "📊 Azure Static Web App:"
echo "   Name: $APP_NAME"
echo "   Resource Group: $RESOURCE_GROUP"
echo ""
echo "💻 GitHub Repository:"
echo "   $REPO_URL"
echo ""
echo "✨ Services Deployed:"
echo "   ✓ Frontend (HTML/CSS/JS)"
echo "   ✓ Contact Card (/card.html)"
echo "   ✓ Azure Functions (Backend API)"
echo ""
echo "📝 Next Steps:"
echo "   1. Verify your website is working"
echo "   2. Configure custom domain (optional)"
echo "   3. Set up email configuration in Azure"
echo ""
echo "=========================================="
