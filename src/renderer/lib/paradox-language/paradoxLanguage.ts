// src/renderer/lib/paradox-language/paradoxLanguage.ts
import * as monaco from 'monaco-editor';

export function registerParadoxLanguage() {
  monaco.languages.register({ id: 'paradox' });

  monaco.languages.setMonarchTokensProvider('paradox', {
    tokenizer: {
      root: [
        [/#.*$/, 'comment'],
        [/"[^"]*"/, 'string'],
        [/\b(yes|no)\b/, 'keyword'],
        [/\b(hsv|rgb)\b/, 'type'],
        [/@\w+/, 'variable'],
        [/[><=!]+/, 'operator'],
        [/\b\d+\.?\d*\b/, 'number'],
        [/[{}]/, 'delimiter.bracket'],
        [/\b\w+\b/, 'identifier'],
      ],
    },
  });
}
