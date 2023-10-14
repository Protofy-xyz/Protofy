import React from "react";
import { ArrowUpDown } from '@tamagui/lucide-icons'
import dynamic from 'next/dynamic';

const DataTableComp = dynamic<any>(() =>
  import('react-data-table-component').then(module => module.default),
  { ssr: false }
);

const DataTableExtensions = dynamic<any>(() =>
  import('react-data-table-component-extensions').then(module => module.default),
  { ssr: false }
);

export const DataTable2 = {
  component: ({ rowsPerPage, columns, rows, onRowPress, handlePerRowsChange, handlePageChange, totalRows, currentPage, handleSort}) => {
    const tableData = {
      columns,
      data: rows
    };

    return <DataTableExtensions print={false} export={false} filter={false} {...tableData}>
      <DataTableComp

        responsive
        striped
        pointerOnHover
        columns={columns}
        data={rows}
        defaultSortField="created"
        defaultSortAsc={false}
        onRowClicked={onRowPress}
      // sortIcon={<ArrowUpDown />}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationTotalRows={totalRows}
        paginationDefaultPage={currentPage}
        pagination
        paginationServer
        sortServer
        // selectableRows
        paginationPerPage={rowsPerPage}
        onSort={handleSort}
        paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 500, 1000]}
      />
    </DataTableExtensions>
  },

  column: (name, selector?, sortable?, cell?, shrink?, minWidth='') => {
    return { name, selector, sortable, cell, grow: shrink, minWidth }
  },

  columns: (...args) => {
    return args
  }
}