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
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';

export function PreCode(props: { children: any }) {
  const { theme } = useConfigContext();
  const ref = useRef<HTMLPreElement>(null);

  return (
    <div className='sandpack'>
      <div className='sp-wrapper'>
        <div className='sp-stack'>
          <div
            className='sp-code-editor no-bg-scrollbar'
            style={{ backgroundColor: theme === 'light' ? '#fff' : '#16181d' }}
          >
            <pre
              ref={ref}
              className='sp-cm'
            >
              <CopyButton
                onCope={(fn: any) => {
                  if (ref.current) {
                    fn(ref.current.innerText);
                  }
                }}
              />
              <code className='sp-pre-placeholder'>{props.children}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

const OL = (p: JSX.IntrinsicElements['ol']) => (
  <ol
    className='my-3 ml-6 list-decimal'
    style={{ margin: '12px 0px 12px 12px', paddingLeft: '12px' }}
    {...p}
  />
);
const LI = (p: JSX.IntrinsicElements['li']) => (
  <li
    className='mb-1 leading-relaxed'
    {...p}
  />
);
const UL = (p: JSX.IntrinsicElements['ul']) => (
  <ul
    className='my-3 ml-6 list-disc'
    style={{ margin: '12px 0px 12px 12px', paddingLeft: '12px' }}
    {...p}
  />
);

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
        ol: OL,
        ul: UL,
        li: LI,
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
