import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from './ui';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  FileText,
  Copy,
  Check,
  Star,
  CircleCheck,
  CircleX,
  Minus,
  ChevronRight,
  Zap,
  BookOpen,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Star rating component - using span to be valid inside <p> tags
const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({ rating, maxRating = 5 }) => {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
          )}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-slate-700">{rating}/{maxRating}</span>
    </span>
  );
};

// Score badge component - using span to be valid inside <p> tags
const ScoreBadge: React.FC<{ score: number; maxScore?: number; label?: string }> = ({ score, maxScore = 10, label }) => {
  const percentage = (score / maxScore) * 100;
  const getColorClass = () => {
    if (percentage >= 80) return 'from-emerald-500 to-emerald-600 text-white';
    if (percentage >= 60) return 'from-blue-500 to-blue-600 text-white';
    if (percentage >= 40) return 'from-amber-500 to-amber-600 text-white';
    return 'from-red-500 to-red-600 text-white';
  };

  return (
    <span className="inline-flex items-center gap-2">
      {label && <span className="text-sm text-slate-600">{label}</span>}
      <span className={cn('px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r shadow-sm', getColorClass())}>
        {score}/{maxScore}
      </span>
    </span>
  );
};

// Status indicator component  
const StatusIndicator: React.FC<{ status: 'good' | 'warning' | 'bad' | 'neutral'; text: string }> = ({ status, text }) => {
  const configs = {
    good: { icon: CircleCheck, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconColor: 'text-emerald-500' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconColor: 'text-amber-500' },
    bad: { icon: CircleX, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconColor: 'text-red-500' },
    neutral: { icon: Minus, bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', iconColor: 'text-slate-500' },
  };
  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', config.bg, config.border, config.text)}>
      <Icon size={12} className={config.iconColor} />
      {text}
    </span>
  );
};

