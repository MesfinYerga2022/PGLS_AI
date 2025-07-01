# Arcadis AI Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-blue.svg)](https://mui.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-green.svg)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)

> A comprehensive AI-powered data analytics platform for Arcadis professionals, featuring advanced visualization, natural language querying, and automated reporting capabilities.

## 🚀 Overview

The Arcadis AI Platform is an enterprise-grade data analytics solution that empowers users to upload, analyze, and visualize data with AI-driven insights. Built with modern web technologies and integrated with Microsoft Azure Active Directory for secure authentication.

### Key Features

- **🔐 Secure Authentication**: Microsoft Azure AD integration with role-based access control
- **📊 Advanced Visualizations**: Interactive charts (Scatter, Bar, Line, Area, Pie, Radar)
- **🤖 AI-Powered Analytics**: Natural language querying and automated insights
- **📈 Exploratory Data Analysis (EDA)**: Comprehensive statistical summaries and data profiling
- **📄 Professional Reporting**: Automated PowerPoint and PDF report generation
- **👥 User Management**: Admin panel with user approval and role management
- **🎨 Modern UI/UX**: Material Design with Arcadis branding

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern component-based UI library
- **Vite** - Lightning-fast build tool and dev server
- **Material-UI (MUI)** - Professional React component library
- **Recharts** - Powerful charting library for data visualization
- **MSAL React** - Microsoft Authentication Library for Azure AD

### Backend Stack
- **FastAPI** - High-performance Python web framework
- **OpenAI API** - AI-powered natural language processing
- **Pandas** - Data manipulation and analysis
- **Uvicorn** - ASGI server for production deployment

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.9 or higher
- **Microsoft Azure AD** account
- **OpenAI API Key** (optional, for AI features)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/MesfinYerga2022/PGLS_AI.git
cd PGLS_AI
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload --port 9020
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
INITIAL_ADMIN_EMAIL=your_admin_email@arcadis.com
```

## 🚦 Getting Started

### For End Users

1. **Access the Platform**
   - Navigate to `http://localhost:5173`
   - Click "Sign in with Microsoft"
   - Use your Arcadis Microsoft account

2. **First-Time Setup**
   - New users require admin approval
   - Admin users (configured via `INITIAL_ADMIN_EMAIL`) have immediate access

3. **Data Upload & Analysis**
   - Upload CSV or Excel files via the Upload section
   - Explore data with automated EDA
   - Create interactive visualizations
   - Generate professional reports

### For Administrators

1. **User Management**
   - Access the Admin panel (admin users only)
   - Approve pending user registrations
   - Promote users to admin status
   - Remove user access when needed

2. **Platform Configuration**
   - Configure OpenAI API integration
   - Manage user permissions
   - Monitor platform usage

## 📖 User Guide

### Navigation
- **Home**: Platform overview and status
- **Upload**: Data file management
- **Charts & Visualization**: Interactive chart builder
- **EDA & Interpretation**: Statistical analysis and AI insights
- **Export & Reporting**: Professional report generation
- **Admin**: User and system management (admin only)

### Supported File Formats
- CSV (Comma-separated values)
- Excel (.xlsx, .xls)

### Chart Types
- **Scatter Plot**: Correlation analysis
- **Bar Chart**: Categorical comparisons
- **Line Chart**: Trends over time
- **Area Chart**: Cumulative data visualization
- **Pie Chart**: Proportional data representation
- **Radar Chart**: Multi-dimensional data comparison

### AI Features
- **Natural Language Queries**: Ask questions about your data in plain English
- **Automated Insights**: AI-generated summaries and recommendations
- **Smart Visualizations**: AI-suggested chart types and configurations
- **Professional Reports**: Automated PowerPoint generation with insights

## 🔧 Development

### Project Structure
```
pgls_ai/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── utils/             # Utility functions
│   └── assets/            # Static assets
├── backend/               # Backend source code
│   ├── main.py           # FastAPI application
│   ├── llm.py            # AI/LLM integration
│   └── requirements.txt   # Python dependencies
├── public/               # Static public assets
└── docs/                 # Documentation
```

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

#### Backend
```bash
uvicorn main:app --reload --port 9020    # Development server
uvicorn main:app --host 0.0.0.0 --port 9020  # Production server
python test_api.py                       # Run API tests
```

### Code Quality
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Type Safety**: PropTypes for component validation
- **Security**: MSAL for secure authentication

## 🔒 Security & Privacy

- **Authentication**: Microsoft Azure AD integration
- **Authorization**: Role-based access control (Admin/User)
- **Data Privacy**: No data stored permanently on client
- **Secure Communication**: HTTPS in production
- **API Security**: Token-based authentication for backend

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting platform
# (Vercel, Netlify, Azure Static Web Apps, etc.)
```

### Backend Deployment
```bash
# Using Docker
docker build -t arcadis-ai-backend .
docker run -p 9020:9020 arcadis-ai-backend

# Using cloud platforms
# Deploy to Azure App Service, AWS Lambda, or Google Cloud Run
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use Material-UI components consistently
- Maintain TypeScript compatibility
- Write comprehensive tests
- Update documentation

## 📞 Support

### Technical Support
- **Email**: support@arcadis.com
- **Documentation**: [Internal Wiki]
- **Issue Tracker**: GitHub Issues

### Troubleshooting

#### Common Issues

**Q: Can't see menu items after login?**
A: You need admin approval. Contact your platform administrator.

**Q: AI features not working?**
A: Ensure OpenAI API key is configured in backend environment.

**Q: Charts not displaying?**
A: Verify data format and ensure file upload was successful.

**Q: Authentication errors?**
A: Check Azure AD configuration and network connectivity.

### Quick Reference

```bash
# Start development environment
npm run dev                 # Frontend (http://localhost:5173)
uvicorn main:app --reload --port 9020  # Backend (http://localhost:9020)

# Production build
npm run build              # Frontend build
python -m uvicorn main:app --host 0.0.0.0 --port 9020  # Backend production
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Arcadis Development Team** - Platform development and maintenance
- **Microsoft** - Azure AD integration and authentication
- **OpenAI** - AI-powered analytics capabilities
- **Material-UI Team** - Excellent React component library
- **Vite Team** - Fast and modern build tooling

---

**© 2025 Arcadis. All rights reserved.**

For more information, visit [Arcadis Digital Solutions](https://www.arcadis.com)
