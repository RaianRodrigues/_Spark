import * as vscode from 'vscode';

interface Snippets {

	[key: string]: string;

}

export function activate(context: vscode.ExtensionContext) {

	let createSnippetDisposable = vscode.commands.registerCommand('spark.createSnippet', async () => {

		const editor = vscode.window.activeTextEditor;

		if (!editor) {

			vscode.window.showErrorMessage('No text editor is active.');

			return;

		}

		const selectedText = editor.document.getText(editor.selection);

		if (!selectedText) {

			vscode.window.showErrorMessage('No text is selected. Snippet not created.');

			return;

		}

		const snippetName = await vscode.window.showInputBox({

			prompt: 'Enter a name for the snippet:',

			placeHolder: 'Snippet Name'

		});

		if (snippetName) {

			const snippets: Snippets = context.workspaceState.get('snippets', {});

			snippets[snippetName] = selectedText;

			context.workspaceState.update('snippets', snippets);

			vscode.window.showInformationMessage(`Snippet "${snippetName}" created.`);

		}

	});

	let insertSnippetDisposable = vscode.commands.registerCommand('spark.showSnippets', async () => {
		
		const editor = vscode.window.activeTextEditor;

		if (!editor) {

			vscode.window.showErrorMessage('No text editor is active.');

			return;

		}

		const snippets: Snippets = context.workspaceState.get('snippets', {});

		const snippetNames = Object.keys(snippets);

		if (snippetNames.length > 0) {

			const selectedSnippetName = await vscode.window.showQuickPick(snippetNames, {

				placeHolder: 'Select a snippet'

			});

			if (selectedSnippetName) {

				const selectedSnippet = snippets[selectedSnippetName];

				editor.edit((editBuilder) => {

					editBuilder.insert(editor.selection.start, selectedSnippet);

				});

			}

		} else {

			vscode.window.showErrorMessage('No snippets available');

		}

	});

	let deleteSnippetDisposable = vscode.commands.registerCommand('spark.deleteSnippet', async () => {

		const snippets: Snippets = context.workspaceState.get('snippets', {});

		const snippetNames = Object.keys(snippets);

		if (snippetNames.length > 0) {

			const selectedSnippetName = await vscode.window.showQuickPick(snippetNames, {

				placeHolder: 'Select a snippet to delete'

			});

			if (selectedSnippetName) {

				delete snippets[selectedSnippetName];

				context.workspaceState.update('snippets', snippets);

				vscode.window.showInformationMessage(`Snippet "${selectedSnippetName}" deleted.`);

			}

		} else {

			vscode.window.showErrorMessage('No snippets to delete.');

		}

	});

	context.subscriptions.push(createSnippetDisposable);

	context.subscriptions.push(insertSnippetDisposable);

	context.subscriptions.push(deleteSnippetDisposable);

}

export function deactivate() { }