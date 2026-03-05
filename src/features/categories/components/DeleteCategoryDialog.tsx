import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteCategoryDialogProps {
  isOpen: boolean
  categoryName: string
  childCount: number
  deleteChildren: boolean
  isDeleting?: boolean
  onDeleteChildrenChange: (value: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteCategoryDialog({
  isOpen,
  categoryName,
  childCount,
  deleteChildren,
  isDeleting = false,
  onDeleteChildrenChange,
  onConfirm,
  onCancel,
}: DeleteCategoryDialogProps) {
  const hasChildren = childCount > 0
  const isDeleteDisabled = isDeleting || (hasChildren && !deleteChildren)
  const hasChildrenText =
    childCount === 1 ? '1 sub-category' : `${childCount} sub-categories`

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onCancel()
        }
      }}
    >
      <DialogContent
        showCloseButton={!isDeleting}
        className="gap-0 rounded-none border-2 border-black bg-[#f6f6f6] p-0 shadow-[8px_8px_0_0_#000] sm:max-w-[34rem]"
      >
        <DialogHeader className="border-b-2 border-black px-5 py-4 text-left sm:px-6 sm:py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/35">
            Delete Category
          </p>
          <DialogTitle className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-black sm:text-3xl">
            Remove {categoryName || 'this category'}?
          </DialogTitle>
          {hasChildren ? (
            <DialogDescription className="mt-2 text-sm leading-relaxed text-black/60">
              This category contains {hasChildrenText}. Choose whether you want
              to remove only the parent (blocked) or remove the entire branch.
            </DialogDescription>
          ) : (
            <DialogDescription className="mt-2 text-sm leading-relaxed text-black/60">
              This category will be removed from your taxonomy. Deletion will
              be blocked if linked transactions still exist.
            </DialogDescription>
          )}
        </DialogHeader>

        {hasChildren && (
          <div className="border-b border-black/15 px-5 py-4 sm:px-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={deleteChildren}
                onChange={(event) =>
                  onDeleteChildrenChange(event.currentTarget.checked)
                }
                disabled={isDeleting}
                className="mt-[2px] h-4 w-4 rounded-none border border-black accent-black"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/75">
                  Delete Parent + Children
                </p>
                <p className="mt-1 text-xs leading-relaxed text-black/55">
                  Enable this to delete the parent category and all nested
                  sub-categories in one action.
                </p>
              </div>
            </label>
            {!deleteChildren && (
              <p className="mt-3 text-[11px] font-medium text-black/55">
                Delete button is disabled until this option is enabled.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="border-t-2 border-black px-5 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-none border-black bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-none hover:bg-black hover:text-white"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-none hover:bg-black/85 hover:text-white"
            disabled={isDeleteDisabled}
            onClick={onConfirm}
          >
            {isDeleting
              ? 'Deleting...'
              : hasChildren && deleteChildren
                ? 'Delete Branch'
                : 'Delete Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
