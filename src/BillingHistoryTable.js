import React from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  return (
    <span>
      Search: {' '}
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        style={{ fontSize: '1.1rem', margin: '10px' }}
      />
    </span>
  );
};

const BillingHistoryTable = ({ billingData, searchFilter }) => {
  const columns = React.useMemo(
    () => [
      { Header: 'Name', accessor: d => `${d.firstName} ${d.lastName}` },
      { Header: 'Claim Start Date', accessor: 'claimStartDate' },
      { Header: 'Claim End Date', accessor: 'claimEndDate' },
      { Header: 'Claim Submission Status', accessor: 'submissionStatus' }, // New column for submission status
      // ... other columns
    ],
    []
  );

  const data = React.useMemo(() => {
    const rows = [];
    billingData.forEach((user) => {
      user.dateRanges.forEach((dateRange) => {
        rows.push({
          firstName: user.firstName,
          lastName: user.lastName,
          claimStartDate: dateRange.startDate,
          claimEndDate: dateRange.endDate,
          submissionStatus: dateRange.submissionStatus, // Include submission status in row data
        });
      });
    });
    return rows;
  }, [billingData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    // Add the following properties for pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        globalFilter: searchFilter, // Initialize global filter with searchFilter prop
        pageSize: 10, // Set your desired page size
      },
    },
    useGlobalFilter, // Use global filter hook
    useSortBy,
    usePagination // Add pagination hook
  );

  return (
    <div>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {state.pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={state.pageIndex + 1}
            onChange={(e) => {
              const pageIndex = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageIndex);
            }}
          />
        </span>
        <select
          value={state.pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BillingHistoryTable;
