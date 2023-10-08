import React from "react";
import {ArrowUpDown} from '@tamagui/lucide-icons'
import dynamic from 'next/dynamic';

const DataTableComp = dynamic<any>(() =>
    import('react-data-table-component').then(module => module.default),
    { ssr: false }
);

const DataTableExtensions = dynamic<any>(() =>
    import('react-data-table-component-extensions').then(module => module.default),
    { ssr: false }
);

export function DataTable2({ columns, rows}) {
  const tableData = {
    columns,
    data: rows
  };

  return <DataTableExtensions filter={false} {...tableData}>
  <DataTableComp
    responsive
    striped
    pointerOnHover	
    columns={columns}
    data={rows}
    // defaultSortField="id"
    sortIcon={<ArrowUpDown />}
    // pagination
    highlightOnHover
  />
</DataTableExtensions>
}