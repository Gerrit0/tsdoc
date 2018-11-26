import { ParserMessage } from './ParserMessage';
import { TextRange } from './TextRange';
import { TokenSequence } from './TokenSequence';
import { DocNode } from '../nodes/DocNode';
import { DocErrorText } from '../nodes/DocErrorText';
import { IDiagnosticDefinition } from './TSDocDiagnostics';

/**
 * Used to report errors and warnings that occurred during parsing.
 */
export class ParserMessageLog {
  private _messages: ParserMessage[] = [];

  /**
   * The unfiltered list of all messages.
   */
  public get messages(): ReadonlyArray<ParserMessage> {
    return this._messages;
  }

  /**
   * Append a message to the log.
   */
  public addMessage(parserMessage: ParserMessage): void {
    this._messages.push(parserMessage);
  }

  /**
   * Append a message associated with a TextRange.
   */
  public addMessageForTextRange(diagnosticDefinition: IDiagnosticDefinition, messageText: string,
    textRange: TextRange): void {

    this.addMessage(new ParserMessage({
      diagnosticDefinition,
      messageText,
      textRange
    }));
  }

  /**
   * Append a message associated with a TokenSequence.
   */
  public addMessageForTokenSequence(diagnosticDefinition: IDiagnosticDefinition, messageText: string,
    tokenSequence: TokenSequence, docNode?: DocNode): void {

    this.addMessage(new ParserMessage({
      diagnosticDefinition,
      messageText,
      textRange: tokenSequence.getContainingTextRange(),
      tokenSequence,
      docNode
    }));
  }

  /**
   * Append a message associated with a TokenSequence.
   */
  public addMessageForDocErrorText(docErrorText: DocErrorText): void {
    let tokenSequence: TokenSequence;

    if (docErrorText.textExcerpt) {
      // If there is an excerpt directly associated with the DocErrorText, highlight that:
      tokenSequence = docErrorText.textExcerpt;
    } else {
      // Otherwise we can use the errorLocation, but typically that is meant to give additional
      // details, not to indicate the primary location of the problem.
      tokenSequence = docErrorText.errorLocation;
    }

    this.addMessage(new ParserMessage({
      diagnosticDefinition: docErrorText.diagnosticDefinition,
      messageText: docErrorText.errorMessage,
      textRange: tokenSequence.getContainingTextRange(),
      tokenSequence: tokenSequence,
      docNode: docErrorText
    }));
  }
}
