import React from "react"
import { useTRPC } from "@/utils/trpc"
import { useForm } from "@tanstack/react-form"
import { useHotkey } from "@tanstack/react-hotkeys"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { BookmarkPlusIcon } from "lucide-react"
import * as z from "zod"

import { Button } from "@tome/ui/components/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@tome/ui/components/combobox"
import { CommandDialogFooter, CommandView } from "@tome/ui/components/command"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@tome/ui/components/field"
import { Input } from "@tome/ui/components/input"
import { Textarea } from "@tome/ui/components/textarea"

import type { Collection, Tag } from "@/types/db"

import { HotkeyBadge } from "../hotkey-badge"

const formSchema = z.object({
  url: z.url("Please enter a valid URL"),
  description: z.string(),
  tags: z.array(z.string()),
  collectionId: z.string(),
})

export function CreateBookmarkView({
  defaultUrl = "",
  onSuccess,
  onBack,
}: {
  defaultUrl?: string
  onSuccess: () => void
  onBack?: () => void
}) {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const anchor = useComboboxAnchor()
  const viewRef = React.useRef<HTMLDivElement>(null)
  const [query, setQuery] = React.useState("")

  const { data: tags } = useSuspenseQuery(
    trpc.tag.queries.getAll.queryOptions()
  )

  const { data: collections } = useSuspenseQuery(
    trpc.collection.queries.getAll.queryOptions()
  )

  const createTag = useMutation(
    trpc.tag.mutations.create.mutationOptions({
      onSuccess: (newTag) => {
        queryClient.setQueryData(
          trpc.tag.queries.getAll.queryKey(),
          (old: Tag[] | undefined) => (old ? [...old, newTag] : [newTag])
        )
      },
      onSettled: () => {
        return queryClient.invalidateQueries({
          queryKey: trpc.tag.queries.getAll.queryKey(),
        })
      },
      onError: (error) => {
        console.error(error)
      },
    })
  )

  const form = useForm({
    defaultValues: {
      url: defaultUrl,
      description: "",
      tags: [] as string[],
      collectionId: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        description: value.description || undefined,
        collectionId: value.collectionId || undefined,
      }
      console.log(payload)
      // Logic will be added later
      // onSuccess()
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

  return (
    <React.Fragment>
      <CommandView
        ref={viewRef}
        tabIndex={-1}
        className="outline-none"
        onBack={() => onBack?.()}
      >
        <form
          id="create-bookmark-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.target as HTMLElement).tagName !== "TEXTAREA"
            ) {
              e.preventDefault()
            }
          }}
          className="flex flex-col justify-start items-center w-full px-2 py-4 h-full min-h-0 overflow-y-auto"
        >
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <form.Field
              name="url"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Link</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://example.com"
                        autoFocus
                        autoComplete="off"
                        aria-invalid={isInvalid}
                      />
                    </FieldContent>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Description (optional)
                    </FieldLabel>
                    <FieldContent>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Add a brief description..."
                        className="resize-none min-h-20"
                        aria-invalid={isInvalid}
                      />
                    </FieldContent>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="collectionId"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Collection</FieldLabel>
                    <FieldContent>
                      <Combobox
                        autoHighlight
                        itemToStringLabel={(item) => item.name}
                        itemToStringValue={(item) => item.id}
                        items={collections}
                        value={collections.find(
                          (option) => option.id === field.state.value
                        )}
                        onValueChange={(value) => {
                          if (!value) {
                            field.handleChange("")
                            return
                          }

                          field.handleChange(value.id)
                        }}
                      >
                        <ComboboxInput placeholder="Collection" showClear />
                        <ComboboxContent variant="elevated">
                          <ComboboxEmpty>No collections found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: Collection) => (
                              <ComboboxItem key={item.id} value={item}>
                                {item.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </FieldContent>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="tags"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                    <FieldContent>
                      <Combobox
                        multiple
                        autoHighlight
                        isItemEqualToValue={(item, value) => item.id === value}
                        itemToStringLabel={(item) => item.name}
                        itemToStringValue={(item) => item.id}
                        items={(() => {
                          const trimmed = query.trim()
                          const lowered = trimmed.toLocaleLowerCase()
                          const availableItems = tags.filter(
                            (item) => !field.state.value.includes(item.id)
                          )
                          const exactExists = tags.some(
                            (item) =>
                              item.name.trim().toLocaleLowerCase() === lowered
                          )

                          return trimmed !== "" && !exactExists
                            ? [
                                ...availableItems,
                                {
                                  id: `create:${trimmed}`,
                                  name: trimmed,
                                  isCreate: true,
                                },
                              ]
                            : availableItems
                        })()}
                        value={field.state.value}
                        onValueChange={(next: any[]) => {
                          const lastSelected = next[next.length - 1]

                          if (lastSelected && lastSelected.isCreate) {
                            createTag.mutate(
                              { name: lastSelected.name },
                              {
                                onSuccess: (newTag) => {
                                  field.handleChange([
                                    ...field.state.value,
                                    newTag.id,
                                  ])
                                },
                              }
                            )
                            setQuery("")
                            return
                          }

                          field.handleChange(
                            next.map((item) =>
                              typeof item === "string" ? item : item.id
                            )
                          )
                        }}
                        inputValue={query}
                        onInputValueChange={setQuery}
                      >
                        <ComboboxChips ref={anchor} className="w-full">
                          <ComboboxValue>
                            {(values: string[]) => {
                              const isOptimisticVisible =
                                createTag.isPending &&
                                createTag.variables &&
                                !values.some(
                                  (val) =>
                                    tags.find((t) => t.id === val)?.name ===
                                    createTag.variables?.name
                                )

                              return (
                                <React.Fragment>
                                  {values.map((val) => {
                                    const tag = tags.find((t) => t.id === val)
                                    return (
                                      <ComboboxChip key={val}>
                                        {tag ? tag.name : val}
                                      </ComboboxChip>
                                    )
                                  })}
                                  {isOptimisticVisible && (
                                    <ComboboxChip
                                      key="optimistic-tag"
                                      className="opacity-50"
                                    >
                                      {createTag.variables.name}
                                    </ComboboxChip>
                                  )}
                                  <ComboboxChipsInput
                                    placeholder={
                                      !field.state.value.length &&
                                      !isOptimisticVisible
                                        ? "Tags"
                                        : ""
                                    }
                                  />
                                </React.Fragment>
                              )
                            }}
                          </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent variant="elevated" anchor={anchor}>
                          <ComboboxEmpty>No tags found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: any) => {
                              if (item.isCreate) {
                                return (
                                  <ComboboxItem key={item.id} value={item}>
                                    Create: {item.name}
                                  </ComboboxItem>
                                )
                              }
                              return (
                                <ComboboxItem key={item.id} value={item}>
                                  {item.name}
                                </ComboboxItem>
                              )
                            }}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </FieldContent>
                    {isInvalid && (
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
            <BookmarkPlusIcon className="size-4" />
            <span>Create bookmark</span>
          </div>
          <form.Subscribe
            selector={(state) => [state.isSubmitting]}
            children={([isSubmitting]) => (
              <Button
                type="submit"
                form="create-bookmark-form"
                disabled={isSubmitting || createTag.isPending}
                size="sm"
                variant="ghost"
              >
                Save bookmark
                <HotkeyBadge shortcut={{ type: "chord", value: "Mod+Enter" }} />
              </Button>
            )}
          />
        </CommandDialogFooter>
      </CommandView>
    </React.Fragment>
  )
}
