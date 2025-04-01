import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { TextArea } from '@my/ui'
import { XStack, YStack, Button, Spinner } from '@my/ui'
import { Trash, Plus } from '@tamagui/lucide-icons'

const minHeight = 50;
const maxHeight = 300; 

export const AutoHeightTextArea = ({
  value,
  onChange,
  onKeyDown,
  readOnly,
  placeholder,
  style,
  ...rest
}) => {
  const ref = useRef(null);

  const adjustHeight = () => {
    const textarea = ref.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  // El hack: Espera a que se estabilice el DOM
  useEffect(() => {
    setTimeout(() => {
      adjustHeight();
    }, 0);
  }, []);

  return (
    <textarea
      ref={ref}
      readOnly={readOnly}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      spellCheck={false}
      style={{
        lineHeight: '1.4',
        width: '100%',
        resize: 'none',
        overflowY: 'hidden',
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
        boxSizing: 'border-box',
        border: '1px solid var(--color6)',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: 'var(--color3)',
        ...style,
      }}
      {...rest}
    />
  );
};