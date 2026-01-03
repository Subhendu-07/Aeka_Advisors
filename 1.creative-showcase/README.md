# 🎨 Creative Showcase Web App

A full-stack **MERN** based web application where users can upload, showcase, like, and manage creative images with a modern neon-glass UI.



## 🚀 Live Demo

![Vercel](https://vercelbadge.vercel.app/api/your-vercel-username/your-project-name)

🌐 **Frontend:** https://your-frontend-link.vercel.app  
⚙️ **Backend API:** https://your-backend-link.onrender.com  

> _(Links will be updated after deployment)_



## 🚀 Features

### 🔐 Authentication
- User Signup & Login (JWT based)
- Protected Routes (Dashboard & Profile)
- Logout support

### 🖼 Image Management
- Upload image via URL
- Drag & Drop image URL support
- Delete image (owner only)
- Public & Private galleries

### ❤️ Interaction
- Like / Unlike images
- Animated like count (Framer Motion)
- Real-time UI update

### 👤 Profiles
- Private Dashboard (own images)
- Public Profile (`/profile/:username`)
- Masonry-style gallery layout

### ✨ UI / UX
- Neon + Glassmorphism design
- Responsive (mobile, tablet, desktop)
- Image modal preview
- Lazy loading images
- Smooth hover & click animations



## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- CORS & dotenv



## 🗂 Project Structure

### 📦 Client (Frontend)
```text
client/
├── src/
│ ├── components/
│ │ ├── DragDropUpload.jsx
│ │ ├── ImageCard.jsx
│ │ ├── ImageModal.jsx
│ │ ├── Navbar.jsx
│ │ └── ProtectedRoute.jsx
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Landing.jsx
│ │ ├── Login.jsx
│ │ ├── PublicProfile.jsx
│ │ └── Signup.jsx
│ ├── utils/
│ │ └── api.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── index.html
├── package.json
```

### 🛠 Server (Backend)
```text
server/
├── middleware/
│ └── auth.js
├── models/
│ ├── Image.js
│ └── User.js
├── routes/
│ ├── auth.js
│ └── images.js
├── .env
├── server.js
├── package.json
```

---

## 🔑 Environment Variables

Create a `.env` file inside **server/**:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

---

## ▶️ How to Run Locally

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/creative-showcase.git
cd creative-showcase

### 2️⃣ Install Server Dependencies

cd server
npm install
npm run start

Server will run on:
👉 http://localhost:5000

### 3️⃣ Install Client Dependencies

cd client
npm install
npm run dev

Client will run on:
👉 http://localhost:5173

---

## 🔒 Protected Routes
- /dashboard → Login required
- /profile/:username → Public profile
- /login, /signup → Auth pages

## 📸 Screens & UI
- Neon glass upload card
- Masonry gallery
- Hover actions (like, delete)
- Image preview modal

## 📌 Future Improvements
- 🔍 Image search & filter
- 💬 Comments system
- 🖼 Cloudinary upload
- 📊 Analytics dashboard
- 🌙 Theme toggle

---

## 👨‍💻 Author

Subhendu Mandal

💼 Backend / Full-Stack Developer
Passionate about clean UI & scalable backend systems ✨
