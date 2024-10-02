import {
  // ColumnDirective,
  // ColumnsDirective,
  TreeGridComponent,
} from "@syncfusion/ej2-react-treegrid";
import data from "../data/Sectorisation.json";
import { Root } from "../types/types";

const GridExample4 = () => {
  const sectorData: Root = data;

  return (
    <div>
      <TreeGridComponent
        dataSource={sectorData.data.roots}
        treeColumnIndex={1}
        childMapping="children"
      />

      {/* <TreeGridComponent
        dataSource={sectorData.data.roots}
        treeColumnIndex={1}
        childMapping="children"
      >
        <ColumnsDirective>
          <ColumnDirective
            field="id"
            headerText="ID"
            width="100"
            textAlign="Left"
          />
          <ColumnDirective
            field="name"
            headerText="Name"
            width="150"
            textAlign="Left"
          />
          <ColumnDirective
            field="type"
            headerText="Type"
            width="150"
            textAlign="Left"
          />
          <ColumnDirective
            field="external_reference"
            headerText="Reference"
            width="150"
            textAlign="Left"
          />
          <ColumnDirective
            field="model_code"
            headerText="Model Code"
            width="150"
            textAlign="Left"
          />
        </ColumnsDirective>
      </TreeGridComponent> */}
    </div>
  );
};

export default GridExample4;
