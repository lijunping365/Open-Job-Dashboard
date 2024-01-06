import React from 'react';
import { IconCopy } from '@/components/Icon/IconCopy';
import { IconCopied } from '@/components/Icon/IconCopied';

export function CopyButton({
  onCope,
  className,
}: {
  onCope: (fn: any) => void;
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
