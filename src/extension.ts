import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('console-log-with-emoji.main', async () => {
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const { document, selection } = editor;
        const emojis = ['🚀', '✨', '🔥', '💡', '🌟', '⚡', '🎉', '💥', '🌈', '🐞'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const fileName = path.basename(document.fileName);
        
        // Get current line status
        const currentLine = document.lineAt(selection.end.line);
        const indent = currentLine.text.slice(0, currentLine.firstNonWhitespaceCharacterIndex);

        if (selection.isEmpty) {
            const logStatement = `${indent}console.log(\`${emoji} | ${fileName} |\`)`;
            
            // Insert on a new line if current line has some content on it
            if (currentLine.text.trim()) {
                await vscode.commands.executeCommand('editor.action.insertLineAfter');
                editor.edit(edit => edit.insert(
                    new vscode.Position(selection.end.line + 1, 0),
                    logStatement
                ));
            } else {
                editor.edit(edit => edit.insert(selection.end, logStatement));
            }
        } else {
            const selectedText = document.getText(selection);
            const logStatement = `${indent}console.log(\`${emoji} | ${fileName} | ${selectedText}: \`, ${selectedText})`;
            
            await vscode.commands.executeCommand('editor.action.insertLineAfter');
            editor.edit(edit => edit.insert(
                new vscode.Position(selection.end.line + 1, 0),
                logStatement
            ));
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}