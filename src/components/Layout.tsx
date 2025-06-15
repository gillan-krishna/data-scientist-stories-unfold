
import Header from "@/components/shared/Header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
