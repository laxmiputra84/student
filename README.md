# Aura Student Portal 🎓

Aura is a premium, real-time student management experience built with **Next.js 15**, **Tailwind CSS 4**, and **Lucide Icons**. It features a state-of-the-art dark mode interface with glassmorphism effects and smooth micro-animations.

## ✨ Features

- **🚀 Hero Dashboard**: Real-time stats and personalized welcome.
- **📊 Academic Performance**: Deep insights into CGPA, credits, and semester progress.
- **📅 Attendance Tracking**: Course-wise visibility with critical shortage alerts.
- **📖 Course Catalog**: Explore and browse academic modules with enrollment status.
- **📢 Smart Announcements**: Categorized notifications with priority indicators.
- **🎨 Aura Design System**: Custom UI components built for premium aesthetics.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utility**: `clsx`, `tailwind-merge`
- **Animations**: CSS Keyframes + `animate-fade-in-up`

## 📦 Project Structure

```text
app/
├── announcements/  # Notifications and news
├── attendance/     # Presence tracking
├── courses/        # Module catalog
├── dashboard/      # Student profile and performance
├── components/     # Reusable UI system (Card, Badge, Button)
└── lib/            # Utility functions
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Supabase Setup

To enable live database features:

1. Create a project at [Supabase](https://supabase.com/).
2. Copy your **Project URL** and **Anon Key** to `.env.local`.
3. Create a `students` table with the following schema:
   - `id`: int8 (Primary Key)
   - `usn`: text
   - `name`: text
   - `branch`: text
   - `semester`: text
   - `attendance`: int4
   - `status`: text (e.g., 'Active', 'On Leave')

---
Designed with ❤️ for modern academia.
