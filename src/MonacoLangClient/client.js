import * as monaco from 'monaco-editor-core'
import { getLanguageService, TextDocument } from "vscode-json-languageservice";
import { MonacoToProtocolConverter, ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter';

const LANGUAGE_ID = 'json';
const MODEL_URI = 'inmemory://model.json'
const MONACO_URI = monaco.Uri.parse(MODEL_URI);

// register the JSON language with Monaco
monaco.languages.register({
    id: LANGUAGE_ID,
    extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
    aliases: ['JSON', 'json'],
    mimetypes: ['application/json'],
});

// create the Monaco editor
const value = `{
    "$schema": "http://json.schemastore.org/coffeelint",
    "line_endings": "unix"
}`;
const editor = monaco.editor.create(document.getElementById("container"), {
    model: monaco.editor.createModel(value, LANGUAGE_ID, MONACO_URI),
    glyphMargin: true,
    lightbulb: {
        enabled: true,
    }
});

function getModel() {
    return monaco.editor.getModel(MONACO_URI);
}

function createDocument(model) {
    return TextDocument.create(MODEL_URI, model.getModeId(), model.getVersionId(), model.getValue());
}

function resolveSchema(url) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.open("GET", url, true);
        xhr.send();
    });
    return promise;
}

const m2p = new MonacoToProtocolConverter(monaco);
const p2m = new ProtocolToMonacoConverter(monaco);
const jsonService = getLanguageService({
    schemaRequestService: resolveSchema
});
const pendingValidationRequests = new Map();

monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
    provideCompletionItems(model, position, context, token) {
        const document = createDocument(model);
        const wordUntil = model.getWordUntilPosition(position);
        const defaultRange = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
        const jsonDocument = jsonService.parseJSONDocument(document);
        return jsonService.doComplete(document, m2p.asPosition(position.lineNumber, position.column), jsonDocument).then((list) => {
            return p2m.asCompletionResult(list, defaultRange);
        });
    },

    resolveCompletionItem(item, token) {
        return jsonService.doResolve(m2p.asCompletionItem(item)).then(result => p2m.asCompletionItem(result, item.range));
    }
});

monaco.languages.registerDocumentRangeFormattingEditProvider(LANGUAGE_ID, {
    provideDocumentRangeFormattingEdits(model, range, options, token) {
        const document = createDocument(model);
        const edits = jsonService.format(document, m2p.asRange(range), m2p.asFormattingOptions(options));
        return p2m.asTextEdits(edits);
    }
});

monaco.languages.registerDocumentSymbolProvider(LANGUAGE_ID, {
    provideDocumentSymbols(model, token) {
        const document = createDocument(model);
        const jsonDocument = jsonService.parseJSONDocument(document);
        return p2m.asSymbolInformations(jsonService.findDocumentSymbols(document, jsonDocument));
    }
});

monaco.languages.registerHoverProvider(LANGUAGE_ID, {
    provideHover(model, position, token) {
        const document = createDocument(model);
        const jsonDocument = jsonService.parseJSONDocument(document);
        return jsonService.doHover(document, m2p.asPosition(position.lineNumber, position.column), jsonDocument).then((hover) => {
            return p2m.asHover(hover);
        });
    }
});

getModel().onDidChangeContent((event) => {
    validate();
});

function validate() {
    const document = createDocument(getModel());
    cleanPendingValidation(document);
    pendingValidationRequests.set(document.uri, setTimeout(() => {
        pendingValidationRequests.delete(document.uri);
        doValidate(document);
    }));
}

function cleanPendingValidation(document) {
    const request = pendingValidationRequests.get(document.uri);
    if (request !== undefined) {
        clearTimeout(request);
        pendingValidationRequests.delete(document.uri);
    }
}

function doValidate(document) {
    if (document.getText().length === 0) {
        cleanDiagnostics();
        return;
    }
    const jsonDocument = jsonService.parseJSONDocument(document);
    jsonService.doValidation(document, jsonDocument).then((diagnostics) => {
        const markers = p2m.asDiagnostics(diagnostics);
        monaco.editor.setModelMarkers(getModel(), 'default', markers);
    });
}

function cleanDiagnostics() {
    monaco.editor.setModelMarkers(getModel(), 'default', []);
}

export default editor;