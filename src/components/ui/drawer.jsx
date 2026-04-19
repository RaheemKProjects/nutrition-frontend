import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Drawer = ({ open, onOpenChange, children, ...props }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <div {...props}>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80" onClick={() => onOpenChange(false)} />
      )}
      <div
        className={cn(
          "fixed inset-0 z-50 pointer-events-none",
          open && "pointer-events-auto"
        )}
      >
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto max-h-[85vh] flex-col rounded-t-[10px] bg-background border-t border-border p-4 pt-6 shadow-lg transition-transform duration-300 ease-in-out",
            open ? "translate-y-0" : "translate-y-full"
          )}
          style={{
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
          {children}
        </div>
      </div>
    </div>
  )
}

const DrawerClose = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
      className
    )}
    onClick={onClick}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
))
DrawerClose.displayName = "DrawerClose"

const DrawerHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = "DrawerDescription"

const DrawerContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("overflow-y-auto", className)} {...props} />
))
DrawerContent.displayName = "DrawerContent"

const DrawerFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
}