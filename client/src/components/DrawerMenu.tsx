import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import { ReactNode } from "react";

type DrawerMenuProps = {
  children: ReactNode;
  trigger: ReactNode;
  className?: string;
  triggerClassNames?: string
  contentClassName?: string;
  title?: string;
};

export default function DrawerMenu({
  children,
  trigger,
  triggerClassNames = "",
  contentClassName = "",
  className = "",
  title,
}: DrawerMenuProps) {
  return (
    <Drawer>
      <DrawerTrigger className={triggerClassNames} asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className={`sm:w-[400px] w-11/12 m-auto dark:bg-zinc-900 text-white border-zinc-700 ${className}`}
      >
        {title && (
          <DrawerHeader className="flex w-full justify-between items-center">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <RxCross2 className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
        )}
        <div className={`flex-1 overflow-auto py-4 ${contentClassName}`}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
