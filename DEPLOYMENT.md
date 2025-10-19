# Deployment Guide 🚀

This guide covers various deployment options for the Pattern-Trainer Agent application.

## 📋 Prerequisites

- Node.js 16+ installed
- Git repository access
- Required environment variables configured
- MongoDB (optional, but recommended for production)

## 🌐 Deployment Options

### 1. Vercel (Recommended for Frontend)

Vercel provides excellent Next.js support with automatic deployments.

#### Setup Steps:

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   GEMINI_API_KEY=your_api_key
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

3. **Automatic Deployments**
   - Push to main branch triggers automatic deployment
   - Preview deployments for pull requests

#### Vercel Configuration (`vercel.json`):
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

### 2. Railway (Full-Stack)

Railway supports both frontend and backend deployment.

#### Setup Steps:

1. **Connect Repository**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect Next.js

2. **Environment Variables**
   ```
   GEMINI_API_KEY=your_api_key
   PORT=3000
   USE_MONGODB=true
   MONGODB_URI=your_mongodb_uri
   ```

3. **Database Setup**
   - Add MongoDB service in Railway
   - Use the provided connection string

### 3. Heroku

#### Setup Steps:

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Ubuntu
   sudo snap install heroku --classic
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Configure Buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Environment Variables**
   ```bash
   heroku config:set GEMINI_API_KEY=your_api_key
   heroku config:set USE_MONGODB=true
   heroku config:set MONGODB_URI=your_mongodb_uri
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

#### Heroku Configuration (`Procfile`):
```
web: npm run start:server
```

### 4. DigitalOcean App Platform

#### Setup Steps:

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your repository
   - Select Node.js as the runtime

2. **Configure Build Settings**
   ```yaml
   # .do/app.yaml
   name: pattern-trainer-agent
   services:
   - name: web
     source_dir: /
     github:
       repo: yourusername/pattern-trainer-agent
       branch: main
     run_command: npm run start:server
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: GEMINI_API_KEY
       value: your_api_key
     - key: USE_MONGODB
       value: "true"
     - key: MONGODB_URI
       value: your_mongodb_uri
   ```

### 5. Docker Deployment

#### Create Dockerfile:
```dockerfile
# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:server"]
```

#### Docker Compose:
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - USE_MONGODB=true
      - MONGODB_URI=mongodb://mongo:27017/pattern-trainer
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Deploy with Docker:
```bash
# Build and run
docker-compose up -d

# Or with Docker
docker build -t pattern-trainer-agent .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key pattern-trainer-agent
```

### 6. AWS Deployment

#### Using AWS Amplify:

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Select main branch

2. **Build Settings**
   ```yaml
   # amplify.yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   Set in Amplify console:
   ```
   GEMINI_API_KEY=your_api_key
   NEXT_PUBLIC_API_URL=https://your-api-gateway-url
   ```

#### Using AWS EC2:

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (ports 22, 80, 443, 3000)

2. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/pattern-trainer-agent.git
   cd pattern-trainer-agent
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start server.js --name "pattern-trainer"
   pm2 startup
   pm2 save
   ```

## 🔧 Environment Configuration

### Required Variables:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Optional Variables:
```env
PORT=3000
USE_MONGODB=true
MONGODB_URI=mongodb://localhost:27017/pattern-trainer
NODE_ENV=production
```

### Production Recommendations:
```env
NODE_ENV=production
USE_MONGODB=true
RATE_LIMIT=100
DEBUG=false
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production):

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Choose your preferred region

2. **Configure Access**
   - Create database user
   - Whitelist your IP addresses
   - Get connection string

3. **Connection String Format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/pattern-trainer?retryWrites=true&w=majority
   ```

### Local MongoDB:

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🔒 Security Considerations

### Production Security:

1. **Environment Variables**
   - Never commit `.env` files
   - Use secure secret management
   - Rotate API keys regularly

2. **HTTPS**
   - Always use HTTPS in production
   - Configure SSL certificates
   - Use secure headers

3. **Rate Limiting**
   - Implement API rate limiting
   - Monitor for abuse
   - Set appropriate limits

4. **CORS Configuration**
   ```javascript
   // In server.js
   app.use(cors({
     origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001'],
     credentials: true
   }));
   ```

## 📊 Monitoring & Logging

### Recommended Tools:

1. **Application Monitoring**
   - Sentry for error tracking
   - New Relic for performance
   - LogRocket for user sessions

2. **Infrastructure Monitoring**
   - AWS CloudWatch
   - DataDog
   - Grafana + Prometheus

3. **Logging Setup**
   ```javascript
   // Add to server.js
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

## 🚀 Performance Optimization

### Production Optimizations:

1. **Next.js Optimizations**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     poweredByHeader: false,
     generateEtags: false,
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif']
     }
   };
   ```

2. **Caching**
   - Implement Redis for session storage
   - Use CDN for static assets
   - Enable browser caching

3. **Database Optimization**
   - Create appropriate indexes
   - Use connection pooling
   - Monitor query performance

## 🔄 CI/CD Pipeline

### GitHub Actions Example:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network connectivity
   - Ensure database is running

3. **API Key Issues**
   - Verify Gemini API key is valid
   - Check API quotas and limits
   - Ensure proper environment variable setup

4. **Performance Issues**
   - Monitor memory usage
   - Check database query performance
   - Optimize image sizes and assets

### Debug Commands:

```bash
# Check application status
pm2 status

# View logs
pm2 logs pattern-trainer

# Restart application
pm2 restart pattern-trainer

# Check database connection
mongo --eval "db.adminCommand('ismaster')"

# Test API endpoints
curl -X GET http://localhost:3000/api/health
```

## 📞 Support

For deployment issues:
- Check the [GitHub Issues](https://github.com/yourusername/pattern-trainer-agent/issues)
- Review the [Documentation](README.md)
- Join our [Discord Community](https://discord.gg/patterntrainer)

---

**Happy Deploying! 🚀**
