import { convertRate } from '../utils/convertRate';
import { useCallback, useEffect, useState } from 'react';

export const useSelectionText = () => {
  const [selection, setSelection] = useState<Selection>(null);
  const [selectionText, setSelectionText] = useState<string>(null);
  const [jpy, setJpy] = useState<string>(null);

  const selectionChangeEvent = useCallback(() => {
    if (document.getSelection()?.toString().trim() === '') {
      setSelection(null);
      setSelectionText(null);
      setJpy(null);
      return;
    }
    const selectionText = document.getSelection()?.toString();
    setSelection(document.getSelection());
    setSelectionText(selectionText);
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', selectionChangeEvent);
    return () => {
      document.removeEventListener('selectionchange', selectionChangeEvent);
    };
  }, [selectionChangeEvent]);

  const calculateJpy = useCallback(async () => {
    const [success, value] = await convertRate(selection?.toString());
    if (success) {
      setJpy(value);
    }
  }, [selection]);

  useEffect(() => {
    calculateJpy();
  }, [calculateJpy, selectionText]);

  return {
    selection,
    setSelection,
    jpy,
  };
};
