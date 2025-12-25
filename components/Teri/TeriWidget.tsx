import { useState, useCallback } from 'react';
import type { TeriPageContext } from './types';
import { TeriLauncher } from './TeriLauncher';
import { TeriPanel } from './TeriPanel';

interface TeriWidgetProps {
  pageContext?: TeriPageContext;
  useStub?: boolean;
}

export default function TeriWidget({ pageContext = {}, useStub = false }: TeriWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {!isOpen && <TeriLauncher onClick={handleOpen} />}
      <TeriPanel
        isOpen={isOpen}
        onClose={handleClose}
        pageContext={pageContext}
        useStub={useStub}
      />
    </>
  );
}
