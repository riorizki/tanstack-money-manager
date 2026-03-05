import { Button } from '@/components/ui/button'

interface AccountsPaginationProps {
  currentPage: number
  totalPages: number
  firstRecord: number
  lastRecord: number
  totalRecords: number
  onPrevious: () => void
  onNext: () => void
}

export function AccountsPagination({
  currentPage,
  totalPages,
  firstRecord,
  lastRecord,
  totalRecords,
  onPrevious,
  onNext,
}: AccountsPaginationProps) {
  return (
    <footer className="mt-4 flex flex-col gap-3 border border-black/35 bg-[#f2f2f2] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
        Account Registry{' '}
        <span className="text-black/65">
          {String(firstRecord).padStart(2, '0')} —{' '}
          {String(lastRecord).padStart(2, '0')} /{' '}
          {String(totalRecords).padStart(2, '0')}
        </span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-none border-black bg-white px-3 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
          onClick={onPrevious}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <span className="min-w-[72px] text-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-black/55">
          {String(currentPage).padStart(2, '0')} /{' '}
          {String(totalPages).padStart(2, '0')}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-none border-black bg-white px-3 text-[10px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
          onClick={onNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </footer>
  )
}
