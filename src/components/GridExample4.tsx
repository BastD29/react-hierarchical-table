import {
  ColumnDirective,
  ColumnsDirective,
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
        treeColumnIndex={0}
        childMapping="children"
      >
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="150"
            textAlign="Left"
          />
        </ColumnsDirective>
      </TreeGridComponent>
    </div>
  );
};

export default GridExample4;
