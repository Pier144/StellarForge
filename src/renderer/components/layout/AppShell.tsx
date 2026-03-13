import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { MainArea } from './MainArea';
import { CodePanel } from './CodePanel';
import { StatusBar } from './StatusBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <TitleBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainArea>{children}</MainArea>
        <CodePanel />
      </div>
      <StatusBar />
    </div>
  );
}
