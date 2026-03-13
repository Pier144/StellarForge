// src/renderer/lib/paradox-language/paradoxCompletion.ts
import * as monaco from 'monaco-editor';

const PARADOX_KEYWORDS = [
  'yes', 'no', 'hsv', 'rgb', 'NOT', 'AND', 'OR', 'NOR', 'NAND',
  'if', 'else', 'limit', 'modifier', 'weight', 'factor',
  'trigger', 'effect', 'mean_time_to_happen', 'immediate',
  'option', 'desc', 'name', 'icon', 'is_triggered_only',
  'fire_only_once', 'hide_window', 'picture', 'location',
  'potential', 'allow', 'ai_weight', 'base',
];

export function registerParadoxCompletion() {
  monaco.languages.registerCompletionItemProvider('paradox', {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: PARADOX_KEYWORDS.map(kw => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range,
        })),
      };
    },
  });
}
