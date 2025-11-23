import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "TriVantage Learning Institute",
  description:
    "Virtual training certificate courses for healthcare, leadership, and newcomer pathways.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-primary-dark">
        <Header />
        <div className="min-h-[calc(100vh-140px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}