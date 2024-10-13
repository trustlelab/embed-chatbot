"use client";

import { useState } from "react";

const navigation = [
  { name: "Fantasy", href: "#" },
  { name: "Mystery", href: "#" },
  { name: "Returns", href: "#" },
  { name: "About us", href: "#" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  return <div className="bg-white"></div>;
}
