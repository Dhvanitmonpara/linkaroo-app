import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "react-responsive"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

function ResponsiveDialog({
  children,
  trigger,
  title,
  description,
  isOpen = false,
  className = "",
  showCloseButton = true,
  prebuildForm = true,
  triggerStyling = "",
  cancelText = "Cancel"
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  trigger: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  showCloseButton?: boolean;
  triggerStyling?: string;
  prebuildForm?: boolean;
  cancelText?: string
}) {
  const [open, setOpen] = React.useState(isOpen)
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className={`sm:max-w-[27.2rem] ${className}`} showCloseButton={showCloseButton && prebuildForm}>
          {prebuildForm ? <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader> :
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                  {description}
                </DialogDescription>
              </DialogHeader>
            </VisuallyHidden>
          }
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className={triggerStyling} asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className={`dark:bg-zinc-900 ${className}`}>
        {prebuildForm && <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            {description}
          </DrawerDescription>
        </DrawerHeader>}
        {children}
        {showCloseButton && <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="ghost">{cancelText}</Button>
          </DrawerClose>
        </DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}

export default ResponsiveDialog