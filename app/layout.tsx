import "./globals.css";
import Header from "@/components/Header"; // Client component

export const metadata = {
  title: "Zenardy Projects",
  description: "Project Management App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        <main className="p-6 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
