```
/fincan
│── /backend # Node.js backend
│ ├── /controllers # Handles API requests (business logic)
│ ├── /models # MySQL database models
│ ├── /routes # API endpoints
│ ├── /config # Configuration files (database, environment variables)
│ ├── server.js # Main backend entry point
│ ├── package.json # Backend dependencies
│ ├── .env.example # Example environment variables
│ ├── Dockerfile # Backend containerization
│
│── /frontend # React frontend
│ ├── /src
│ │ ├── /components # Reusable UI components
│ │ ├── /pages # Page-specific components
│ │ ├── /services # API calls to backend
│ │ ├── App.js # Main React app entry point
│ │ ├── index.js # Renders React app
│ ├── package.json # Frontend dependencies
│ ├── .env.example # Example frontend environment variables
│ ├── Dockerfile # Frontend containerization
│
│── /database # MySQL setup
│ ├── schema.sql # Database schema file
│ ├── seed.sql # Initial data for testing
│ ├── docker-compose.yml # MySQL service configuration
│
│── /docs # Documentation
│ ├── API.md # API documentation
│ ├── README.md # Project documentation
│ ├── SETUP.md # Setup instructions
│
│── /deploy # Deployment files
│ ├── docker-compose.yml # Multi-container setup
│
│── .gitignore # Excludes unnecessary files
│── README.md # Root project documentation
```
