#!/bin/bash

echo "🚀 Setting up ML Interview Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/log
mkdir -p backend/tmp/pids
mkdir -p frontend/node_modules

# Set up environment files
echo "⚙️  Setting up environment files..."

# Backend environment
cat > backend/.env << EOF
DATABASE_URL=postgres://postgres:password@db:5432/ml_interview_platform_development
REDIS_URL=redis://redis:6379/0
SECRET_KEY_BASE=$(openssl rand -hex 64)
RAILS_ENV=development
ML_EVALUATOR_URL=http://ml-evaluator:8000
EOF

# Frontend environment
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001/api/v1
EOF

echo "✅ Environment files created"

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."

# Check database
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
    exit 1
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
    exit 1
fi

# Run database migrations and seed
echo "🌱 Setting up database..."
docker-compose exec backend rails db:create db:migrate db:seed

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   ML Evaluator: http://localhost:8000"
echo ""
echo "👤 Demo credentials:"
echo "   Email: demo@example.com"
echo "   Password: password123"
echo ""
echo "🛠️  Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Access backend console: docker-compose exec backend rails console"
echo ""
echo "Happy coding! 🚀"


