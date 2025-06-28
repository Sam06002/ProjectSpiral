# Attendance Management System

A modern, responsive, and user-friendly web application for managing attendance in educational institutions. Built with React, TypeScript, and Material-UI.

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=Attendance+Management+System+Dashboard)

## ✨ Features

### 👨‍🎓 Student Portal
- View attendance records and statistics
- Filter attendance by date range and subject
- Download attendance reports in PDF/Excel

### 👩‍🏫 Teacher Portal
- Mark student attendance
- View class-wise attendance statistics
- Generate and export attendance reports
- Manage class schedules

### 👨‍💼 Admin Portal
- User management (add, edit, delete users)
- System-wide analytics and dashboards
- Class and subject management
- Role-based access control

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **State Management**: React Context API
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios
- **Charts**: Nivo
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sam06002/ProjectSpiral.git
   cd ProjectSpiral
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   The application will be available at [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── pages/              # Application pages
│   ├── admin/         # Admin portal pages
│   ├── auth/          # Authentication pages
│   ├── student/       # Student portal pages
│   └── teacher/       # Teacher portal pages
├── services/          # API services
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## 🔒 Default Login Credentials

- **Admin**:
  - Username: admin@example.com
  - Password: admin123

- **Teacher**:
  - Username: teacher@example.com
  - Password: teacher123

- **Student**:
  - Username: student@example.com
  - Password: student123

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Material-UI](https://mui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Nivo](https://nivo.rocks/)

---

<div align="center">
  Made with 💪 by Sane
</div>
