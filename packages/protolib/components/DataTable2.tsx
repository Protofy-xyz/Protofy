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
  component: ({ columns, rows, onRowPress, handlePerRowsChange, handlePageChange, totalRows, currentPage}) => {
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
      />
    </DataTableExtensions>
  },

  column: (name, selector?, sortable?, cell?) => {
    return { name, selector, sortable, cell }
  },

  columns: (...args) => {
    return args
  }
}