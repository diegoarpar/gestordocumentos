"use client";

import { useRouter } from "next/navigation";
import RolePermissionPortal from "@/app/feature/rolePermission/rolePermissionPortal";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950">
      <RolePermissionPortal />
    </div>
  );
}
