import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '../../lib/utils';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react';

const PopoverContext = createContext(null);

function Popover({ children, open: controlledOpen, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const valueOpen = isControlled ? controlledOpen : open;
  const [referenceElement, setReferenceElement] = useState(null);

  function setOpenState(v) {
    if (!isControlled) setOpen(v);
    if (onOpenChange) onOpenChange(v);
  }

  return (
    <PopoverContext.Provider
      value={{
        open: valueOpen,
        setOpen: setOpenState,
        referenceElement,
        setReferenceElement,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ children }) {
  const ctx = useContext(PopoverContext);
  if (!ctx) return children;

  return React.cloneElement(children, {
    ref: (node) => {
      // Preserve child’s own ref if it exists
      const childRef = children.ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
      // Update context with the DOM node
      ctx.setReferenceElement(node);
    },
    onClick: (e) => {
      children.props?.onClick?.(e);
      ctx.setOpen(!ctx.open);
    },
  });
}

const PopoverContent = React.forwardRef(function PopoverContent(
  { className, style, placement = 'bottom-start', children, ...props },
  ref
) {
  const ctx = useContext(PopoverContext);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 640);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Floating UI – use the `refs` object for safer reference management
  const { refs, x, y, strategy } = useFloating({
    placement,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  // Whenever the context’s reference element changes, tell Floating UI
  useEffect(() => {
    if (ctx?.referenceElement) {
      refs.setReference(ctx.referenceElement);
    }
  }, [ctx?.referenceElement, refs]);

  // Outside click & Escape key handling
  useEffect(() => {
    function onDown(e) {
      const target = e.target;
      const refNode = ctx?.referenceElement;
      const floatingEl = refs.floating.current;
      if (!floatingEl) return;
      if (floatingEl.contains(target)) return;
      if (refNode && refNode.contains && refNode.contains(target)) return;
      ctx.setOpen(false);
    }

    function onKey(e) {
      if (e.key === 'Escape') ctx.setOpen(false);
    }

    if (ctx?.open) {
      document.addEventListener('mousedown', onDown);
      document.addEventListener('touchstart', onDown);
      document.addEventListener('keydown', onKey);
    }

    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ctx?.open, ctx?.referenceElement, refs.floating]);

  // Not open or missing context → render nothing
  if (!ctx || !ctx.open) return null;

  // Mobile: bottom sheet
  if (isMobile) {
    return (
      <FloatingPortal>
        <div
          className={cn('ui-bottom-sheet', className)}
          ref={ref}
          {...props}
          style={{ maxWidth: '100vw', ...style }}
        >
          {children}
        </div>
      </FloatingPortal>
    );
  }

  // Desktop: floating popover
  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating} // 👈 directly assign the floating setter
        className={cn('ui-popover-content', className)}
        style={{
          position: strategy,
          left: x ?? '',
          top: y ?? '',
          maxWidth: '100vw',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  );
});

export { Popover, PopoverContent, PopoverTrigger };