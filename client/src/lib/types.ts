type colorOptions =
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
  | "bg-black"

type themeType = "light" | "black" | "dark";

type profileOptions = "profile" | "settings" | "feedback"

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

type fetchedListType = {
  _id: string;
  collaborators: Collaborator[];
  createdBy: Collaborator;
  description: string;
  font: string;
  tags: TagType[];
  theme: colorOptions;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type { colorOptions, themeType, profileOptions, TagType, fetchedListType, Collaborator };
