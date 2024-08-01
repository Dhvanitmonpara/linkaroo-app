import "./App.css";
import { ListCard } from "./components";

function App() {
  return (
    <>
      <div className="grid grid-cols-7">
        <div className="col-span-2 py-5 px-7 space-y-3">
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="green" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="violet" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="rose" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="sky" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="amber" />
        </div>
        <div className="col-span-3">
          {/* <div className="border-red-800 h-52 w-`full border-2"></div> */}
        </div>
        <div className="col-span-2">
          {/* <div className="border-red-800 h-52 w-full border-2"></div> */}
        </div>
      </div>
    </>
  );
}

export default App;
