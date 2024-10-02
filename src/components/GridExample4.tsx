import {
  ColumnDirective,
  ColumnsDirective,
  TreeGridComponent,
} from "@syncfusion/ej2-react-treegrid";
import data from "../data/Sectorisation.json";
import { Children, Children2, Children3, Root, Root2 } from "../types/types";
import { useState } from "react";
import { PermissionState } from "../types/permission";
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons";

type NodeType = Root2 | Children | Children2 | Children3;

const GridExample4 = () => {
  const sectorData: Root = data;

  const [selectedNodes, setSelectedNodes] = useState<PermissionState>({
    read: new Set(),
    write: new Set(),
  });

  const getAllChildrenIds = (node: NodeType) => {
    const ids = new Set<string>();
    const addChildrenRecursively = (n: NodeType) => {
      ids.add(n.id);
      if (n.children) {
        n.children.forEach((child: NodeType) => addChildrenRecursively(child));
      }
    };
    addChildrenRecursively(node);
    return ids;
  };

  const onCheckboxChange = (
    id: string,
    permission: "read" | "write",
    checked: boolean
  ) => {
    setSelectedNodes((prev) => {
      const updated: PermissionState = { ...prev };
      if (checked) {
        updated[permission].add(id);
        propagateToChildren(id, permission, true);
        propagateToParent(id, permission); // This ensures parents are selected if all children are selected
      } else {
        updated[permission].delete(id);
        propagateToChildren(id, permission, false);
        propagateToParent(id, permission); // This ensures parents are deselected if any child is deselected
      }
      return updated;
    });
  };

  const findNodeById = (nodes: NodeType[], nodeId: string): NodeType | null => {
    for (let node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = findNodeById(node.children as NodeType[], nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  const propagateToChildren = (
    id: string,
    permission: "read" | "write",
    checked: boolean
  ) => {
    const targetNode = findNodeById(sectorData.data.roots as NodeType[], id);
    if (!targetNode) return;

    const childIds = getAllChildrenIds(targetNode);
    setSelectedNodes((prev) => {
      const updated: PermissionState = { ...prev };
      if (checked) {
        childIds.forEach((childId) => updated[permission].add(childId));
      } else {
        childIds.forEach((childId) => updated[permission].delete(childId));
      }
      return updated;
    });
  };

  const propagateToParent = (id: string, permission: "read" | "write") => {
    // Helper to find parent recursively
    const findParent = (node: NodeType, nodeId: string): NodeType | null => {
      if (
        node.children &&
        node.children.some((child: NodeType) => child.id === nodeId)
      ) {
        return node;
      }
      if (node.children) {
        for (let child of node.children) {
          const found = findParent(child as NodeType, nodeId);
          if (found) return found;
        }
      }
      return null;
    };

    // Loop through root nodes to find the parent of the current node
    let parent: NodeType | null = null;
    for (const root of sectorData.data.roots as NodeType[]) {
      parent = findParent(root, id);
      if (parent) break; // Stop if we found the parent
    }

    if (!parent) return;

    const allSiblingsSelected = parent.children!.every((child: NodeType) =>
      selectedNodes[permission].has(child.id)
    );

    if (allSiblingsSelected) {
      // If all children are selected, select the parent
      setSelectedNodes((prev) => {
        const updated: PermissionState = { ...prev };
        updated[permission].add(parent!.id);
        propagateToParent(parent!.id, permission); // Recursively check parent's parent
        return updated;
      });
    } else {
      // If any child is deselected, deselect the parent
      setSelectedNodes((prev) => {
        const updated: PermissionState = { ...prev };
        updated[permission].delete(parent!.id);
        propagateToParent(parent!.id, permission); // Recursively check parent's parent
        return updated;
      });
    }
  };

  const checkboxTemplate = (field: "read" | "write", id: string) => (
    <CheckBoxComponent
      checked={selectedNodes[field].has(id)}
      change={(e) => onCheckboxChange(id, field, e.checked)}
    />
  );

  const renderSelectedLeafNodes = (permission: "read" | "write") => {
    return Array.from(selectedNodes[permission]).map((id) => (
      <div key={id}>{id}</div>
    ));
  };

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
          <ColumnDirective
            headerText="Read"
            width="100"
            template={(rowData: Root2) => checkboxTemplate("read", rowData.id)}
          />
          <ColumnDirective
            headerText="Write"
            width="100"
            template={(rowData: Root2) => checkboxTemplate("write", rowData.id)}
          />
        </ColumnsDirective>
      </TreeGridComponent>

      <div>
        <h3>Selected Read Nodes</h3>
        {renderSelectedLeafNodes("read")}
      </div>

      <div>
        <h3>Selected Write Nodes</h3>
        {renderSelectedLeafNodes("write")}
      </div>
    </div>
  );
};

export default GridExample4;
