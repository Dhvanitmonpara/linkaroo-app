import { ListCard } from "@/components";
import { themeType } from "@/lib/types";

type ListsProps = {
  theme: themeType | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
};

type fetchedListType = {
  tagname: string;
  description: string;
  title: string;
}[];

const Lists = ({ theme, setIsModalOpen }: ListsProps) => {
  const totalLists: fetchedListType = [];

  return (
    <div className="col-span-2 relative space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-5rem)]">
      {
        totalLists.map((list, index) => (
          <ListCard
            key={index}
            tagname={list.tagname}
            description={list.description}
            title={list.title}
            color="bg-red-400"
            isBlackMode={theme == "black" ? true : false}
            setIsModalOpen={setIsModalOpen}
          />
        ))

        // Add more list cards here as needed. Replace this comment with the actual list rendering code.
      }
      <div className="h-2"></div>
    </div>
  );
};

export default Lists;
