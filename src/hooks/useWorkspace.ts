import { useState, useEffect } from 'react';
import { getWorkspace } from '../api/workspace';
import type { Workspace } from '../api/workspace';

export function useWorkspace(): Workspace | null {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    getWorkspace().then(setWorkspace);
  }, []);

  return workspace;
}
