# AEIS Website - Deployment Guide

## Quick Start Deployment Steps

### 1. Push to GitHub
```bash
# Create a new repository on GitHub at https://github.com/new
# Name: ambica-electric-website (or your preferred name)

git remote add origin https://github.com/YOUR_USERNAME/ambica-electric-website.git
git branch -M main
git push -u origin main
```

### 2. Create Azure Static Web App
```bash
# Install Azure CLI if not already installed
# https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

az login
az staticwebapp create --name aeis-website --resource-group ambica-rg --source https://github.com/YOUR_USERNAME/ambica-electric-website.git --location eastus --branch main
```

### 3. Configure GitHub Secret
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Create new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Copy the deployment token from Azure Static Web App creation output

### 4. Deploy
Push to main branch:
```bash
git push origin main
```

The GitHub Actions workflow will automatically build and deploy!

---

## Project Structure
- `src/` - Web application files (HTML, CSS, JS)
- `api/` - Azure Functions for backend (email service)
- `.github/workflows/` - CI/CD configuration

## Services Deployed
- **Frontend**: Static HTML/CSS/JS hosted on Azure Static Web Apps
- **Backend**: Azure Functions for sending contact emails
- **Contact Card**: Digital business card at `/card.html`

## Configuration Files
- `staticwebapp.config.json` - SWA routing configuration
- `api/host.json` - Azure Functions host config
- `.github/workflows/azure-static-web-apps-deploy.yml` - CI/CD pipeline

---

## Environment Variables (if needed)
Add to `api/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "your-storage-connection-string",
    "COMMUNICATION_SERVICES_CONNECTION_STRING": "your-connection-string"
  }
}
```

---

**Status**: Ready for deployment ✅
