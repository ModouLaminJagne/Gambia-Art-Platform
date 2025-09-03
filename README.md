# 🎨 Gambian Art Platform

A comprehensive web platform dedicated to showcasing and celebrating Gambian art. This platform allows local artists to create accounts, upload their artwork, and share their creative expressions with the world.

![Gambian Art Platform](https://img.shields.io/badge/Platform-Gambian%20Art-red?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-13.4-black?style=flat-square&logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4.18-green?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.5-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-blue?style=flat-square&logo=tailwindcss)

## 🌟 Features

### For Artists
- **Easy Registration**: Simple sign-up process with profile photo upload
- **Portfolio Management**: Upload and manage multiple artworks
- **Personal Dashboard**: View and track all uploaded artworks
- **Professional Profiles**: Showcase contact information and bio

### For Visitors
- **Art Gallery**: Browse beautiful collection of Gambian artwork
- **Artist Discovery**: Learn about talented Gambian artists
- **Responsive Design**: Perfect viewing experience on all devices
- **Cultural Theme**: Design inspired by Gambian flag colors

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13.4
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Language**: JavaScript (ES6+)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer
- **CORS**: Cross-Origin Resource Sharing enabled

### Development Tools
- **Package Manager**: npm
- **Development Server**: Nodemon (Backend)
- **Linting**: ESLint
- **CSS Processing**: PostCSS + Autoprefixer

## 📁 Project Structure

```
gambian-art-platform/
├── 📁 backend/                    # Express.js API server
│   ├── 📁 models/                 # MongoDB data models
│   │   ├── Artist.js              # Artist schema
│   │   └── Artwork.js             # Artwork schema
│   ├── 📁 routes/                 # API route handlers
│   │   ├── artists.js             # Artist-related endpoints
│   │   └── artworks.js            # Artwork-related endpoints
│   ├── 📁 middleware/             # Custom middleware
│   │   └── upload.js              # File upload configuration
│   ├── 📁 uploads/                # File storage directory
│   │   ├── 📁 profiles/           # Profile photos
│   │   └── 📁 artworks/           # Artwork images
│   ├── server.js                  # Main server file
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables
├── 📁 frontend/                   # Next.js application
│   ├── 📁 components/             # Reusable React components
│   │   ├── ArtistRegistration.js  # Registration form
│   │   ├── ArtworkUpload.js       # Artwork upload form
│   │   ├── Header.js              # Navigation header
│   │   └── Layout.js              # Page layout wrapper
│   ├── 📁 pages/                  # Next.js pages
│   │   ├── _app.js                # App configuration
│   │   ├── index.js               # Home page
│   │   ├── register.js            # Registration page
│   │   └── dashboard.js           # Artist dashboard
│   ├── 📁 styles/                 # CSS styles
│   │   └── globals.css            # Global styles
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── next.config.js             # Next.js configuration
│   └── .env.local                 # Frontend environment variables
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gambian-art-platform.git
   cd gambian-art-platform
   ```

2. **Set up the Backend**
   ```bash
   # Create and navigate to backend directory
   mkdir backend && cd backend
   
   # Initialize npm and install dependencies
   npm init -y
   npm install express mongoose multer cors dotenv path
   npm install -D nodemon
   
   # Create upload directories
   mkdir -p uploads/profiles uploads/artworks
   
   # Create environment file
   echo "MONGODB_URI=mongodb://localhost:27017/gambian-art
   PORT=5000" > .env
   ```

3. **Set up the Frontend**
   ```bash
   # Navigate back to root and create frontend
   cd ..
   mkdir frontend && cd frontend
   
   # Initialize Next.js project
   npx create-next-app@latest . --tailwind --eslint
   
   # Install additional dependencies
   npm install axios
   
   # Create environment file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB installation
   mongod
   
   # Or start MongoDB service (varies by OS)
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

5. **Run the Application**
   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend development server
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Usage Guide

### For Artists

1. **Registration**
   - Visit the registration page
   - Fill in your details (name, surname, email, address)
   - Upload a profile photo (optional)
   - Click "Register" to create your account

2. **Uploading Artwork**
   - Access your dashboard using your email
   - Click "Upload New Artwork"
   - Add artwork image, title, description, and number of copies
   - Click "Upload Artwork" to save

3. **Managing Portfolio**
   - View all your uploaded artworks in the dashboard
   - Track upload dates and copy availability
   - Upload multiple artworks as needed

### For Visitors

1. **Browse Gallery**
   - Visit the home page to see featured artworks
   - View artwork details including artist information
   - See number of available copies

## 🔌 API Documentation

### Artist Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | `/api/artists/register` | Register new artist | Form data with artist details |
| GET | `/api/artists/by-email/:email` | Get artist by email | Email parameter |
| GET | `/api/artists` | Get all artists | None |

### Artwork Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | `/api/artworks/upload` | Upload new artwork | Form data with artwork details |
| GET | `/api/artworks/artist/:artistId` | Get artworks by artist | Artist ID parameter |
| GET | `/api/artworks` | Get all artworks | None |

### Request/Response Examples

**Register Artist:**
```bash
curl -X POST http://localhost:5000/api/artists/register \
  -F "name=John" \
  -F "surname=Doe" \
  -F "email=john@example.com" \
  -F "address=Banjul, The Gambia" \
  -F "profilePhoto=@profile.jpg"
```

**Upload Artwork:**
```bash
curl -X POST http://localhost:5000/api/artworks/upload \
  -F "artistId=60f7b3b3b3b3b3b3b3b3b3b3" \
  -F "title=Beautiful Landscape" \
  -F "description=A stunning view of Gambian countryside" \
  -F "copiesAvailable=5" \
  -F "artworkImage=@artwork.jpg"
```

## 🎨 Design System

The platform uses a color scheme inspired by the Gambian flag:

- **Primary Red**: `#CE1126` (Gambian flag red)
- **Primary Blue**: `#0C1C8C` (Gambian flag blue)
- **Primary Green**: `#009639` (Gambian flag green)
- **Neutral Gray**: Various shades for text and backgrounds

### Component Classes

- `.btn-primary`: Primary action buttons (red theme)
- `.btn-secondary`: Secondary action buttons (blue theme)
- `.card`: Content cards with shadow and padding
- `.form-input`: Styled form inputs
- `.form-label`: Form field labels

## 🔒 Security Features

- **File Upload Validation**: Only image files allowed
- **File Size Limits**: Maximum 5MB per upload
- **Email Uniqueness**: Prevents duplicate artist accounts
- **Input Sanitization**: Mongoose schema validation
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd backend
npm install --production
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/gambian-art
PORT=5000
NODE_ENV=production
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Deployment Options

- **Vercel** (Frontend): Easy Next.js deployment
- **Heroku** (Backend): Simple Express.js hosting
- **MongoDB Atlas** (Database): Cloud MongoDB service
- **AWS S3** (File Storage): For production file uploads

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Use meaningful commit messages
- Add comments for complex logic
- Test all features before submitting PR
- Maintain consistent code formatting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the rich artistic culture of The Gambia
- Built with modern web technologies
- Designed to support local artists and cultural preservation

## 📞 Support

For support, email support@gambianartplatform.com or create an issue in the GitHub repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Artist registration and authentication
  - Artwork upload and management
  - Responsive gallery interface
  - Dashboard functionality

## 🛣️ Roadmap

- [ ] User authentication with JWT
- [ ] Advanced search and filtering
- [ ] Artist verification system
- [ ] Social sharing features
- [ ] Mobile app development
- [ ] Payment integration for art sales
- [ ] Admin panel for content moderation
- [ ] Multi-language support (English, Wolof, Mandinka)

---

**Made with ❤️ for Gambian artists and art lovers worldwide**