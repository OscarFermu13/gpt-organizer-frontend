export function buildFolderTree(folders) {
  const folderMap = new Map();
  const roots = [];

  folders.forEach(folder => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  folders.forEach(folder => {
    if (folder.parentId && folderMap.has(folder.parentId)) {
      folderMap.get(folder.parentId).children.push(folderMap.get(folder.id));
    } else {
      roots.push(folderMap.get(folder.id));
    }
  });

  return roots;
}
