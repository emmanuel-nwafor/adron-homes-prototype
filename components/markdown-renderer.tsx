"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Rich Markdown & Image Renderer for AI Assistant Stream
 * Renders:
 * 1. Markdown Images ![alt](url) -> Responsive Image Cards
 * 2. Markdown Bold **text** -> <strong>
 * 3. Markdown Bullet Lists (* item, - item)
 * 4. Markdown Links [text](url) -> Clickable Links
 * 5. Headings (### Heading)
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content into blocks by lines
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`list_${renderedElements.length}`} className="list-disc pl-5 space-y-1 my-2 text-xs sm:text-sm">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      renderedElements.push(<div key={`space_${lineIdx}`} className="h-1.5" />);
      return;
    }

    // Check for Headings (### Title or ## Title)
    if (trimmed.startsWith("#")) {
      flushList();
      const headingText = trimmed.replace(/^#+\s*/, "");
      renderedElements.push(
        <h4 key={`h_${lineIdx}`} className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 mt-2 mb-1 font-aclonica">
          {parseFormattedInlineText(headingText)}
        </h4>
      );
      return;
    }

    // Check for Bullet points (* item or - item or • item)
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const itemText = trimmed.replace(/^[*•-]\s*/, "");
      currentListItems.push(
        <li key={`li_${lineIdx}_${currentListItems.length}`} className="leading-relaxed">
          {parseFormattedInlineText(itemText)}
        </li>
      );
      return;
    }

    // Check for Numbered lists (1. item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, "");
      currentListItems.push(
        <li key={`li_${lineIdx}_${currentListItems.length}`} className="leading-relaxed">
          {parseFormattedInlineText(itemText)}
        </li>
      );
      return;
    }

    // Regular line
    flushList();
    renderedElements.push(
      <p key={`p_${lineIdx}`} className="leading-relaxed my-1">
        {parseFormattedInlineText(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1 text-xs sm:text-sm leading-relaxed">{renderedElements}</div>;
}

/**
 * Parses inline elements: Images ![alt](url), Links [text](url), Bold **text**
 */
function parseFormattedInlineText(text: string): React.ReactNode {
  // Regex to extract images ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = imageRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseLinksAndBold(text.substring(lastIndex, match.index), `txt_${lastIndex}`));
    }

    const alt = match[1] || "Property Image";
    const src = match[2];

    parts.push(
      <div key={`img_${match.index}`} className="my-3 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-md bg-zinc-900 max-w-full">
        <img
          src={src}
          alt={alt}
          className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="p-2 bg-zinc-900/90 flex items-center justify-between text-[11px] text-zinc-300">
          <span className="truncate font-medium">{alt}</span>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            Full View <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );

    lastIndex = imageRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(parseLinksAndBold(text.substring(lastIndex), `txt_${lastIndex}`));
  }

  return parts;
}

/**
 * Parses markdown links [text](url) and bold **text**
 */
function parseLinksAndBold(text: string, keyPrefix: string): React.ReactNode {
  // Replace links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIdx = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      elements.push(parseBold(text.substring(lastIdx, match.index), `${keyPrefix}_b_${lastIdx}`));
    }

    const linkText = match[1];
    const linkUrl = match[2];

    elements.push(
      <a
        key={`${keyPrefix}_link_${match.index}`}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-600 dark:text-emerald-400 font-bold underline hover:text-emerald-500 inline-flex items-center gap-0.5"
      >
        {linkText}
        <ExternalLink className="w-3 h-3 inline" />
      </a>
    );

    lastIdx = linkRegex.lastIndex;
  }

  if (lastIdx < text.length) {
    elements.push(parseBold(text.substring(lastIdx), `${keyPrefix}_b_${lastIdx}`));
  }

  return elements;
}

/**
 * Parses bold text **text**
 */
function parseBold(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={`${keyPrefix}_str_${i}`} className="font-extrabold text-zinc-950 dark:text-white">
          {part}
        </strong>
      );
    }
    return part;
  });
}
