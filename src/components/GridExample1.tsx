import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { CarType } from "../types/car";

const GridExample1 = () => {
  const cars: CarType[] = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  const columns: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ];

  return (
    <div className="ag-theme-quartz h-[500px]">
      <AgGridReact rowData={cars} columnDefs={columns} />
    </div>
  );
};

export default GridExample1;
