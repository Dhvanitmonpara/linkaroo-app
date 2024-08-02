import "./App.css";
import { ListCard, DocCard } from "./components";
import Header from "./components/Header";

function App() {
  return (
    <>
      <div className="grid grid-cols-7">
        <div className="col-span-2 py-5 px-7 space-y-3 overflow-y-scroll max-h-screen">
          <ListCard tagname="Hello" title="welcome" description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit? Ipsa corporis consequatur omnis rem fugit odio, temporibus esse." color="bg-sky-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-violet-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-rose-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-blue-400" />
          <ListCard tagname="Hello" title="welcome" description="bruhh" color="bg-amber-400" />
        </div>
        <div className="col-span-3 max-h-screen">
          <Header/>
          <div className="h-[calc(100vh-5rem)] overflow-y-scroll w-full space-y-2">
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
            <DocCard text="kya hua" color="bg-emerald-400"/>
          </div>
        </div>
        <div className="col-span-2 px-5 overflow-y-scroll max-h-screen">
          <div className="min-h-full w-full border-2"></div>
        </div>
      </div>
    </>
  );
}

export default App;
