import { Outlet } from "react-router-dom";
import "./App.css";

const App = () => {

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default App;