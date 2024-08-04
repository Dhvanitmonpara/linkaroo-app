import axios from "axios";
import { useEffect } from "react";
import useProfileStore from "../store/hay.js"

const LoginPage = () => {

    const {} = useProfileStore()

  const userLogin = async () => {
    try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_API_URL}/users/login`,
          {
            username: "dhavnitmonpara",
            email: "test@test.com",
            password: "12345678",
          }
        );
        
        return response?.data;
    } catch (error) {
        console.error("Error while logging user: ", error)
    }
  };

  useEffect(() => {
    (async () => {
      const loggedInUser = await userLogin();

      if (loggedInUser) {

        

      } 

    })();
  });

  return (
    <div>
      <h1>Login Page</h1>
      {/* Add form for login */}
    </div>
  );
};

export default LoginPage;
