import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@tome/ui/components/empty"
import { IconAlertCircle } from "@tome/ui/icons"

export function NotFound({ children }: { children?: any }) {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconAlertCircle />
        </EmptyMedia>
        <EmptyTitle>Page Not Found</EmptyTitle>
        <EmptyDescription>
          {children || "The page you are looking for does not exist."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
