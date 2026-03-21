import "./globals.css"
import { Toaster } from "sonner";

export const metadata = {
  title: "Medisaver",
  description: "Medicine Admin Panel",
  icons: {
    icon: "/favicon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body >
        {children} 
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
