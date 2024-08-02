import "./App.css";
import { DocCard, ListCard } from "./components";
import Header from "./components/Header";

function App() {
  return (
    <>
      {/* <EditList/> */}
      <div className="grid grid-cols-7">
        <div className="col-span-2 py-5 px-7 space-y-3 overflow-y-scroll max-h-screen">
          <ListCard
            tagname="Hello"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
            title="Hellow"
            color="bg-red-400"
          />
        </div>
        <div className="col-span-3 max-h-screen">
          <Header />
          <div className="h-[calc(100vh-5rem)] overflow-y-scroll w-full space-y-2">
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color="bg-emerald-400"
            />
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
