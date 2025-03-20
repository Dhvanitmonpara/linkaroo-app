import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { removeUsernameTag } from "@/utils/toggleUsernameInTag";
import useLinkStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";
import formatLinks from "@/utils/formatLinks";
import DashboardWelcomeScreen from "./DashboardWelcomeScreen";
import LinkBanner from "./dashboard/LinkBanner";
import LinkMapper from "./dashboard/LinkMapper";

const Links = () => {
  const [loading, setLoading] = useState(false)

  const { cachedLinks, setLinks, addCachedLinkCollection, setCurrentCollectionItem, currentCollectionItem } = useLinkStore()
  const { collections } = useCollectionsStore()
  const { profile } = useProfileStore();
  const { currentCardColor } = useMethodStore();

  const { font } = profile;
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const { collectionId } = useParams()

  useEffect(() => {
    (async () => {
      if (location.includes("/c")) {
        try {
          if (!collectionId) {
            navigate("/dashboard")
            return
          }

          setLoading(true);
          const cache = cachedLinks.filter((collection) => collection.collectionId === collectionId)[0];

          const currentListRes = collections.find(
            (collection) => collection._id === collectionId
          )
          if (!currentListRes) {
            navigate("/dashboard")
            return
          }

          setCurrentCollectionItem(currentListRes);

          if (cache) {
            setLinks(cache.links);
          } else {
            const response: AxiosResponse = await axios.get(
              `${import.meta.env.VITE_SERVER_API_URL}/links/${collectionId}`,
              { withCredentials: true }
            );

            if (!response.data.data) {
              toast.error("Failed to fetch collection details");
              return;
            }

            const formattedLinks = formatLinks(response.data.data)
            setLinks(formattedLinks);
            addCachedLinkCollection({ collectionId, links: formattedLinks });
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              return
            }
            toast.error(error.message)
          } else {
            console.error(error);
            toast.error("Error while fetching collection details");
          }
        } finally {
          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCardColor, location, setLinks, setCurrentCollectionItem, addCachedLinkCollection, navigate]);

  const tags: string[] = [];

  currentCollectionItem?.tags?.forEach((tag) => {
    const tagname = removeUsernameTag(tag.tagname);
    if (tagname != undefined) {
      tags.push(tagname);
    }
  });

  if (loading) {
    return (
      <div
        className={`xl:px-0 lg:px-0 lg:pr-5 px-5 h-full select-none lg:col-span-3 xl:col-span-5 pr-5`}
      >
        <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
          <div className="dark:text-white h-full flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentCollectionItem?._id) {
    if (collections.length > 0) {
      navigate(`/dashboard/c/${collections[0]._id}`, { replace: true })
      return null
    } else {
      return <DashboardWelcomeScreen />
    }
  }

  return (
    <div
      className={`lg:pl-0 px-5 h-full select-none lg:col-span-3 xl:col-span-5 pr-5`}
    >
      <div className={`md:h-[calc(100vh-5rem)] lg:px-0 px-4 h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar ${font}`}>
        <div className="lg:h-2"></div>
        <LinkBanner loading={loading} tags={tags} key={currentCollectionItem._id}/>
        <LinkMapper />
      </div>
    </div>
  );
};

export default Links;
