// src/renderer/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProjectWelcome } from './components/project/ProjectWelcome';
import { SettingsView } from './components/settings/SettingsView';
import { ToastProvider } from './components/common/Toast';
import { useProjectStore } from './stores/projectStore';
import './i18n';

export default function App() {
  const project = useProjectStore((s) => s.project);

  const handleNew = async () => {
    const dir = await window.stellarforge.project.pickDirectory();
    if (!dir) return;
    const result = await window.stellarforge.project.create(dir, {
      name: 'New Mod',
      author: '',
      stellarisVersion: '3.x',
      tags: [],
    });
    if (result) {
      useProjectStore.getState().setProject(result);
      useProjectStore.getState().setProjectPath(dir);
    }
  };

  const handleOpen = async () => {
    const path = await window.stellarforge.project.pickDirectory();
    if (!path) return;
    const result = await window.stellarforge.project.load(path);
    if (result) {
      useProjectStore.getState().setProject(result);
      useProjectStore.getState().setProjectPath(path);
    }
  };

  const handleOpenRecent = async (path: string) => {
    const result = await window.stellarforge.project.load(path);
    if (result) {
      useProjectStore.getState().setProject(result);
      useProjectStore.getState().setProjectPath(path);
    }
  };

  return (
    <HashRouter>
      <ToastProvider>
        {project ? (
          <AppShell>
            <Routes>
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<div className="p-8 text-[var(--sf-text-muted)]">Editor area — will be replaced by category views</div>} />
            </Routes>
          </AppShell>
        ) : (
          <ProjectWelcome
            onNew={handleNew}
            onOpen={handleOpen}
            onImport={() => {}}
            onOpenRecent={handleOpenRecent}
            recentProjects={[]}
          />
        )}
      </ToastProvider>
    </HashRouter>
  );
}
