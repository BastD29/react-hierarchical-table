import { useCallback, useMemo, useState } from "react";
import { FileType } from "../types/file";
import { getData } from "../data/files";
// import { ColDef, ModuleRegistry } from "ag-grid-community";
// import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

const GridExample2 = () => {
  const [rowData, setRowData] = useState<FileType[]>(getData());

  const columns: ColDef[] = [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;
        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
    // { field: "size" },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "File Explorer",
      minWidth: 280,
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, []);

  const getDataPath = useCallback((data: FileType) => data.path, []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(columns);

  // const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  // const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  return (
    <div className="w-full h-full" /* style={containerStyle} */>
      <div
        className="ag-theme-quartz-dark w-full h-full" /* style={gridStyle} */
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          treeData={true}
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
        />
      </div>
    </div>
  );
};

export default GridExample2;
