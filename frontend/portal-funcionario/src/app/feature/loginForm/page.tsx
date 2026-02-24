"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent } from 'react'
import Login from "@/app/api/userServices";
import Tenant from "@/app/api/tenantServices";
import { useEffect, useState } from 'react';

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
    const dataInfo = {user: {name: formData.get("email"), credential: [{name: "password: ", value: formData.get("password")}]}};
    const dataRaw = JSON.stringify(dataInfo);
    console.log(dataInfo);
    const response = await Login.LogIn(dataInfo);
    setIsLoading(false);
    if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }
    // Handle response if necessary
    //const data = await response.json()
    // ...
    router.push("../../pages/portal");
    
  }
  const close = () => router.push("../../");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={onSubmit}
        action="/search"
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Log In
        </h2>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {isLoading? "Wait": "Log in"}
          </button>

          <button
            type="button"
            onClick={close}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </p>
      </form>
    </div>
  );
}
