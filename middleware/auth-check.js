import jwt_decode from "jwt-decode";
export default function ({ $axios, route, app, store, $auth, redirect }) {
  // If the user is not authenticated
  if (!$auth.loggedIn) {
    redirect("/");
  } 
  else {
    
  }
}
