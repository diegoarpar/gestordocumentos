import * as Cookies from "js-cookie";

const SetSessionCookie = (session: any): void => {
  Cookies.remove("session");
  if(!!session)
  Cookies.set("session", session, { expires: 1 });
  //Cookies.set("session", session, { expires: session.expires_in });
};

const GetSessionCookie: any = () => {
  const sessionCookie = Cookies.get("session");

  if (sessionCookie === undefined) {
    return {};
  } else {
    return JSON.parse(sessionCookie);
  }
};

const SessionCookie= () => {
   
  };

export default  {SetSessionCookie,GetSessionCookie,SessionCookie};