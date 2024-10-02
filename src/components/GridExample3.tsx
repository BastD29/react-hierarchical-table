import {
  ColumnDirective,
  ColumnsDirective,
  TreeGridComponent,
} from "@syncfusion/ej2-react-treegrid";
import { sortData } from "../data/sortData";

const GridExample3 = () => {
  return (
    <div>
      <TreeGridComponent
        dataSource={sortData}
        treeColumnIndex={1}
        childMapping="subtasks"
      />

      {/* <TreeGridComponent
        dataSource={sortData}
        treeColumnIndex={1}
        childMapping="subtasks"
      >
        <ColumnsDirective>
          <ColumnDirective field="Category" headerText="Category" width="150" />
          <ColumnDirective
            field="orderName"
            headerText="Order Name"
            width="170"
          />
          <ColumnDirective
            field="orderDate"
            headerText="Order Date"
            width="130"
            format="yMd"
            textAlign="Right"
            type="date"
          />
          <ColumnDirective
            field="price"
            headerText="Price"
            width="100"
            textAlign="Right"
            type="number"
            format="C0"
          />
        </ColumnsDirective>
      </TreeGridComponent> */}
    </div>
  );
};

export default GridExample3;
