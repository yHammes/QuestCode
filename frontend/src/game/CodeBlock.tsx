import { useMemo } from "react";

const JS_KEYWORDS = ["let", "const", "var", "function", "return", "if", "else", "for", "while", "true", "false", "null", "undefined", "typeof", "new"];
const PY_KEYWORDS = ["def", "return", "if", "elif", "else", "for", "while", "in", "range", "True", "False", "None", "import", "from", "print", "len", "sum"];

function highlight(code: string, language: "javascript" | "python") {
  const keywords = language === "javascript" ? JS_KEYWORDS : PY_KEYWORDS;
  // Tokenize: strings, numbers, comments, identifiers, other
  const tokenRegex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/[^\n]*|#[^\n]*|\b\d+\.?\d*\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b|[^\s\w])/g;
  const parts: { text: string; cls?: string }[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRegex.exec(code)) !== null) {
    if (m.index > last) parts.push({ text: code.slice(last, m.index) });
    const tok = m[0];
    let cls: string | undefined;
    if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith("`")) cls = "text-code-string";
    else if (tok.startsWith("//") || tok.startsWith("#")) cls = "text-code-comment";
    else if (/^\d/.test(tok)) cls = "text-code-number";
    else if (keywords.includes(tok)) cls = "text-code-keyword";
    else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(tok) && code[tokenRegex.lastIndex] === "(") cls = "text-code-fn";
    parts.push({ text: tok, cls });
    last = tokenRegex.lastIndex;
  }
  if (last < code.length) parts.push({ text: code.slice(last) });
  return parts;
}

interface Props {
  code: string;
  language: "javascript" | "python";
}

export function CodeBlock({ code, language }: Props) {
  const tokens = useMemo(() => highlight(code, language), [code, language]);
  const lines = code.split("\n");

  return (
    <div className="bg-code border border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-[0.15em]">
          {language === "javascript" ? "javascript" : "python"}
        </span>
        <span className="text-xs text-muted-foreground font-mono">snippet.{language === "javascript" ? "js" : "py"}</span>
      </div>
      <div className="flex font-mono text-sm">
        <div className="px-4 py-5 text-right text-code-comment select-none">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">{String(i + 1).padStart(2, "0")}</div>
          ))}
        </div>
        <pre className="px-4 py-5 overflow-x-auto flex-1 leading-6">
          <code>
            {tokens.map((t, i) =>
              t.cls ? <span key={i} className={t.cls}>{t.text}</span> : <span key={i}>{t.text}</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
