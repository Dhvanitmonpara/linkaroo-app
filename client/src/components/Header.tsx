import { Input } from "./ui/input";

const Header = () => {
  return (
    <nav className="h-20 py-5">
      <Input placeholder="Search something..." />
    </nav>
  );
};

export default Header;
