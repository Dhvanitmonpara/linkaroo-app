import { colorOptions } from "@/lib/types";

type DocScreenProps = {
  color: colorOptions;
};

const DocScreen = ({ color }: DocScreenProps) => {
  return (
    <div
      className={`h-full w-full ${
        color == "bg-black"
          ? "bg-zinc-900 text-zinc-300"
          : color + " text-zinc-900"
      }  flex flex-col p-5`}
    >
      <h1 className="text-4xl font-semibold pt-3">Hello</h1>
      <a
        href="google.com"
        className={`pt-3 hover:text-black ${
          color == "bg-black" ? "dark:hover:text-white" : ""
        } cursor-pointer hover:underline`}
      >
        google.com
      </a>
      <p className="pt-5">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe
        consequatur enim laborum accusamus similique tenetur, vitae odio atque
        animi, asperiores maxime totam quia, temporibus repudiandae. Nisi, error
        illo iste cupiditate quo possimus quam unde sit! Ab, inventore
        voluptatibus.
      </p>
    </div>
  );
};

export default DocScreen;
