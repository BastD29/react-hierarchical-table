import { TreeGridComponent } from "@syncfusion/ej2-react-treegrid";
import { sortData } from "../data/sortData";

const GridExample3 = () => {
  return (
    <div>
      <TreeGridComponent
        dataSource={sortData}
        treeColumnIndex={1}
        childMapping="subtasks"
      />
    </div>
  );
};

export default GridExample3;
