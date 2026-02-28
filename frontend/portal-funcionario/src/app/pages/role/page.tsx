"use client";
// app/roles/page.tsx  (or wherever you place it in your app router)

import { useRouter } from "next/navigation";
import RolePortal from "@/app/feature/role/rolePortal";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950">
      <RolePortal />
    </div>
  );
}
