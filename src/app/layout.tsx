import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle de Funcionários | DoQR Tecnologia",
  description: "Gerenciamento de funcionários",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!w-[320px] !min-w-0",
            style: {
              background: "var(--primary)",
              color: "#ffffff",
              border: "none",
            },
            classNames: {
              error: "!bg-destructive !text-white !border-none",
            },
          }}
        />
      </body>
    </html>
  );
}
