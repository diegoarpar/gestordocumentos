"use client";

import { useRouter } from "next/navigation";
import UserGroupPortal from "@/app/feature/userGroup/userGroupPortal";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950">
      <UserGroupPortal />
    </div>
  );
}
