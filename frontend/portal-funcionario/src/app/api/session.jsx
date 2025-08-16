"use server";

import UsersServices from "@/app/api/userServices";
import { cookies } from 'next/headers';

const SetSessionCookie = async function(session){
  const cookieStore = await cookies();
  cookieStore.remove("session");
  if(!!session)
  cookieStore.set("session", session, { expires: 1 });
  //Cookies.set("session", session, { expires: session.expires_in });
};

const GetSessionCookie = async function() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie === undefined) {
    return {};
  } else {
    return JSON.parse(sessionCookie);
  }
};

const SetSessionCookieTenant = async function(session) {
  const cookieStore = await cookies();
  cookieStore.remove("tenant");
  if(!!session)
  cookieStore.set("tenant", session);
  //Cookies.set("session", session, { expires: session.expires_in });
};

const GetSessionCookieTenant = async function() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("tenant");

  if (sessionCookie === undefined||sessionCookie=== null) {
    UsersServices.GetTenant({"url":window.location.hostname}).then(
      (data)=>{
        if(data!=null){
          SetSessionCookieTenant(data);
          return data;
        }
      }
    )
    return {};
  } else {
    return JSON.parse(sessionCookie);
  }
};

const SessionCookie= async function() {
   
  };

export {SetSessionCookie,GetSessionCookie,SetSessionCookieTenant,GetSessionCookieTenant,SessionCookie};