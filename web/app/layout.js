import "./globals.css";
import "./guardrails.css";
import "./lead-form.css";

export const metadata = {
  title: "Northstar Motors | Lead Desk",
  description: "A Laya-powered sales lead triage demo for a car dealership.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
