import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface PendingDeleteAccount {
  id: string
  name: string
}

interface DeleteAccountDialogProps {
  pendingAccount: PendingDeleteAccount | null
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteAccountDialog({
  pendingAccount,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) {
  return (
    <Dialog
      open={Boolean(pendingAccount)}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent
        showCloseButton={!isDeleting}
        className="gap-0 rounded-none border-2 border-black bg-[#f6f6f6] p-0 shadow-[8px_8px_0_0_#000] sm:max-w-[34rem]"
      >
        <DialogHeader className="border-b-2 border-black px-5 py-4 text-left sm:px-6 sm:py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/35">
            Delete Account
          </p>
          <DialogTitle className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-black sm:text-3xl">
            Remove {pendingAccount?.name ?? 'this account'}?
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-black/60">
            This account will be hidden from the list. You can continue
            managing other accounts after deletion.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t-2 border-black px-5 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-none border-black bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-none hover:bg-black hover:text-white"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-none hover:bg-black/85 hover:text-white"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
