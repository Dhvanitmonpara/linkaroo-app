type colorOptions =
  | "bg-zinc-200"
  | "bg-emerald-400"
  | "bg-orange-600"
  | "bg-red-400"
  | "bg-purple-400"
  | "bg-pink-400"
  | "bg-indigo-400"
  | "bg-teal-400"
  | "bg-cyan-400"
  | "bg-amber-400"
  | "bg-violet-400"
  | "bg-yellow-400"
  | "bg-green-400"
  | "bg-blue-400"
  | "bg-rose-400"
  | "bg-sky-400"
  | "bg-black";

type themeType = "light" | "black" | "dark";

type profileOptions = "profile" | "settings" | "feedback";

type Collaborator = {
  _id: string;
  username: string;
  email: string;
  avatarImage: string;
  fullName: string;
};

type TagType = {
  _id: string;
  tagname: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

type fontOptions = "font-mono" | "font-sans" | "font-serif" | "font-helvetica";

type fetchedTagType = {
  __v: number;
  _id: string;
  createdAt: string;
  owner: string;
  tagname: string;
  updatedAt: string;
};

type fetchedLinkType = {
  _id: string;
  title: string;
  description: string;
  link: string;
  userId: string;
  listId: string;
  createdAt: string;
  isChecked: boolean;
  updatedAt: string;
  __v: number;
};

type fetchedCollectionType = {
  _id: string;
  collaborators: Collaborator[];
  createdBy: Collaborator;
  description: string;
  tags: TagType[];
  isInbox: boolean;
  theme: colorOptions;
  isPublic: boolean;
  title: string;
  icon: string
  coverImage: string;
  createdAt: string;
  updatedAt: string;
};

type cachedLinks = {
  collectionId: string;
  links: fetchedLinkType[];
};

type NotificationType = {
  id: string;
  title: string;
  description: string;
  time: string;
}

export type {
  colorOptions,
  themeType,
  profileOptions,
  TagType,
  fetchedCollectionType,
  Collaborator,
  fontOptions,
  fetchedLinkType,
  fetchedTagType,
  cachedLinks,
  NotificationType
};