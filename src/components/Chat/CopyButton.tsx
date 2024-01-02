import React from 'react';
import { IconCopy } from '@/components/Icon/IconCopy';
import { IconCopied } from '@/components/Icon/IconCopied';

export function CopyButton({
  onCope,
  style = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '1.1em',
    height: '1.1em',
  },
  className,
}: {
  onCope: (fn: any) => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCope = async () => {
    onCope(function (code: any) {
      if (code) {
        copyToClipboard(code).then(() => {
          setCopied(true);
        });
      }
    });
  };
  return (
    <button
      type='button'
      title='Copy code'
      className={className}
      style={style}
      onClick={() => handleCope()}
    >
      {copied ? <IconCopied /> : <IconCopy />}
    </button>
  );
}

const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    return;
  }
  await navigator.clipboard.writeText(text);
};
