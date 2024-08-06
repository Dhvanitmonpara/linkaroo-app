import { Input } from "./ui/input";

const Header = () => {
  return (
    <nav className="h-20 py-5">
      <Input className="dark:bg-zinc-800 dark:text-white" placeholder="Search something..." />
    </nav>
  );
};

export default Header;
