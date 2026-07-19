/**
 * Pagination component.
 */
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading = false }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const btnBase =
    'min-w-[36px] h-9 px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150';

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`${btnBase} text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Previous page"
      >
        ←
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={`${btnBase} hover:bg-neutral-100 text-neutral-700`}>1</button>
          {startPage > 2 && <span className="text-neutral-400 px-1">…</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
          className={`${btnBase} ${
            page === currentPage
              ? 'gradient-primary text-white shadow-md'
              : 'hover:bg-neutral-100 text-neutral-700'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-neutral-400 px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className={`${btnBase} hover:bg-neutral-100 text-neutral-700`}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`${btnBase} text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
};

export default Pagination;
