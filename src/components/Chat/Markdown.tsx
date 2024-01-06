import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMath from 'remark-math';
import RemarkBreaks from 'remark-breaks';
import RehypeKatex from 'rehype-katex';
import RemarkGfm from 'remark-gfm';
import rehypePrismPlus from 'rehype-prism-plus';
import { useRef, RefObject } from 'react';
import { IconLoading } from '@/components/Icon/IconLoading';
import { CopyButton } from '@/components/Chat/CopyButton';

export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <div
      style={{ display: 'flex', height: '100%', width: '100%' }}
      className='sandpack flex h-full w-full items-center overflow-x-auto rounded-lg bg-wash shadow-lg dark:bg-gray-95 my-8'
    >
      <div className='sp-wrapper'>
        <div className='sp-stack'>
          <div className='sp-code-editor no-bg-scrollbar'>
            <pre
              ref={ref}
              className='sp-cm sp-pristine sp-javascript align-start flex'
            >
              <CopyButton
                className='chat-markdown-copy-btn'
                onCope={(fn: any) => {
                  if (ref.current) {
                    fn(ref.current.innerText);
                  }
                }}
              />
              <code className='sp-pre-placeholder grow-[2]'>
                {props.children}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function _MarkDownContent(props: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[RehypeKatex, [rehypePrismPlus, { ignoreMissing: true }]]}
      components={{
        pre: PreCode,
        p: (pProps) => (
          <p
            {...pProps}
            dir='auto'
          />
        ),
        a: (aProps) => {
          const href = aProps.href || '';
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? '_self' : aProps.target ?? '_blank';
          return (
            <a
              {...aProps}
              target={target}
            />
          );
        },
      }}
    >
      {props.content}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>
) {
  const mdRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className='markdown-body'
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      dir='auto'
    >
      {props.loading ? (
        <IconLoading />
      ) : (
        <MarkdownContent content={props.content} />
      )}
    </div>
  );
}
