import React from "react";
import NavbarComponents from "@/components/Navbar";

function UserLayout({ children }) {
  return (
    <div>
      <NavbarComponents />

      {children}
    </div>
  );
}

export default UserLayout;
