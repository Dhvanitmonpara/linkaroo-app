import "./App.css";
import { ListCard } from "./components";

function App() {
  return (
    <>
      <div className="grid grid-cols-7">
        <div className="col-span-2 py-5 px-7 space-y-3">
          <ListCard tagname="Hello" title="welcome" description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit? Ipsa corporis consequatur omnis rem fugit odio, temporibus esse." color="bg-sky-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-violet-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-rose-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-sky-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-amber-400" />
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
