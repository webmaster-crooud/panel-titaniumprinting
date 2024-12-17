// components/Pagination.tsx
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastData = currentPage * itemsPerPage;
    const indexOfFirstData = indexOfLastData - itemsPerPage;

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-600">
                Showing {indexOfFirstData + 1} to {Math.min(indexOfLastData, totalItems)} of {totalItems} entries
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-1 py-1 rounded bg-slate-50 disabled:opacity-50"
                >
                    <IconChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-slate-600 text-white' : 'bg-slate-50 text-slate-600'}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-1 py-1 rounded bg-slate-50 disabled:opacity-50"
                >
                    <IconChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
