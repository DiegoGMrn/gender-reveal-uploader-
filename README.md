# 🎀 Gender Reveal Uploader 💙

A modern, responsive web application for uploading and sharing photos and videos for gender reveal celebrations. Built with Next.js, TypeScript, and Tailwind CSS, fully containerized with Docker.

## ✨ Features

- 📸 **Photo & Video Upload**: Support for images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, MOV)
- 🖼️ **Beautiful Gallery**: Responsive grid layout to view all uploaded memories
- 🎨 **Gender Reveal Theme**: Pink and blue gradient design with modern UI
- 🐳 **Docker Support**: Fully containerized application with persistent storage
- 📦 **Volume Storage**: Files are stored in Docker volumes for persistence
- ⚡ **Modern Stack**: Next.js 14+ with TypeScript and Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🔒 **File Validation**: Size limits (10MB) and type checking for security

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/DiegoGMrn/gender-reveal-uploader-.git
   cd gender-reveal-uploader-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

3. **Stop the application**
   ```bash
   docker-compose down
   ```

4. **Remove volumes (deletes uploaded files)**
   ```bash
   docker-compose down -v
   ```

## 📁 Project Structure

```
gender-reveal-uploader/
├── app/
│   ├── api/
│   │   ├── upload/          # File upload endpoint
│   │   ├── files/           # List uploaded files endpoint
│   │   └── serve/           # Serve uploaded files endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page with upload & gallery
├── uploads/                 # Uploaded files directory
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Project dependencies
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+, React 19+, TypeScript
- **Styling**: Tailwind CSS with custom gender reveal theme
- **Backend**: Next.js API Routes
- **File Storage**: Docker volumes (local filesystem)
- **Containerization**: Docker & Docker Compose

## 🎨 Theme & Design

The application features a beautiful gender reveal theme with:
- Pink and blue color gradients
- Responsive card-based gallery
- Modern, clean interface
- Smooth animations and transitions
- Emoji accents for a festive feel

## 🔧 Configuration

### File Upload Limits

Default limits are set in `app/api/upload/route.ts`:
- **Maximum file size**: 10MB
- **Allowed types**: JPEG, PNG, GIF, WebP, MP4, WebM, MOV

To change these limits, edit the `maxSize` and `allowedTypes` variables.

### Docker Volumes

Uploaded files are persisted in a Docker volume named `uploads-data`. This ensures files remain even if the container is restarted.

## 🌟 Future Enhancements

Potential features for future development:
- 🔐 Google Drive API integration for cloud storage
- 🔒 User authentication and private galleries
- 🏷️ Tags and categories for photos
- 💬 Comments and reactions
- 📤 Social media sharing
- 🎵 Background music player
- 🎯 Voting/guessing feature for gender

## 📝 License

ISC

## 👤 Author

Created for gender reveal celebrations with love 💕

---

Made with ❤️ using Next.js, React, and Tailwind CSS
