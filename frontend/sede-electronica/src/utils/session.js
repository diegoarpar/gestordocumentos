import * as Cookies from "js-cookie";
import UsersServices from "../services/userServices"

const SetSessionCookie = (session: any): void => {
  Cookies.remove("session");
  if(!!session)
  Cookies.set("session", session, { expires: 1 });
  //Cookies.set("session", session, { expires: session.expires_in });
};

const GetSessionCookie: any = () => {
  const sessionCookie = Cookies.get("session");

  if (sessionCookie === undefined) {
    return null;
  } else {
    return JSON.parse(sessionCookie);
  }
};

const SetSessionCookieTenant = (session: any): void => {
  Cookies.remove("tenant");
  if(!!session)
  Cookies.set("tenant", session);
  //Cookies.set("session", session, { expires: session.expires_in });
};

const GetSessionCookieTenant: any = () => {
  const sessionCookie = Cookies.get("tenant");

  if (sessionCookie === undefined) {
    UsersServices.GetTenant({"url":window.location.hostname}).then(
      (data)=>{
        if(data!=null){
          SetSessionCookieTenant(data);
          return data;
        }
      }
    )
    return null;
  } else {
    return JSON.parse(sessionCookie);
  }
};

const SessionCookie= () => {
   
  };

export default  {SetSessionCookie,GetSessionCookie,SetSessionCookieTenant,GetSessionCookieTenant,SessionCookie};