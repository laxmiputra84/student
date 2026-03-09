// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import LayoutWrapper from "@/components/layout-wrapper";

export const metadata = {
  title: "Aura Student Portal",
  description: "Advanced Real-Time Student Management Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground font-['Inter'] min-h-screen">
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}