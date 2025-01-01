import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';

const NoteLayout = ({
  sidebar,
  content,
}: {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15} minSize={12} maxSize={30}>
        {sidebar}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>{content}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default NoteLayout;
