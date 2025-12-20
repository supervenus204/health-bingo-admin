import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface SortableTableProps<T> {
  data: T[] | undefined | null;
  columns: SortableColumn<T>[];
  keyExtractor: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T) => string);
  sortColumn?: keyof T | string | null;
  sortDirection?: SortDirection;
  onSort?: (columnKey: keyof T | string, direction: SortDirection) => void;
}

function SortableTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  className = '',
  headerClassName = '',
  rowClassName = '',
  sortColumn: externalSortColumn,
  sortDirection: externalSortDirection,
  onSort,
}: SortableTableProps<T>) {
  const [internalSortColumn, setInternalSortColumn] = useState<keyof T | string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>(null);

  const isControlled = externalSortColumn !== undefined && onSort !== undefined;
  const sortColumn = isControlled ? externalSortColumn : internalSortColumn;
  const sortDirection = isControlled ? externalSortDirection : internalSortDirection;

  const handleSort = (columnKey: keyof T | string) => {
    if (isControlled) {
      if (sortColumn === columnKey) {
        if (sortDirection === 'asc') {
          onSort(columnKey, 'desc');
        } else if (sortDirection === 'desc') {
          onSort(columnKey, null);
        } else {
          onSort(columnKey, 'asc');
        }
      } else {
        onSort(columnKey, 'asc');
      }
    } else {
      if (internalSortColumn === columnKey) {
        if (internalSortDirection === 'asc') {
          setInternalSortDirection('desc');
        } else if (internalSortDirection === 'desc') {
          setInternalSortColumn(null);
          setInternalSortDirection(null);
        } else {
          setInternalSortDirection('asc');
        }
      } else {
        setInternalSortColumn(columnKey);
        setInternalSortDirection('asc');
      }
    }
  };

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    if (isControlled || !sortColumn || !sortDirection) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue);
      const bStr = String(bValue);
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, isControlled]);

  const getSortIcon = (columnKey: keyof T | string) => {
    if (sortColumn !== columnKey) {
      return (
        <span className="ml-2 text-gray-400">
          <svg
            className="w-4 h-4 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0-12l4 4m-4-4l-4 4"
            />
          </svg>
        </span>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <span className="ml-2 text-primary-green">
          <svg
            className="w-4 h-4 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </span>
      );
    }

    return (
      <span className="ml-2 text-primary-green">
        <svg
          className="w-4 h-4 inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    );
  };

  const getRowClassName = (row: T): string => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row);
    }
    return rowClassName || '';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-light-medium ${className}`}>
      <Table>
        <TableHeader className={headerClassName}>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={`px-6 py-4 text-left text-xs font-semibold text-gray-very-dark uppercase tracking-wider ${
                  column.sortable !== false
                    ? 'cursor-pointer select-none hover:bg-gray-light transition-colors'
                    : ''
                }`}
                onClick={() =>
                  column.sortable !== false && handleSort(column.key)
                }
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable !== false && getSortIcon(column.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-6 py-8 text-center text-sm text-text-secondary"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            <>
              {sortedData.map((row) => (
                <TableRow
                  key={keyExtractor(row)}
                  className={`hover:bg-gray-very-light transition-colors ${getRowClassName(row)}`}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-text-primary"
                    >
                      {column.render
                        ? column.render(row[column.key as keyof T], row)
                        : row[column.key as keyof T] ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default SortableTable;

