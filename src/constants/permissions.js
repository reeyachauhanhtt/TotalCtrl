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