// Code block with copy button
const CodeBlock: React.FC<{ language: string; children: string }> = ({ language, children }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      {language && (
        <div className="absolute left-4 top-2 text-xs text-slate-400 font-mono uppercase">
          {language}
        </div>
      )}
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          padding: '2.5rem 1rem 1rem 1rem',
          fontSize: '0.875rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

// Helper to detect and render ratings/scores in text
const renderEnhancedText = (text: string): React.ReactNode => {
  // Match patterns like "4/5", "8/10", "Rating: 4/5", etc.
  const ratingPattern = /(\d+)\/(\d+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  const textStr = String(text);
  
  while ((match = ratingPattern.exec(textStr)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(textStr.slice(lastIndex, match.index));
    }
    
    const score = parseInt(match[1]);
    const maxScore = parseInt(match[2]);
    
    // Render as stars if max is 5, otherwise as score badge
    if (maxScore === 5) {
      parts.push(<StarRating key={key++} rating={score} maxRating={maxScore} />);
    } else {
      parts.push(<ScoreBadge key={key++} score={score} maxScore={maxScore} />);
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < textStr.length) {
    parts.push(textStr.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

// Section card wrapper
const SectionCard: React.FC<{ children: React.ReactNode; variant?: 'default' | 'highlight' | 'warning' | 'success' }> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-white border-slate-200',
    highlight: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
    warning: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
    success: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
  };

  return (
    <div className={cn('rounded-xl border p-5 my-4 shadow-sm', variants[variant])}>
      {children}
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  // Pre-process content to detect section types
  const processedContent = content;

  return (
    <div className={cn('markdown-renderer', className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with icons and styling
          h1: ({ children, ...props }) => (
            <div className="flex items-center gap-4 mt-8 mb-6 pb-4 border-b-2 border-indigo-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900" {...props}>{children}</h1>
                <p className="text-sm text-slate-500 mt-1">AI-Generated Analysis</p>
              </div>
            </div>
          ),
          h2: ({ children, ...props }) => {
            // Detect section type from heading text
            const headingText = String(children).toLowerCase();
            let icon = BookOpen;
            let iconBg = 'bg-indigo-100';
            let iconColor = 'text-indigo-600';
            
            if (headingText.includes('strength') || headingText.includes('positive') || headingText.includes('good')) {
              icon = ThumbsUp;
              iconBg = 'bg-emerald-100';
              iconColor = 'text-emerald-600';
            } else if (headingText.includes('weakness') || headingText.includes('improvement') || headingText.includes('concern')) {
              icon = AlertCircle;
              iconBg = 'bg-amber-100';
              iconColor = 'text-amber-600';
            } else if (headingText.includes('recommendation') || headingText.includes('suggestion')) {
              icon = Lightbulb;
              iconBg = 'bg-violet-100';
              iconColor = 'text-violet-600';
            } else if (headingText.includes('score') || headingText.includes('rating') || headingText.includes('quality')) {
              icon = Award;
              iconBg = 'bg-amber-100';
              iconColor = 'text-amber-600';
            } else if (headingText.includes('summary') || headingText.includes('overview')) {
              icon = FileText;
              iconBg = 'bg-blue-100';
              iconColor = 'text-blue-600';
            } else if (headingText.includes('feedback')) {
              icon = Zap;
              iconBg = 'bg-teal-100';
              iconColor = 'text-teal-600';
            }
            
            const Icon = icon;
            
            return (
              <div className="flex items-center gap-3 mt-8 mb-4">
                <div className={cn('p-2 rounded-lg', iconBg)}>
                  <Icon className={cn('w-5 h-5', iconColor)} />
                </div>
                <h2 className="text-xl font-semibold text-slate-800" {...props}>{children}</h2>
              </div>
            );
          },
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3 flex items-center gap-2" {...props}>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-base font-medium text-slate-600 mt-4 mb-2 pl-6" {...props}>{children}</h4>
          ),
          
          // Paragraphs with smart text enhancement
          p: ({ children, ...props }) => {
            // Check if paragraph contains ratings
            const hasRating = typeof children === 'string' && /\d+\/\d+/.test(children);
            
            if (hasRating && typeof children === 'string') {
              return (
                <p className="text-slate-600 leading-relaxed my-3" {...props}>
                  {renderEnhancedText(children)}
                </p>
              );
            }
            
            return (
              <p className="text-slate-600 leading-relaxed my-3" {...props}>{children}</p>
            );
          },
          
          // Enhanced lists
          ul: ({ children, ...props }) => (
            <ul className="my-4 space-y-3" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-4 space-y-3 counter-reset-item" {...props}>
              {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<any>, { 'data-index': index + 1 });
                }
                return child;
              })}
            </ol>
          ),
          li: ({ children, ...props }) => {
            const dataIndex = (props as any)['data-index'];
            
            // Check if list item contains rating pattern
            const hasRating = typeof children === 'string' && /\d+\/\d+/.test(String(children));
            
            return (
              <li className="flex items-start gap-3 text-slate-600 bg-slate-50/50 rounded-lg p-3 hover:bg-slate-100/50 transition-colors" {...props}>
                {dataIndex ? (
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold flex items-center justify-center">
                    {dataIndex}
                  </span>
                ) : (
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 mt-2" />
                )}
                <span className="flex-1">
                  {hasRating && typeof children === 'string' ? renderEnhancedText(children) : children}
                </span>
              </li>
            );
          },
          
          // Enhanced blockquotes
          blockquote: ({ children, ...props }) => (
            <div className="relative my-6 pl-6 pr-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-400" {...props}>
              <div className="absolute -left-3 top-4 p-1.5 rounded-full bg-indigo-400">
                <Info className="w-3 h-3 text-white" />
              </div>
              <div className="text-slate-700 italic">{children}</div>
            </div>
          ),
          
          // Code blocks and inline code
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;
            
            if (isInline) {
              return (
                <code className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-mono border border-indigo-100" {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <CodeBlock language={match?.[1] || ''}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          
          // Enhanced tables
          table: ({ children, ...props }) => (
            <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-md">
              <table className="w-full text-sm" {...props}>{children}</table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50" {...props}>{children}</thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-slate-100 bg-white" {...props}>{children}</tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-indigo-50/30 transition-colors" {...props}>{children}</tr>
          ),
          th: ({ children, ...props }) => (
            <th className="px-5 py-4 text-left font-semibold text-slate-700 border-b-2 border-slate-200 uppercase text-xs tracking-wider" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => {
            // Check if cell contains rating
            const hasRating = typeof children === 'string' && /\d+\/\d+/.test(String(children));
            
            return (
              <td className="px-5 py-4 text-slate-600" {...props}>
                {hasRating && typeof children === 'string' ? renderEnhancedText(children) : children}
              </td>
            );
          },
          
          // Links
          a: ({ href, children, ...props }) => (
            <a 
              href={href} 
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-200 hover:decoration-indigo-400 decoration-2 underline-offset-2 transition-all"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          
          // Strong and emphasis with enhanced styling
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-slate-800 bg-amber-50 px-1 rounded" {...props}>{children}</strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-slate-700 not-italic font-medium text-indigo-600" {...props}>{children}</em>
          ),
          
          // Horizontal rule
          hr: () => (
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <Sparkles className="w-4 h-4 text-slate-300" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>
          ),
          
          // Images
          img: ({ src, alt, ...props }) => (
            <figure className="my-6">
              <img 
                src={src} 
                alt={alt} 
                className="rounded-xl shadow-lg max-w-full h-auto mx-auto border border-slate-200"
                {...props}
              />
              {alt && <figcaption className="text-center text-sm text-slate-500 mt-3 italic">{alt}</figcaption>}
            </figure>
          ),
        }}
      >
        {processedContent}
      </Markdown>
    </div>
  );
};

// Score/Rating display component
export const ScoreDisplay: React.FC<{ score: number; maxScore?: number; label?: string }> = ({ 
  score, 
  maxScore = 10, 
  label = 'Overall Score' 
}) => {
  const percentage = (score / maxScore) * 100;
  const getColor = () => {
    if (percentage >= 80) return 'emerald';
    if (percentage >= 60) return 'indigo';
    if (percentage >= 40) return 'amber';
    return 'red';
  };
  
  const colorClasses = {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-200' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', ring: 'ring-indigo-200' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-200' },
    red: { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-200' },
  };
  
  const colors = colorClasses[getColor()];
  
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className={cn('relative w-16 h-16 rounded-full ring-4', colors.ring)}>
        <svg className="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle 
            cx="32" cy="32" r="28" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray={`${percentage * 1.76} 176`}
            className={colors.text}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-xl font-bold', colors.text)}>{score}</span>
        </div>
      </div>
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-lg font-semibold text-slate-800">{score}/{maxScore}</div>
      </div>
    </div>
  );
};

// Section header component
export const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode; badge?: string }> = ({ 
  title, 
  icon,
  badge 
}) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
    <div className="flex items-center gap-3">
      {icon && <div className="p-2 rounded-lg bg-slate-100">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    </div>
    {badge && (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
        {badge}
      </span>
    )}
  </div>
);

export default MarkdownRenderer;
