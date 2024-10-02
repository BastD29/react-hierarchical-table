import { TreeGridComponent } from "@syncfusion/ej2-react-treegrid";
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
    </div>
  );
};

export default GridExample4;
