import axios from "axios";
// import { useEffect } from "react";
import useProfileStore from "../store/profileStore.js";

const LoginPage = () => {
  const { addProfile } = useProfileStore();

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

      if (response?.data) {
        addProfile(response.data);
      }

      return response?.data;
    } catch (error) {
      console.error("Error while logging user: ", error);
    }
  };

  // useEffect(() => {
  //   (async () => {

  //     const loggedInUser = await userLogin();

  //     if (loggedInUser) {
  //       addProfile(loggedInUser);
  //     }

  //   })();
  // }, [addProfile]);

  return (
    <div>
      <h1>Login Page</h1>
      <form
        action="post">
        <button onSubmit={userLogin}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
