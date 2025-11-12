export default function Pagination({ page, total, pageSize, onPage }) {
  const pages = Math.max(Math.ceil((total || 0) / (pageSize || 1)), 1);
  return (
    <div className="flex gap-2 items-center mt-4">
      <button className="px-3 py-1 border rounded" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</button>
      <span>Page {page} of {pages}</span>
      <button className="px-3 py-1 border rounded" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}


