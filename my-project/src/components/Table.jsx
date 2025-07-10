// components/ui/Table.jsx
import React from 'react';

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  rowClassName = '',
  headerClassName = '',
  cellClassName = '',
  onRowClick,
}) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || column.accessor || index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider ${headerClassName}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`${rowClassName} ${onRowClick ? 'hover:bg-primary-50 cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${cellClassName}`}
                  >
                    {column.cell 
                      ? column.cell(row[column.accessor], row) 
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Table component variants
const TableVariants = {
  default: '',
  striped: 'odd:bg-gray-50 even:bg-white',
  bordered: 'border border-gray-200',
  hover: 'hover:bg-gray-50',
};

// Table component sizes
const TableSizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
};

Table.Variants = TableVariants;
Table.Sizes = TableSizes;

export default Table;