# 💻 Production
## Production Environment
- **URL**: [https://learnnorsk.tylerwade.net](https://www.learnnorsk.tylerwade.net)

## ✈️ Deployment
- **Branch**: `main`
- **Frontend Framework**: React, Next.js
- **Backend Framework**: Spring Boot
- **Database**: MySQL
- **Deployment**: DigitalOcean Droplet
- **Operating System**: Ubuntu 24.10
- **Web Server**: Nginx
- **Containerization**: Docker

## ✅ Steps to Deployment
1. **Clone Repository**: `git clone https://github.com/WadeTyler/Learn-Norsk.git`  
2. **Navigate to Repository**: `cd Learn-Norsk`
3. **Add .env File**: `nano .env` and paste the following and enter correct values:
```
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_URL=
JWT_AUTH_SECRET=
OPENAI_API_KEY=
CORS_ALLOWED_ORIGINS=
```
4. **Add frontend .env file: `cd frontend` and `nano .env.production` and paste the following and enter correct values:
```
NEXT_PUBLIC_API_URL=
```
5. **Compose**: `cd ..` and `docker-compose up --build -d`