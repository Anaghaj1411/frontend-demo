# Frontend Deployment

This React frontend is configured for Vercel deployment with a local Django backend.

## Setup Instructions

### 1. Deploy to Vercel
1. Push the frontend folder to a GitHub repository
2. Connect the repository to Vercel
3. Vercel will automatically build and deploy the React app

### 2. Backend Setup
1. Run your Django backend locally on port 8000:
   ```bash
   cd backend
   python manage.py runserver
   ```

### 3. Environment Configuration
The frontend is configured to proxy all `/api/*` requests to `http://localhost:8000/api/*` through Vercel rewrites.

## Important Notes
- The backend must be running locally for the deployed frontend to work
- All API requests are automatically routed to your local Django server
- CORS headers are configured to handle cross-origin requests
- The frontend will work exactly the same as it does in local development
