import React from "react"
import { useTRPC } from "@/utils/trpc"
import { useActionMenuStore } from "@/hooks/use-action-menu"
import { useForm, useStore } from "@tanstack/react-form"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@tome/ui/components/button"
import { CommandDialogFooter, CommandView } from "@tome/ui/components/command"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@tome/ui/components/field"
import { Input } from "@tome/ui/components/input"
import { IconBrowser } from "@tome/ui/icons"

import { parseBookmarkFile } from "@/lib/parse-bookmarks"

import { DotmCircular19 } from "../dotm-circular-19"
import { HotkeyBadge } from "../hotkey-badge"

export function ImportBrowserView({
  onSuccess,
  onBack,
  onLockChange,
}: {
  onSuccess: () => void
  onBack?: () => void
  onLockChange?: (locked: boolean) => void
}) {
  const queryClient = useQueryClient()
  const viewRef = React.useRef<HTMLDivElement>(null)
  const trpc = useTRPC()
  const isComposeLocked = useActionMenuStore((s) => s.isComposeLocked)
  const [parsedTree, setParsedTree] = React.useState<Awaited<
    ReturnType<typeof parseBookmarkFile>
  > | null>(null)
  const [parseError, setParseError] = React.useState<string | null>(null)

  const importBookmarks = useMutation(
    trpc.bookmark.mutations.import.browserImport.mutationOptions({
      onSuccess: (data) => {
        toast.message("Import complete", {
          description: `Added ${data.created}, skipped ${data.skipped} duplicates`,
        })
        onSuccess()
      },
      onError: (error) => {
        toast.error(error.message || "Failed to import bookmarks")
      },
    })
  )

  async function handleFileChange(file: File | null) {
    setParsedTree(null)
    setParseError(null)
    if (!file) return
    try {
      const result = await parseBookmarkFile(file)
      setParsedTree(result)
    } catch (error) {
      setParseError(
        "Failed to parse the bookmark file. Make sure it's a valid browser export."
      )
      console.error("Failed to parse bookmarks:", error)
    }
  }

  const form = useForm({
    defaultValues: {
      file: null as File | null,
    },
    onSubmit: async ({ value }) => {
      if (!value.file || !parsedTree) return
      await importBookmarks.mutateAsync({ tree: parsedTree.tree })
    },
  })

  useHotkey(
    "Mod+Enter",
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    },
    { target: viewRef }
  )

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)

  React.useEffect(() => {
    onLockChange?.(isSubmitting)
  }, [isSubmitting, onLockChange])

  return (
    <React.Fragment>
      <CommandView
        ref={viewRef}
        tabIndex={-1}
        className="outline-none"
        onBack={() => onBack?.()}
        backDisabled={isComposeLocked}
      >
        <form
          id="import-browser-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex h-full min-h-0 w-full flex-col items-center justify-start overflow-y-auto px-2 py-4"
        >
          <div className="flex w-full max-w-sm flex-col gap-4 mt-4">
            <div className="mb-2 flex flex-col gap-1">
              <h3 className="text-sm font-medium text-foreground">
                Import Bookmarks
              </h3>
              <p className="text-xs text-muted-foreground">
                Upload an HTML file exported from your browser to import your
                bookmarks.
              </p>
            </div>
            <form.Field
              name="file"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Please select a file" : undefined,
              }}
              children={(field) => {
                const isInvalid = !field.state.meta.isValid || !!parseError
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      HTML Bookmarks File
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="file"
                        accept=".html"
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null
                          field.handleChange(file)
                          handleFileChange(file)
                        }}
                        autoFocus
                        aria-invalid={isInvalid}
                        className="cursor-pointer file:cursor-pointer file:text-foreground file:font-medium text-muted-foreground"
                      />
                    </FieldContent>
                    {parseError && <FieldError errors={[parseError]} />}
                    {!parseError && isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </div>
        </form>
        <CommandDialogFooter className="justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <IconBrowser className="size-4" />
            <span>Import from Browser</span>
          </div>
          <form.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              file: state.values.file,
            })}
            children={({ isSubmitting, file }) => (
              <Button
                type="submit"
                form="import-browser-form"
                disabled={isSubmitting || !file || !parsedTree || !!parseError}
                size="sm"
                variant="ghost"
              >
                {isSubmitting && <DotmCircular19 size={16} dotSize={3} />}
                Import bookmarks
                <HotkeyBadge shortcut={{ type: "chord", value: "Mod+Enter" }} />
              </Button>
            )}
          />
        </CommandDialogFooter>
      </CommandView>
    </React.Fragment>
  )
}
