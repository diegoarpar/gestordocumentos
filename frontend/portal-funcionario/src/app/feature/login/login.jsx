'use client'
import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import LoginForm from "../loginForm/page"

function Login(props) {
  const router = useRouter();
  const [isFormEnabled, setFormEnable] = useState(false);
  const loginPage = () => router.push("/../../pages/login");
  const setTrueFormEnable = () => setFormEnable(true);
  return (
    <div>
        <button
            type="button"
            onClick={setTrueFormEnable}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
          >
            LogIn
          </button>
          <button
            hidden={!isFormEnabled}
            type="button"
            onClick={() => setFormEnable(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
          >
            Close
          </button>
      <div> {isFormEnabled && <LoginForm></LoginForm>}</div>
    </div>
  );
}
  

export default Login;