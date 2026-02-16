# Headshot

A modern web application for professional headshot generation and management, built with a full-stack TypeScript architecture.

## 📋 Overview

Headshot is a full-stack application designed to help users create, manage, and share professional headshots. The project leverages modern web technologies to deliver a seamless user experience across both frontend and backend components.

## 🏗️ Project Structure

```
headshot/
├── frontend/          # Client-side application
├── backend/           # Server-side API
├── .github/
│   └── workflows/    # CI/CD automation
└── .vscode/          # IDE configuration
```

## 🚀 Tech Stack

### Frontend
- **TypeScript** - Type-safe JavaScript
- **React/Next.js** (likely) - Modern UI framework
- **CSS/Styled Components** - Styling solution

### Backend
- **TypeScript** - Type-safe server-side code
- **Node.js** - JavaScript runtime
- **Express** (likely) - Web framework

## ✨ Features

- 📸 Professional headshot generation
- 👤 User profile management
- 🎨 Customizable styling options
- 💾 Secure data storage
- 🔐 Authentication & authorization
- 📱 Responsive design
- ⚡ Fast and optimized performance

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Clone the Repository

```bash
git clone https://github.com/shiinedev/headshot.git
cd headshot
```

### Backend Setup

```bash
cd backend
bun install
# Configure your environment variables
bun run dev
```

### Frontend Setup

```bash
cd frontend
bun install
# Configure your environment variables
bun run dev
```

## 🔧 Configuration

Create `.env` files in both `frontend` and `backend` directories with the following variables:

### Backend Environment Variables
## check **backend/src/config** to add all required enviroment Variables for backend

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Scripts

### Backend

```bash
bun run dev        # Start development server
```

### Frontend

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run lint      # Lint code
```


### Manual Deployment

1. Build both frontend and backend
2. Set production environment variables
3. Deploy backend to your server (e.g., AWS, Heroku, DigitalOcean)
4. Deploy frontend to a static hosting service (e.g., Vercel, Netlify)


## 📖 API Documentation

API documentation is available at `/api/docs` when running the backend server.

### Main Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `POST /api/headshots` - Create new headshot
- `GET /api/headshots` - Get all headshots
- `GET /api/headshots/:id` - Get specific headshot
- `PUT /api/headshots/:id` - Update headshot
- `DELETE /api/headshots/:id` - Delete headshot

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Bug Reports

If you discover a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Abdihakim (shiinedev)**
- GitHub: [@shiinedev](https://github.com/shiinedev)
- Location: London, United Kingdom
- Bio: MERN Stack Developer | Open Source Enthusiast | Building cool things in public

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern web development practices
- Built with passion and dedication to open source

## 📞 Support

For support, please:
- Open an issue on GitHub
- Contact the maintainer through GitHub
- Check existing documentation and issues first

## 🗺️ Roadmap

- [ ] Add more customization options
- [ ] Implement AI-powered enhancements
- [ ] Add social media integration
- [ ] Mobile app development
- [ ] Batch processing capabilities
- [ ] Advanced analytics dashboard

## 📊 Project Status

🚧 This project is actively maintained and under development.

---

**Star ⭐ this repository if you find it helpful!**
