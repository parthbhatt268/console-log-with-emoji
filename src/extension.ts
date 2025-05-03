import * as vscode from 'vscode';
import * as path from 'path';


export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('console-log-with-emoji.main', async () => {
        
        const editor = vscode.window.activeTextEditor;
        if (!editor){
            return;
        }

        const { document, selection } = editor;
        const emojis = ['🚀', '✨', '🔥', '💡', '🌟', '⚡', '🎉', '💥', '🌈', '🐞', '🌿',
            '🌊', '🪐', '⚡', '🔍', '📌', '🍂', '🌙', '🌞',];

        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const fileName = path.basename(document.fileName);
        
        // Getting current line status
        const currentLine = document.lineAt(selection.end.line);
        const indentCol = currentLine.firstNonWhitespaceCharacterIndex;
        const isCurrLineEmpty = currentLine.text.trim() === '';

        let insertPos: vscode.Position;

        if (isCurrLineEmpty) {
            insertPos = new vscode.Position(currentLine.lineNumber, indentCol);
          } else {
            await vscode.commands.executeCommand('editor.action.insertLineAfter');
            const newLine = selection.end.line + 1;
            insertPos = new vscode.Position(newLine, indentCol);
          }

        // contructing the statment
        let body: string;
        if (selection.isEmpty) {
          body = `console.log('${emoji} | ${fileName} |');`;
        } else {
          const selectedText = document.getText(selection);
          body = `console.log('${emoji} | ${fileName} | ${selectedText}:', ${selectedText});`;
        }
    
        await editor.edit(edit => edit.insert(insertPos, body));
      });
    
      context.subscriptions.push(disposable);
    }
    
    export function deactivate() {}