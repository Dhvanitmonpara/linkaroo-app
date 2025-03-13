import { Collections, Links } from "../components";

function DashboardPage() {
  return (
    <>
      <div
        className={`grid xl:grid-cols-7 lg:grid-cols-5 grid-cols-3 gap-4 !bg-black !text-while`}
      >
        <Collections />
        <Links />
      </div>
    </>
  );
}

export default DashboardPage;
