import "./globals.css";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Service Request Board",

  description: "Professional service marketplace platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="
        bg-[#F8FAFC]
        text-[#0F172A]
        antialiased
        min-h-screen
        "
      >
        <AuthProvider>
          {/* TOAST SYSTEM */}
          <Toaster
            position="top-right"
            gutter={10}
            containerStyle={{
              top: 20,
              right: 20,
            }}
            toastOptions={{
              duration: 2500,

              style: {
                background: "#FFFFFF",

                color: "#0F172A",

                border: "1px solid #E2E8F0",

                borderRadius: "14px",

                padding: "12px 14px",

                fontSize: "14px",

                fontWeight: "500",

                boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
              },

              success: {
                iconTheme: {
                  primary: "#10B981",

                  secondary: "#FFFFFF",
                },
              },

              error: {
                iconTheme: {
                  primary: "#EF4444",

                  secondary: "#FFFFFF",
                },
              },
            }}
          />

          {/* APP */}
          <main
            className="
            min-h-screen
            "
          >
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
