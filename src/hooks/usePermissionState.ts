import { useState, useCallback } from "react";
import { PermissionState } from "../types/permission";
import { Root, NodeType } from "../types/types";

/**
 * Custom hook to manage permission states (read/write) for a tree structure.
 *
 * @param {Root} sectorData - The hierarchical sector data containing nodes and their relationships.
 * @returns {object} - An object containing the selectedNodes state and the onCheckboxChange function.
 */
export const usePermissionState = (sectorData: Root) => {
  // State to track selected nodes for 'read' and 'write' permissions
  const [selectedNodes, setSelectedNodes] = useState<PermissionState>({
    read: new Set(),
    write: new Set(),
  });

  /**
   * Recursively searches for a node by its ID within the tree structure.
   *
   * @param {NodeType[]} nodes - List of nodes to search within.
   * @param {string} nodeId - The ID of the node to find.
   * @returns {NodeType | null} - The found node or null if not found.
   */
  const findNodeById = useCallback(
    (nodes: NodeType[], nodeId: string): NodeType | null => {
      for (let node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children) {
          const found = findNodeById(node.children as NodeType[], nodeId);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  /**
   * Recursively retrieves all children IDs of a given node.
   *
   * @param {NodeType} node - The node whose children's IDs are to be retrieved.
   * @returns {Set<string>} - A set of all child node IDs.
   */
  const getAllChildrenIds = useCallback((node: NodeType) => {
    const ids = new Set<string>();
    const addChildrenRecursively = (n: NodeType) => {
      ids.add(n.id);
      if (n.children) {
        n.children.forEach((child: NodeType) => addChildrenRecursively(child));
      }
    };
    addChildrenRecursively(node);
    return ids;
  }, []);

  /**
   * Propagates a permission change (read/write) to all child nodes of a given node.
   *
   * @param {string} id - The ID of the node to propagate the change to.
   * @param {"read" | "write"} permission - The type of permission ('read' or 'write').
   * @param {boolean} checked - Whether the permission is being granted (true) or revoked (false).
   */
  const propagateToChildren = useCallback(
    (id: string, permission: "read" | "write", checked: boolean) => {
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
    },
    [findNodeById, getAllChildrenIds, sectorData]
  );

  /**
   * Propagates a permission change (read/write) to the parent node of a given node,
   * checking the state of sibling nodes to determine if the parent's permission should be updated.
   *
   * @param {string} id - The ID of the node whose parent's permission needs to be updated.
   * @param {"read" | "write"} permission - The type of permission ('read' or 'write').
   */
  const propagateToParent = useCallback(
    (id: string, permission: "read" | "write") => {
      /**
       * Helper function to recursively find the parent node of a given child node.
       *
       * @param {NodeType} node - The current node to check.
       * @param {string} nodeId - The ID of the child node whose parent we want to find.
       * @returns {NodeType | null} - The parent node or null if not found.
       */
      const findParent = (node: NodeType, nodeId: string): NodeType | null => {
        if (
          node.children &&
          node.children.some((child: NodeType) => child.id === nodeId)
        ) {
          return node;
        }
        if (node.children) {
          for (let child of node.children) {
            const foundParent = findParent(child as NodeType, nodeId);
            if (foundParent) return foundParent;
          }
        }
        return null;
      };

      // Loop through root nodes to find the parent of the current node
      let parent: NodeType | null = null;
      for (const root of sectorData.data.roots as NodeType[]) {
        parent = findParent(root, id);
        if (parent) break;
      }

      if (!parent) return;

      // Check if all siblings (children of the same parent) have the selected permission
      const allSiblingsSelected = parent.children!.every((child: NodeType) =>
        selectedNodes[permission].has(child.id)
      );

      if (allSiblingsSelected) {
        // If all siblings have the permission, apply it to the parent
        setSelectedNodes((prev) => {
          const updated: PermissionState = { ...prev };
          updated[permission].add(parent!.id);
          propagateToParent(parent!.id, permission);
          return updated;
        });
      } else {
        // If not all siblings have the permission, remove it from the parent
        setSelectedNodes((prev) => {
          const updated: PermissionState = { ...prev };
          updated[permission].delete(parent!.id);
          propagateToParent(parent!.id, permission);
          return updated;
        });
      }
    },
    [selectedNodes, sectorData]
  );

  /**
   * Handles checkbox changes for a given node, updating the permission state and
   * propagating the changes to child and parent nodes as necessary.
   *
   * @param {string} id - The ID of the node whose permission is being updated.
   * @param {"read" | "write"} permission - The type of permission ('read' or 'write').
   * @param {boolean} checked - Whether the permission is being granted (true) or revoked (false).
   */
  const onCheckboxChange = useCallback(
    (id: string, permission: "read" | "write", checked: boolean) => {
      setSelectedNodes((prev) => {
        const updated: PermissionState = { ...prev };
        if (checked) {
          updated[permission].add(id);
          propagateToChildren(id, permission, true);
          propagateToParent(id, permission);
        } else {
          updated[permission].delete(id);
          propagateToChildren(id, permission, false);
          propagateToParent(id, permission);
        }
        return updated;
      });
    },
    [propagateToChildren, propagateToParent]
  );

  return {
    selectedNodes,
    onCheckboxChange,
  };
};
