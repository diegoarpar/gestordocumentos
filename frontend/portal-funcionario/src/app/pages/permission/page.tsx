"use client";

import { useRouter } from "next/navigation";
import PermissionPortal from "@/app/feature/permission/permissionPortal";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950">
      <PermissionPortal />
    </div>
  );
}
