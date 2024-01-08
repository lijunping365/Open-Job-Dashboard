import React from 'react';
import { IconCopy } from '@/components/Icon/IconCopy';
import { IconCopied } from '@/components/Icon/IconCopied';
import { Button } from 'antd';

export function CopyButton({ onCope }: { onCope: (fn: any) => void }) {
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
    <Button
      type={'text'}
      size={'small'}
      onClick={() => handleCope()}
      className='chat-markdown-copy-btn'
      icon={copied ? <IconCopied /> : <IconCopy />}
    />
  );
}

const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    return;
  }
  await navigator.clipboard.writeText(text);
};
