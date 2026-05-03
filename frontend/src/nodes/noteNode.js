import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import './nodes.css';

const DEFAULT_NOTE_COLOR = '#e6e98b';
const SWATCHES = ['#e6e98b', '#f2f2f2', '#f6c978', '#f77b6f', '#95cda2', '#86bbe6', '#b98ad2'];

const normalizeEditorHTML = (html) => {
  if (!html) {
    return '';
  }

  const cleaned = html
    .replace(/<div><br><\/div>/gi, '')
    .replace(/<p><br><\/p>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();

  return cleaned;
};

const getCurrentBlock = () => {
  try {
    const value = document.queryCommandValue('formatBlock');
    return String(value || '').toLowerCase().replace(/[<>]/g, '');
  } catch (_error) {
    return '';
  }
};

export const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const removeNode = useStore((state) => state.removeNode);
  const editorRef = useRef(null);
  const hideToolbarTimerRef = useRef(null);
  const noteRef = useRef(null);
  const [showPalette, setShowPalette] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [initialContent] = useState(() => data?.contentHtml || '');
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    unordered: false,
    ordered: false,
    h1: false,
    h2: false,
    h3: false,
  });

  const noteColor = data?.noteColor || DEFAULT_NOTE_COLOR;
  const refreshFormats = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const selection = window.getSelection();
    const hasSelection =
      selection &&
      selection.rangeCount > 0 &&
      editor.contains(selection.anchorNode) &&
      editor.contains(selection.focusNode);

    if (!hasSelection) {
      setFormats((prev) => ({
        ...prev,
        unordered: false,
        ordered: false,
        h1: false,
        h2: false,
        h3: false,
      }));
      return;
    }

    const currentBlock = getCurrentBlock();

    setFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      unordered: document.queryCommandState('insertUnorderedList'),
      ordered: document.queryCommandState('insertOrderedList'),
      h1: currentBlock === 'h1',
      h2: currentBlock === 'h2',
      h3: currentBlock === 'h3',
    });
  }, []);

  const persistEditorHTML = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const normalized = normalizeEditorHTML(editor.innerHTML);
    updateNodeField(id, 'contentHtml', normalized);
  }, [id, updateNodeField]);

  const focusEditor = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.focus();
  };

  const runCommand = (command, value = null) => {
    focusEditor();
    document.execCommand(command, false, value);
    persistEditorHTML();
    refreshFormats();
  };

  const toggleHeading = (tag) => {
    focusEditor();
    const current = getCurrentBlock();
    const nextTag = current === tag ? 'p' : tag;
    document.execCommand('formatBlock', false, `<${nextTag}>`);
    persistEditorHTML();
    refreshFormats();
  };

  const handleEditorInput = () => {
    persistEditorHTML();
    refreshFormats();
  };

  const handlePaletteColor = (color) => {
    updateNodeField(id, 'noteColor', color);
    setShowPalette(false);
    focusEditor();
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      removeNode(id);
      return;
    }
    setConfirmDelete(true);
  };

  useEffect(() => {
    if (!confirmDelete) {
      return undefined;
    }
    const timer = window.setTimeout(() => setConfirmDelete(false), 1600);
    return () => window.clearTimeout(timer);
  }, [confirmDelete]);

  useEffect(() => {
    return () => {
      if (hideToolbarTimerRef.current) {
        window.clearTimeout(hideToolbarTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onSelectionChange = () => {
      refreshFormats();
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [refreshFormats]);

  return (
    <div className="vs-note" style={{ '--note-bg': noteColor }} ref={noteRef}>
      {isToolbarVisible ? (
        <div className="vs-note__toolbar nodrag">
        <div className="vs-note__toolbar-group">
          <button
            type="button"
            className="vs-note__swatch-trigger"
            aria-label="Pick note color"
            style={{ '--swatch-color': noteColor }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShowPalette((prev) => !prev)}
          />
          {showPalette ? (
            <div className="vs-note__swatches" role="menu" aria-label="Note colors">
              {SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`vs-note__swatch ${color === noteColor ? 'is-active' : ''}`}
                  style={{ '--swatch-color': color }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handlePaletteColor(color)}
                  aria-label={`Use color ${color}`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="vs-note__toolbar-group">
          <button
            type="button"
            className={`vs-note__tool ${formats.bold ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand('bold')}
            aria-label="Bold"
          >
            B
          </button>
          <button
            type="button"
            className={`vs-note__tool is-italic ${formats.italic ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand('italic')}
            aria-label="Italic"
          >
            I
          </button>
          <button
            type="button"
            className={`vs-note__tool is-underlined ${formats.underline ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand('underline')}
            aria-label="Underline"
          >
            U
          </button>
        </div>

        <div className="vs-note__toolbar-group">
          <button
            type="button"
            className={`vs-note__tool ${formats.unordered ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand('insertUnorderedList')}
            aria-label="Bulleted list"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="4" cy="5" r="1.2" />
              <circle cx="4" cy="10" r="1.2" />
              <circle cx="4" cy="15" r="1.2" />
              <path d="M8 5h8" />
              <path d="M8 10h8" />
              <path d="M8 15h8" />
            </svg>
          </button>
          <button
            type="button"
            className={`vs-note__tool ${formats.ordered ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand('insertOrderedList')}
            aria-label="Numbered list"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2.8 5h1.4V4H2.9" />
              <path d="M2.8 10h1.4V9H2.9" />
              <path d="M2.8 15h1.4v-1H2.9" />
              <path d="M8 5h8" />
              <path d="M8 10h8" />
              <path d="M8 15h8" />
            </svg>
          </button>
        </div>

        <div className="vs-note__toolbar-group">
          <button
            type="button"
            className={`vs-note__tool ${formats.h1 ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => toggleHeading('h1')}
            aria-label="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            className={`vs-note__tool ${formats.h2 ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => toggleHeading('h2')}
            aria-label="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            className={`vs-note__tool ${formats.h3 ? 'is-active' : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => toggleHeading('h3')}
            aria-label="Heading 3"
          >
            H3
          </button>
        </div>
      </div>
      ) : null}

      <div
        ref={editorRef}
        className="vs-note__editor"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: initialContent }}
        data-placeholder="Enter note text here..."
        onInput={handleEditorInput}
        onFocus={() => {
          if (hideToolbarTimerRef.current) {
            window.clearTimeout(hideToolbarTimerRef.current);
          }
          setIsToolbarVisible(true);
        }}
        onBlur={() => {
          persistEditorHTML();
          setShowPalette(false);
          setConfirmDelete(false);
          hideToolbarTimerRef.current = window.setTimeout(() => {
            const active = document.activeElement;
            const noteEl = noteRef.current;
            if (!noteEl || (active && noteEl.contains(active))) {
              return;
            }
            setIsToolbarVisible(false);
          }, 90);
        }}
      />

      <div className="vs-note__rail">
        <button
          type="button"
          className={`vs-note__rail-btn ${confirmDelete ? 'is-danger' : ''}`}
          aria-label={confirmDelete ? 'Confirm delete' : 'Delete note'}
          title={confirmDelete ? 'Confirm delete' : 'Delete note'}
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleDeleteClick}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="8.2" />
            <path d="m7 7 6 6" />
            <path d="m13 7-6 6" />
          </svg>
        </button>
        <button
          type="button"
          className="vs-note__rail-btn vs-note__drag-handle"
          aria-label="Drag to move"
          title="Drag to move"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="6" cy="6" r="1.2" />
            <circle cx="10" cy="6" r="1.2" />
            <circle cx="14" cy="6" r="1.2" />
            <circle cx="6" cy="10" r="1.2" />
            <circle cx="10" cy="10" r="1.2" />
            <circle cx="14" cy="10" r="1.2" />
            <circle cx="6" cy="14" r="1.2" />
            <circle cx="10" cy="14" r="1.2" />
            <circle cx="14" cy="14" r="1.2" />
          </svg>
        </button>
      </div>
    </div>
  );
};
