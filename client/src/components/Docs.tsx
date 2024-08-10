import { DocCard } from "@/components";
import { themeType } from "@/lib/types";

type DocsProps = {
  theme: themeType | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
};

type fetchedDocType = {
  title: string;
  text: string;
}[];

const Docs = ({ theme, setIsModalOpen }: DocsProps) => {
  const fetchDocs: fetchedDocType = [];

  return (
    <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
      {fetchDocs?.map((doc) => (
        <DocCard
          title={doc.title}
          text={doc.text}
          color={theme == "black" ? "bg-black" : "bg-emerald-400"}
          setIsModalOpen={setIsModalOpen}
        />
      ))}
      <div className="h-2"></div>
    </div>
  );
};

export default Docs;
