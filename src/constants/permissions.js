export const PERMISSIONS = {
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
  NO_ACCESS: 'No Access',
};

export function canEdit(permission) {
  return permission === PERMISSIONS.EDITOR;
}

export function isViewer(permission) {
  return permission === PERMISSIONS.VIEWER;
}

export function hasNoAccess(permission) {
  return permission === PERMISSIONS.NO_ACCESS;
}

export function hasAnyAccess(permission) {
  return permission === PERMISSIONS.EDITOR || permission === PERMISSIONS.VIEWER;
}

export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.EDITOR]:
    'Can do all that the viewer can do, plus check items in and out of the inventory, add new products, adjust product quantity',
  [PERMISSIONS.VIEWER]: 'Can view the inventory and inventory analytics',
  [PERMISSIONS.NO_ACCESS]: "Doesn't have access to this inventory",
};
