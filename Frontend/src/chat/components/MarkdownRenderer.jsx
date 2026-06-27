import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

// Custom code block component
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper my-3">
      <div className="code-block-header">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#fbbf24' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              color: '#22d3ee',
              border: '1px solid rgba(34,211,238,0.2)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all"
          style={{
            background: copied ? 'rgba(52, 211, 153, 0.15)' : 'rgba(51, 65, 85, 0.6)',
            color: copied ? '#34d399' : '#94a3b8',
            border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(71,85,105,0.4)'}`,
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#0a0f1e',
          fontSize: '0.8rem',
          lineHeight: '1.6',
          fontFamily: 'JetBrains Mono, monospace',
        }}
        lineNumberStyle={{
          color: '#334155',
          minWidth: '2.5em',
          paddingRight: '1em',
          userSelect: 'none',
        }}
        wrapLongLines={false}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

// Main Markdown renderer
const MarkdownRenderer = ({ content = '' }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const value = String(children || '').replace(/\n$/, '');

            if (!inline && (match || value.includes('\n'))) {
              return <CodeBlock language={language} value={value} />;
            }

            return (
              <code
                className={className}
                {...props}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.85em',
                  background: 'rgba(51, 65, 85, 0.8)',
                  color: '#22d3ee',
                  padding: '0.15em 0.4em',
                  borderRadius: '4px',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                }}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#f1f5f9',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #334155',
              lineHeight: '1.3',
            }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#e2e8f0',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
              lineHeight: '1.4',
            }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#cbd5e1',
              marginTop: '1rem',
              marginBottom: '0.4rem',
              lineHeight: '1.4',
            }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: '0.75rem', lineHeight: '1.7', color: '#cbd5e1' }}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '0.25rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '3px solid #22d3ee',
              padding: '0.5rem 1rem',
              margin: '0.75rem 0',
              background: 'rgba(34, 211, 238, 0.05)',
              borderRadius: '0 8px 8px 0',
              color: '#94a3b8',
              fontStyle: 'italic',
            }}>
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr style={{
              border: 'none',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #334155, transparent)',
              margin: '1.5rem 0',
            }} />
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{
              background: 'rgba(34, 211, 238, 0.1)',
              color: '#22d3ee',
              fontWeight: 600,
              padding: '0.6rem 0.75rem',
              textAlign: 'left',
              border: '1px solid #334155',
            }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #1e293b',
              color: '#cbd5e1',
            }}>
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#22d3ee', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: '#f1f5f9' }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: 'italic', color: '#94a3b8' }}>{children}</em>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              style={{ maxWidth: '100%', borderRadius: '8px', margin: '0.5rem 0' }}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;