import {
  ColumnDirective,
  ColumnsDirective,
  TreeGridComponent,
} from "@syncfusion/ej2-react-treegrid";
import data from "../data/Sectorisation.json";
import { useMemo, useCallback } from "react";
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import { usePermissionState } from "../hooks/usePermissionState";
import { NodeType } from "../types/types";

/**
 * Component for rendering a tree grid with checkbox columns for 'read' and 'write' permissions.
 * It uses Syncfusion's TreeGrid component to display hierarchical data and allows users to select
 * permissions for each node.
 */
const GridExample5 = () => {
  // Memoized sector data to avoid unnecessary re-renders
  const sectorData = useMemo(() => data, []);

  // Hook to manage the permission state (read/write) of nodes
  const { selectedNodes, onCheckboxChange } = usePermissionState(sectorData);

  /**
   * Generates a checkbox component for the given permission field and node ID.
   * The checkbox reflects the current permission state (checked or not) and triggers
   * the permission change when the user interacts with it.
   *
   * @param {"read" | "write"} field - The permission type ('read' or 'write').
   * @param {string} id - The ID of the node this checkbox is associated with.
   * @returns {JSX.Element} - The rendered CheckBoxComponent.
   */
  const checkboxTemplate = useCallback(
    (field: "read" | "write", id: string) => (
      <CheckBoxComponent
        checked={selectedNodes[field].has(id)}
        change={(e) => onCheckboxChange(id, field, e.checked)}
      />
    ),
    [selectedNodes, onCheckboxChange]
  );

  /**
   * Groups the nodes by their level in the tree structure. Each level corresponds to
   * the depth of the node in the tree (e.g., root nodes are level 0, their children are level 1).
   *
   * @param {NodeType[]} nodes - List of nodes to group by level.
   * @param {number} [level=0] - The starting level (defaults to 0 for root nodes).
   * @returns {Record<number, string[]>} - An object where keys are levels and values are arrays of node IDs at that level.
   */
  const groupByLevel = (
    nodes: NodeType[],
    level: number = 0
  ): Record<number, string[]> => {
    const levelMap: Record<number, string[]> = {};
    const addNodesByLevel = (node: NodeType, currentLevel: number) => {
      if (!levelMap[currentLevel]) levelMap[currentLevel] = [];
      levelMap[currentLevel].push(node.id);
      if (node.children) {
        node.children.forEach((child) =>
          addNodesByLevel(child as NodeType, currentLevel + 1)
        );
      }
    };
    nodes.forEach((node) => addNodesByLevel(node, level));
    return levelMap;
  };

  /**
   * Renders a summary of the nodes that have 'read' or 'write' permissions granted,
   * grouped by their level in the tree.
   *
   * @returns {JSX.Element} - A series of div elements displaying the authorized nodes for each permission at each level.
   */
  const renderAuthorizationColumns = useMemo(() => {
    // Get the node levels grouped by their depth in the tree structure
    const nodeLevels = groupByLevel(sectorData.data.roots);

    return (
      <div>
        {Object.keys(nodeLevels).map((levelStr) => {
          const level = Number(levelStr);
          return (
            <div key={level} style={{ marginBottom: "10px" }}>
              <h4>Level {level}:</h4>
              <div>
                <strong>Read Authorized:</strong>{" "}
                {nodeLevels[level]
                  .filter((id: string) => selectedNodes.read.has(id))
                  .join(", ") || "None"}
              </div>
              <div>
                <strong>Write Authorized:</strong>{" "}
                {nodeLevels[level]
                  .filter((id: string) => selectedNodes.write.has(id))
                  .join(", ") || "None"}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [selectedNodes, sectorData]);

  return (
    <div>
      {/* TreeGridComponent to render the hierarchical data with permission checkboxes */}
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
          <ColumnDirective
            headerText="Read"
            width="100"
            template={(rowData: NodeType) =>
              checkboxTemplate("read", rowData.id)
            }
          />
          <ColumnDirective
            headerText="Write"
            width="100"
            template={(rowData: NodeType) =>
              checkboxTemplate("write", rowData.id)
            }
          />
        </ColumnsDirective>
      </TreeGridComponent>

      {/* Render a summary of the nodes authorized for 'read' and 'write' permissions */}
      {renderAuthorizationColumns}
    </div>
  );
};

export default GridExample5;
