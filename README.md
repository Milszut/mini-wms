# MiniWMS
A web-based inventory and equipment management system built with React, Node.js and MySQL.
## Live Demo
🌐 https://mini-wms.pl

## Demo Access
Demo account credentials are available in my CV or can be provided upon request.

## Features
* User authentication
* Session management using HttpOnly cookies
* CSRF protection
* Adding and editing items
* Image upload support
* Location and service management
* Item archiving and restoring
* Statistics dashboard
* Form validation
* Responsive design
* Automatic daily reset of demo data

## Technologies
### Frontend
* React
* Vite
* TailwindCSS
* React Router
* Recharts
* Framer Motion

### Backend
* Node.js
* Express
* MySQL

### Security
* Helmet
* CSRF protection
* HttpOnly cookies
* Rate limiting

### Deployment
* VPS (Ubuntu)
* Apache Reverse Proxy
* PM2
* HTTPS (Let's Encrypt)

## Project Structure
```text
mini-wms
│
├── mini-wms-frontend
└── mini-wms-backend
```

## Installation
### Frontend
```bash
cd mini-wms-frontend
npm install
npm run dev
```

### Backend
```bash
cd mini-wms-backend
npm install
node server.js
```

## Environment Variables
### Frontend
```env
VITE_API_BASE=
```

### Backend
```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=
NODE_ENV=
WEB_ORIGIN=
SESSION_COOKIE_NAME=
CSRF_COOKIE_NAME=
```

## Deployment
The application is deployed on a VPS running Ubuntu.
Services used:
* Apache
* PM2
* MySQL
* Let's Encrypt
