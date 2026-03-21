"use client";
import Link from "next/link";
import logo from "@/public/imgi_1_logo.png";
import Image from "next/image";
export function Sidebar() {
  return (
    <aside className="w-64 border-r border-[#499f57]  p-6 bg-[#9fd6ce]">
      <Link href="/admin">
        <Image
          src={logo}
          alt="logo"
          width={200}
          height={200}
          className="rounded-lg object-contain"
        />
      </Link>
      {/* <h2 className="text-xl font-bold mb-6">Med Admin</h2> */}
      
      <nav className="space-y-3 mt-4">
        <Link
          href="/admin"
          className="block rounded-lg px-4 py-2 hover:bg-[#4ba04c] font-bold text-[#214c97]"
        >
          Search Requests
        </Link>
     
        <Link
          href="/medicine"
          className="block rounded-lg px-4 py-2 hover:bg-[#4ba04c] font-bold text-[#214c97]" 
        >
          All Medicine
        </Link>
      </nav>
    </aside>
  );
}
