import { DocCard } from "@/components";
import { themeType } from "@/lib/types";
import useMethodStore from "@/store/MethodStore";

type DocsProps = {
  theme: themeType | undefined;
};

type fetchedDocType = {
  title: string;
  text: string;
}[];

const Docs = ({ theme }: DocsProps) => {
  const fetchDocs: fetchedDocType = [];
  const {toggleModal} = useMethodStore()

  return (
    <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
      {fetchDocs?.map((doc) => (
        <DocCard
          title={doc.title}
          text={doc.text}
          color={theme == "black" ? "bg-black" : "bg-emerald-400"}
          setIsModalOpen={toggleModal}
        />
      ))}
      <div className="h-2"></div>
    </div>
  );
};

export default Docs;
