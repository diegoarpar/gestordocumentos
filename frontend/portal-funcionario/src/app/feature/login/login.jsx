'use client'
import React from 'react';
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link.js";
function Login(props) {
  const onClick= props.onClick;
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const loginPage = () => router.push("/../../pages/login");
  return (
    <>
        <button
            type="button"
            onClick={loginPage}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
          >
            LogIn
          </button>

    </>
  );
}
  

export default Login;