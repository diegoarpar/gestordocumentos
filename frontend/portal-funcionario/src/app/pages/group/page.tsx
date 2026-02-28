"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent } from 'react'
import Login from "@/app/api/userServices";
import Tenant from "@/app/api/tenantServices";
import { useEffect, useState } from 'react';
import Portal from "@/app/feature/portal/portal";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    Tenant.tenant()
      .then((response) => response.json())
      .then((data) => {
      });
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const onSubmit = async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget);
    const dataInfo = {data:formData.get("email") + ":" + formData.get("password")};
    const dataRaw = JSON.stringify(dataInfo);
    const response = await Login.LogIn(dataRaw);
    setIsLoading(false);
    if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }
    // Handle response if necessary
    const data = await response.json()
    // ...
    const close = () => router.push("../../");
  }
  const close = () => router.push("../../");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Portal></Portal>
    </div>
  );
}