import React from 'react';
import FolderItem from './folderItem';
import { buildFolderTree } from '../utils/buildFolderTree';

export default function FolderTree({ folders, expanded, toggleFolder, openContextMenu }) {
  const folderTree = buildFolderTree(folders);
  return (
    <ul className="space-y-2">
      {folderTree.map(folder => (
        <FolderItem
          key={folder.id}
          folder={folder}
          depth={0}
          expanded={expanded}
          toggleFolder={toggleFolder}
          openContextMenu={openContextMenu}
        />
      ))}
    </ul>
  );
}
