# Laser Clinic Management System

A comprehensive web application for managing patients and laser procedures in a medical clinic.

## Features

- **Patient Management**: Add, edit, and view patient information
- **Procedure Tracking**: Record and manage laser procedures
- **Zone-based Treatment**: Track treatments for different body zones
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **Database**: Oracle Database
- **UI Components**: Custom components with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Oracle Database
- Oracle Instant Client (for local development)

## Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd laser-clinic-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   - Create `.env` files in both frontend and backend directories
   - Configure your database connection and other environment variables

## Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
# Add other frontend environment variables here
```

### Backend (.env)
```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_CONNECT_STRING=your_connection_string
PORT=3000
NODE_ENV=development
```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Start production server (from root directory)
npm start
```

## Database Schema

The application uses the following main tables:
- `PACIENTE` - Patient information
- `ZONA_TELO` - Body zones for treatments
- `PROCEDURA` - Procedure records
- `PROCEDURA_ZONA` - Junction table for procedures and zones

## Deployment

For production deployment, consider using:
- **Frontend**: Vercel, Netlify, or static file hosting
- **Backend**: Oracle Cloud, AWS, or any Node.js hosting
- **Database**: Oracle Cloud Autonomous Database

## License

[Your License Here]
