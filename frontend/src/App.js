import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  const [isSubheaderCollapsed, setIsSubheaderCollapsed] = useState(false);

  return (
    <main className="app-shell">
      <PipelineToolbar isSubheaderCollapsed={isSubheaderCollapsed} />
      <PipelineUI
        isSubheaderCollapsed={isSubheaderCollapsed}
        onToggleSubheader={() => setIsSubheaderCollapsed((prev) => !prev)}
      />
    </main>
  );
}

export default App;
