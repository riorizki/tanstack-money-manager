import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionType } from '@/shared/constants/enums'
import { createCategorySchema } from '../schema/category.schema'
import type { CreateCategoryInput } from '../schema/category.schema'
import type { Category } from '../types'
import { inferCategoryVisual } from '../utils/category-presets'
import { getCategoryIconOption } from '../utils/category-icons'
import { getContrastColor } from '../utils/color-utils'
import { ColorPicker } from './ColorPicker'
import { IconPicker } from './IconPicker'

interface CategoryFormProps {
  mode?: 'create' | 'edit'
  defaultValues?: Partial<CategoryFormValues>
  categories?: Category[]
  excludeCategoryId?: string
  isSubmitting?: boolean
  errorMessage?: string
  submitLabel?: string
  onSubmit: (data: CreateCategoryInput) => void
  onCancel?: () => void
}

type CategoryFormValues = z.input<typeof createCategorySchema>
type CategorySubmitValues = z.output<typeof createCategorySchema>

const TYPE_OPTIONS = [
  { value: TransactionType.EXPENSE, label: 'Expense' },
  { value: TransactionType.INCOME, label: 'Income' },
] as const

const DEFAULT_FORM_VALUES: CreateCategoryInput = {
  name: '',
  type: TransactionType.EXPENSE,
  color: null,
  icon: null,
  parentId: null,
}

const CATEGORY_SELECT_TRIGGER_CLASS =
  'h-12 rounded-none border-2 border-black bg-white px-3 text-base shadow-[4px_4px_0_0_#000] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:translate-x-[1px] data-[state=open]:translate-y-[1px] data-[state=open]:shadow-[3px_3px_0_0_#000]'

const CATEGORY_SELECT_CONTENT_CLASS =
  'rounded-none border-2 border-black bg-white p-0 shadow-[5px_5px_0_0_#000]'

const CATEGORY_SELECT_ITEM_CLASS =
  'rounded-none px-3 py-2 text-base font-medium tracking-[-0.01em] focus:bg-black focus:text-white data-[state=checked]:bg-black data-[state=checked]:text-white'

export function CategoryForm({
  mode = 'create',
  defaultValues,
  categories = [],
  excludeCategoryId,
  isSubmitting = false,
  errorMessage,
  submitLabel,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues, undefined, CategorySubmitValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      ...defaultValues,
      color: defaultValues?.color ?? null,
      icon: defaultValues?.icon ?? null,
      parentId: defaultValues?.parentId ?? null,
    },
  })

  const selectedType = form.watch('type')
  const selectedIcon = form.watch('icon')
  const selectedColor = form.watch('color')
  const categoryName = form.watch('name')

  const inferredVisual = useMemo(
    () => inferCategoryVisual(categoryName, selectedType),
    [categoryName, selectedType]
  )

  const selectedIconOption = getCategoryIconOption(
    selectedIcon,
    selectedType,
    categoryName
  )

  const parentOptions = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.type === selectedType && category.id !== excludeCategoryId
      ),
    [categories, excludeCategoryId, selectedType]
  )

  const previewColor = selectedColor ?? inferredVisual.color
  const iconContrast = getContrastColor(previewColor)

  function handleSubmit(data: CategorySubmitValues) {
    onSubmit({
      ...data,
      color: data.color ?? null,
      icon: data.icon ?? null,
      parentId: data.parentId ?? null,
    })
  }

  return (
    <article className="border-2 border-black bg-white shadow-[6px_6px_0_0_#000]">
      {/* Header - Compact */}
      <header className="border-b-2 border-black bg-black/5 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/50">
          {mode === 'create' ? 'Create Category' : 'Edit Category'}
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 bg-white px-4 py-4">
            {errorMessage && (
              <div className="border border-black bg-black/5 px-3 py-2">
                <p className="text-sm font-medium text-black">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., Food & Drinks"
                      className="h-10 rounded-none border border-black bg-white text-sm transition-all placeholder:text-black/30 focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Type & Parent Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                      Type
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className={CATEGORY_SELECT_TRIGGER_CLASS}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={CATEGORY_SELECT_CONTENT_CLASS}>
                        {TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className={CATEGORY_SELECT_ITEM_CLASS}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                      Parent
                    </FormLabel>
                    <Select
                      value={field.value ?? 'none'}
                      onValueChange={(value) => {
                        field.onChange(value === 'none' ? null : value)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className={CATEGORY_SELECT_TRIGGER_CLASS}>
                          <SelectValue placeholder="No parent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={CATEGORY_SELECT_CONTENT_CLASS}>
                        <SelectItem value="none" className={CATEGORY_SELECT_ITEM_CLASS}>
                          <span className="text-black/50">No parent</span>
                        </SelectItem>
                        {parentOptions.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-black/40">
                            No {selectedType.toLowerCase()} categories
                          </div>
                        ) : (
                          parentOptions.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className={CATEGORY_SELECT_ITEM_CLASS}
                            >
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Visual Customization */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                      Color
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        value={field.value ?? null}
                        suggestedColor={inferredVisual.color}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                      Icon
                    </FormLabel>
                    <FormControl>
                      <IconPicker
                        value={field.value ?? null}
                        type={selectedType}
                        categoryName={categoryName}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Live Preview - Compact */}
            <div className="flex items-center gap-3 border border-black bg-black/5 p-3">
              <span
                className="flex h-9 w-9 items-center justify-center shadow-sm"
                style={{ backgroundColor: previewColor }}
              >
                <selectedIconOption.Icon 
                  size={18} 
                  strokeWidth={2}
                  className={iconContrast === 'white' ? 'text-white' : 'text-black'} 
                />
              </span>
              <div>
                <p className="text-sm font-medium text-black">
                  {categoryName || 'Category Name'}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-black/40">
                  {selectedType === 'EXPENSE' ? 'Expense' : 'Income'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions - Compact */}
          <footer className="flex items-center justify-between border-t-2 border-black bg-white px-4 py-3">
            {onCancel ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={onCancel}
                className="h-9 rounded-none px-3 text-xs font-bold uppercase tracking-[0.15em] text-black/60 hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
            ) : (
              <div />
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 rounded-none border border-black bg-black px-6 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.3)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50"
            >
              {isSubmitting
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : submitLabel ??
                  (mode === 'create' ? 'Create' : 'Save')}
            </Button>
          </footer>
        </form>
      </Form>
    </article>
  )
}
