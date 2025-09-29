# Getting Started with ML Interview Platform

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (for cloning the repository)

### 1. Clone and Setup
```bash
git clone <your-repository-url>
cd ml-interview-platform
chmod +x setup.sh
./setup.sh
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **ML Evaluator**: http://localhost:8000

### 3. Demo Credentials
- **Email**: demo@example.com
- **Password**: password123

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Ruby on Rails 7 API + PostgreSQL + Redis
- **ML Evaluation**: Python Flask + scikit-learn + pandas
- **Deployment**: Docker + Docker Compose

### Services
1. **Frontend** (Port 3000): React application with modern UI
2. **Backend** (Port 3001): Rails API with authentication and data management
3. **Database** (Port 5432): PostgreSQL for persistent data
4. **Redis** (Port 6379): Caching and job queues
5. **ML Evaluator** (Port 8000): Python service for code evaluation

## 🎮 Features

### For Candidates
- **Gamified Experience**: Progress tracking, achievements, and leaderboards
- **Real ML Challenges**: Hands-on coding challenges covering:
  - Data Preprocessing
  - Model Training
  - Model Evaluation
  - MLOps
  - Problem Solving
- **Adaptive Difficulty**: Challenges adjust based on skill level
- **Instant Feedback**: Real-time code evaluation and scoring
- **Comprehensive Analytics**: Detailed performance insights

### For Hiring Teams
- **Candidate Analytics**: Performance metrics and skill assessment
- **Comparative Analysis**: Benchmark candidates against each other
- **Export Capabilities**: Integration with ATS systems
- **Admin Dashboard**: Manage challenges and view reports

## 🧪 Challenge Types

### 1. Data Preprocessing (Easy-Medium)
- Clean and prepare datasets for ML
- Handle missing values and outliers
- Feature engineering and selection
- Data validation and quality checks

### 2. Model Training (Medium-Hard)
- Build and train ML models from scratch
- Algorithm selection and hyperparameter tuning
- Cross-validation and model selection
- Performance optimization

### 3. Model Evaluation (Medium)
- Assess model performance and interpretability
- Bias detection and fairness analysis
- Model comparison and selection
- Statistical significance testing

### 4. MLOps (Hard-Expert)
- Deploy and monitor models in production
- CI/CD pipelines for ML
- Model versioning and management
- Performance monitoring and alerting

### 5. Problem Solving (Expert)
- Debug and optimize existing ML pipelines
- Performance troubleshooting
- System architecture design
- Best practices implementation

## 📊 Evaluation Criteria

### Code Quality (25%)
- Clean, maintainable code
- Proper documentation and comments
- Error handling and edge cases
- Code organization and structure

### ML Knowledge (30%)
- Understanding of algorithms and techniques
- Appropriate library usage
- Feature engineering skills
- Model selection rationale

### Problem Solving (25%)
- Analytical thinking and approach
- Debugging and troubleshooting
- Optimization strategies
- Creative solutions

### Engineering (20%)
- Production-ready code
- Scalability considerations
- Testing and validation
- Best practices implementation

## 🛠️ Development

### Local Development Setup
```bash
# Backend development
cd backend
bundle install
rails db:create db:migrate db:seed
rails server

# Frontend development
cd frontend
npm install
npm run dev

# ML Evaluator development
cd ml-evaluator
pip install -r requirements.txt
python app.py
```

### Useful Commands
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Access backend console
docker-compose exec backend rails console

# Run tests
docker-compose exec backend rails test
docker-compose exec frontend npm test
```

## 🔧 Configuration

### Environment Variables
- **Backend**: Database, Redis, and API configurations
- **Frontend**: API endpoint and feature flags
- **ML Evaluator**: Model paths and evaluation settings

### Customization
- Add new challenge types in the backend
- Customize evaluation criteria
- Modify UI themes and branding
- Extend ML evaluation capabilities

## 📈 Analytics and Reporting

### Candidate Metrics
- Total score and completion rate
- Skill-specific performance
- Time-to-completion analysis
- Improvement over time

### Challenge Analytics
- Difficulty distribution
- Completion rates by category
- Average scores and times
- Popular challenge types

### Comparative Analysis
- Leaderboard rankings
- Peer comparisons
- Industry benchmarks
- Skill gap analysis

## 🚀 Deployment

### Production Deployment
1. Set up production environment variables
2. Configure SSL certificates
3. Set up monitoring and logging
4. Deploy using Docker or cloud services

### Scaling Considerations
- Horizontal scaling with load balancers
- Database optimization and indexing
- Caching strategies
- CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Contact the development team

---

**Happy coding! 🚀**


