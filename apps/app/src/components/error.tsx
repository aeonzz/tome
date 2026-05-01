import { Button } from "@tome/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@tome/ui/components/empty"
import { IconAlertCircle } from "@tome/ui/icons"

export function Error({
  error,
  reset,
  className,
}: {
  error?: unknown
  reset?: () => void
  className?: string
}) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconAlertCircle />
        </EmptyMedia>
        <EmptyTitle>Something went wrong</EmptyTitle>
        <EmptyDescription>
          {error instanceof Error
            ? (error as Error).message
            : typeof error === "string"
              ? error
              : "An unexpected error occurred."}
        </EmptyDescription>
        {reset && (
          <div className="pt-2">
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
          </div>
        )}
      </EmptyHeader>
    </Empty>
  )
}
