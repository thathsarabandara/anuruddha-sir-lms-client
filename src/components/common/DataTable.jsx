import React, { useState, useMemo } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaTimes } from 'react-icons/fa';

/**
 * DataTable Component - Fully customizable, reusable data table
 * 
 * Features:
 * - Search functionality across multiple columns
 * - Dropdown filters for specific columns
 * - Status filter dropdown (integrated from parent)
 * - Pagination with customizable items per page resets on filter changes
 * - Responsive design (horizontal scroll on mobile, stack on very small screens)
 * - Customizable column renderers
 * 
 * @param {Array} data - Array of data objects to display
 * @param {Array} columns - Column configuration array
 * @param {Object} config - Configuration object
 *   - itemsPerPage: Number of items per page (default: 10)
 *   - searchPlaceholder: Search input placeholder (default: 'Search...')
 *   - hideSearch: Hide search input (default: false)
 *   - emptyMessage: Message when no data (default: 'No data available')
 *   - statusFilterLabel: Label for status filter dropdown (default: 'Filter by Status')
 *   - statusFilterOptions: Array of filter options [{label, value}]
 *   - statusFilterValue: Current status filter value
 *   - onStatusFilterChange: Callback when status filter changes
 * @param {boolean} loading - Show loading skeleton
 * 
 * @example
 * <DataTable 
 *   data={teachers}
 *   columns={[...]}
 *   config={{
 *     itemsPerPage: 10,
 *     searchPlaceholder: 'Search teachers...',
 *     statusFilterLabel: 'Filter by Status',
 *     statusFilterOptions: [
 *       { label: 'All Statuses', value: 'all' },
 *       { label: 'Active', value: 'active' },
 *       { label: 'Pending', value: 'pending' },
 *     ],
 *     statusFilterValue: filterStatus,
 *     onStatusFilterChange: (value) => setFilterStatus(value),
 *   }}
 * />
 */
const DataTable = ({
  data = [],
  columns = [],
  config = {},
  loading = false,
}) => {
  const {
    itemsPerPage = 10,
    searchPlaceholder = 'Search...',
    hideSearch = false,
    emptyMessage = 'No data available',
    statusFilterOptions = [],
    statusFilterValue = null,
    onStatusFilterChange = null,
    searchValue = '',
    onSearchChange = null,
  } = config;

  // State
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);

  // Filter searchable columns
  const searchableColumns = columns.filter(col => col.searchable !== false);

  // For local search, only search if onSearchChange is NOT provided
  // If onSearchChange is provided, parent handles the search via API
  const filteredBySearch = useMemo(() => {
    if (onSearchChange || !searchValue) return data;

    return data.filter(row =>
      searchableColumns.some(col =>
        String(row[col.key])
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    );
  }, [data, searchValue, searchableColumns, onSearchChange]);

  // Apply column filters
  const filteredData = useMemo(() => {
    return filteredBySearch.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]).toLowerCase() === String(value).toLowerCase();
      });
    });
  }, [filteredBySearch, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filtered
  const handleSearch = (value) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
    setCurrentPage(1);
  };

  const handleFilter = (columnKey, value) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    if (onSearchChange) {
      onSearchChange('');
    }
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchValue;

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="h-16 bg-gray-200 rounded-lg animate-pulse w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      {!hideSearch && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter Dropdown */}
          {statusFilterOptions.length > 0 && onStatusFilterChange && (
            <select 
              value={statusFilterValue || 'all'} 
              onChange={(e) => onStatusFilterChange(e.target.value)} 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-gray-700"
            >
              {statusFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition whitespace-nowrap"
            >
              <FaTimes size={14} />
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Column Filters */}
      {columns.some(col => col.filterable) && (
        <div className="flex gap-2 flex-wrap">
          {columns.map(
            col =>
              col.filterable && (
                <div key={col.key} className="relative">
                  <button
                    onClick={() =>
                      setActiveFilterColumn(
                        activeFilterColumn === col.key ? null : col.key
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
                      filters[col.key]
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <FaFilter size={12} />
                    {col.label}
                    {filters[col.key] && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-blue-200 rounded-full">
                        {filters[col.key]}
                      </span>
                    )}
                  </button>

                  {/* Filter Dropdown */}
                  {activeFilterColumn === col.key && col.filterOptions && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48">
                      {col.filterOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleFilter(col.key, option.value);
                            setActiveFilterColumn(null);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition ${
                            filters[col.key] === option.value
                              ? 'bg-blue-100 text-blue-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          handleFilter(col.key, '');
                          setActiveFilterColumn(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 border-t border-gray-200"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      )}

      {/* Table - Desktop View */}
      {paginatedData.length > 0 ? (
        <>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-gray-50">
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className={`text-left py-3 px-4 text-sm font-semibold text-slate-700 ${
                        col.width || 'flex-1'
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    {columns.map(col => (
                      <td
                        key={`${idx}-${col.key}`}
                        className={`py-4 px-4 text-sm text-gray-900 ${
                          col.width || 'flex-1'
                        }`}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Card Layout */}
          <div className="sm:hidden space-y-4">
            {paginatedData.map((row, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 hover:shadow-md transition"
              >
                {columns.map(col => (
                  <div
                    key={`${idx}-${col.key}`}
                    className="flex justify-between items-start gap-4"
                  >
                    <span className="text-sm font-semibold text-gray-600 min-w-max">
                      {col.label}
                    </span>
                    <span className="text-sm text-right text-gray-900 font-medium">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(endIndex, filteredData.length)}</span>{' '}
                of <span className="font-semibold">{filteredData.length}</span> results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft size={14} />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
