import { useRef, useCallback } from 'react';
import type { IReactToPrintProps } from 'react-to-print';
import { useReactToPrint } from 'react-to-print';

export default function usePrint(printConfig?: Partial<IReactToPrintProps>) {
  const componentRef = useRef(null);
  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const onPrint = useReactToPrint({
    content: reactToPrintContent,
    removeAfterPrint: !!printConfig?.removeAfterPrint,
    onPrintError: (errorLocation, error) => {
      if (printConfig?.onPrintError) {
        printConfig.onPrintError(errorLocation, error);
      }
      console.error(error, errorLocation);
    },
    onBeforePrint: () => {
      if (printConfig?.onBeforePrint) {
        printConfig?.onBeforePrint();
      }
    },
    onAfterPrint: () => {
      if (printConfig?.onAfterPrint) {
        printConfig?.onAfterPrint();
      }
    },
    onBeforeGetContent: () => {
      if (printConfig?.onBeforeGetContent) {
        printConfig?.onBeforeGetContent();
      }
    },
  });

  return {
    componentRef,
    onPrint,
  };
}
