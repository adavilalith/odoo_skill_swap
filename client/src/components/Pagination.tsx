interface PaginationProps {
  total: number;
  page: number;
  usersPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ total, page, usersPerPage, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / usersPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`px-3 py-1 border rounded ${
            page === n ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
