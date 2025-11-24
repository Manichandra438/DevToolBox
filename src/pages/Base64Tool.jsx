import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Trash2, Upload, Download, ExternalLink, FileText, Image as ImageIcon, File, Type } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { cn } from '../lib/utils';

export default function Base64Tool() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'file'

  // Text Mode State
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [textMode, setTextMode] = useState('encode'); // 'encode' or 'decode'
  const [textError, setTextError] = useState(null);

  // File Mode State
  // Left Side (File -> Base64)
  const [fileToEncode, setFileToEncode] = useState(null);
  const [encodedFileBase64, setEncodedFileBase64] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Right Side (Base64 -> File)
  const [base64ToFileInput, setBase64ToFileInput] = useState('');
  const [decodedFileBlob, setDecodedFileBlob] = useState(null);
  const [decodedFileMime, setDecodedFileMime] = useState('');
  const [decodedFilePreviewUrl, setDecodedFilePreviewUrl] = useState('');
  const [fileDecodeError, setFileDecodeError] = useState(null);

  // --- Text Mode Logic ---
  useEffect(() => {
    setTextError(null);
    if (!textInput) {
      setTextOutput('');
      return;
    }
    try {
      if (textMode === 'encode') {
        setTextOutput(btoa(textInput));
      } else {
        setTextOutput(atob(textInput));
      }
    } catch (err) {
      setTextError('Invalid input for ' + textMode);
    }
  }, [textInput, textMode]);

  // --- File Mode Logic: File -> Base64 ---
  const handleFileSelect = (file) => {
    if (!file) return;
    setFileToEncode(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setEncodedFileBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  // --- File Mode Logic: Base64 -> File ---
  const getMimeTypeFromBytes = (arr) => {
    const header = arr.subarray(0, 4).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').toUpperCase();
    if (header.startsWith('89504E47')) return 'image/png';
    if (header.startsWith('FFD8FF')) return 'image/jpeg';
    if (header.startsWith('47494638')) return 'image/gif';
    if (header.startsWith('25504446')) return 'application/pdf';
    if (header.startsWith('504B0304')) return 'application/zip';
    if (header.startsWith('424D')) return 'image/bmp';
    if (header.startsWith('52494646') && arr.subarray(8, 12).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').toUpperCase() === '57454250') return 'image/webp';
    return '';
  };

  useEffect(() => {
    setFileDecodeError(null);
    setDecodedFileBlob(null);
    setDecodedFilePreviewUrl('');
    setDecodedFileMime('');

    if (!base64ToFileInput) return;

    try {
      const cleanInput = base64ToFileInput.replace(/\s/g, '');
      let base64Data = cleanInput;
      let detectedMime = '';

      if (cleanInput.startsWith('data:')) {
        const matches = cleanInput.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
        if (matches) {
          detectedMime = matches[1];
          base64Data = matches[2];
        }
      }

      const decoded = atob(base64Data);
      const byteNumbers = new Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        byteNumbers[i] = decoded.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      if (!detectedMime) {
        detectedMime = getMimeTypeFromBytes(byteArray) || 'application/octet-stream';
      }

      const blob = new Blob([byteArray], { type: detectedMime });
      setDecodedFileBlob(blob);
      setDecodedFileMime(detectedMime);
      setDecodedFilePreviewUrl(URL.createObjectURL(blob));

    } catch (err) {
      setFileDecodeError('Invalid Base64 string');
    }
  }, [base64ToFileInput]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (decodedFilePreviewUrl) URL.revokeObjectURL(decodedFilePreviewUrl);
    };
  }, [decodedFilePreviewUrl]);


  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadDecodedFile = () => {
    if (!decodedFileBlob) return;
    const url = URL.createObjectURL(decodedFileBlob);
    const link = document.createElement('a');
    link.href = url;

    // Guess extension
    let ext = '';
    if (decodedFileMime === 'image/png') ext = '.png';
    else if (decodedFileMime === 'image/jpeg') ext = '.jpg';
    else if (decodedFileMime === 'application/pdf') ext = '.pdf';
    else if (decodedFileMime === 'text/plain') ext = '.txt';

    link.download = `decoded_file${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard
      title="Text & File Encoder / Decoder"
      description="Encode and decode text or files using Base64."
    >
      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('text')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'text'
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Type size={16} />
          Text
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'file'
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <File size={16} />
          File
        </button>
      </div>

      {/* Text Tab Content */}
      {activeTab === 'text' && (
        <div className="grid gap-6">
          <div className="flex justify-center">
            <div className="bg-muted p-1 rounded-lg flex items-center">
              <button
                onClick={() => setTextMode('encode')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  textMode === 'encode' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Encode
              </button>
              <button
                onClick={() => setTextMode('decode')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  textMode === 'decode' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Decode
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Input</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTextInput('')} className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground" title="Clear">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => handleCopy(textInput)} className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground" title="Copy">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-64 p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-input resize-none font-mono text-sm"
                placeholder={textMode === 'encode' ? "Type text to encode..." : "Paste Base64 to decode..."}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Output</label>
                <button onClick={() => handleCopy(textOutput)} className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground" title="Copy">
                  <Copy size={16} />
                </button>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  value={textOutput}
                  className={cn(
                    "w-full h-64 p-4 rounded-lg border border-input bg-muted/50 focus:outline-none resize-none font-mono text-sm",
                    textError && "border-destructive focus:border-destructive"
                  )}
                  placeholder="Result will appear here..."
                />
                {textError && (
                  <div className="absolute bottom-4 left-4 right-4 text-destructive text-sm bg-destructive/10 p-2 rounded border border-destructive/20">
                    {textError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Tab Content */}
      {activeTab === 'file' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: File to Base64 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <Upload size={20} /> File to Base64
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                "h-48 flex flex-col items-center justify-center gap-3"
              )}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              <Upload size={32} className="text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Drag & drop a file here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
            </div>

            {/* Selected File Info */}
            {fileToEncode && (
              <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between border border-border">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-background rounded-md border border-border">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{fileToEncode.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(fileToEncode.size / 1024).toFixed(2)} KB • {fileToEncode.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setFileToEncode(null); setEncodedFileBase64(''); }}
                  className="p-1.5 hover:bg-background rounded-md text-muted-foreground hover:text-foreground"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Base64 Output</label>
                <button
                  onClick={() => handleCopy(encodedFileBase64)}
                  disabled={!encodedFileBase64}
                  className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground disabled:opacity-50"
                  title="Copy"
                >
                  <Copy size={16} />
                </button>
              </div>
              <textarea
                readOnly
                value={encodedFileBase64}
                className="w-full h-48 p-4 rounded-lg border border-input bg-muted/50 focus:outline-none resize-none font-mono text-xs"
                placeholder="Encoded string will appear here..."
              />
            </div>
          </div>

          {/* Right Column: Base64 to File */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <Download size={20} /> Base64 to File
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Base64 Input</label>
              <textarea
                value={base64ToFileInput}
                onChange={(e) => setBase64ToFileInput(e.target.value)}
                className="w-full h-48 p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-input resize-none font-mono text-xs"
                placeholder="Paste your Base64 string here..."
              />
            </div>

            {/* Preview Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  {decodedFileMime && (decodedFileMime.startsWith('image/') ? <ImageIcon size={16} /> : <FileText size={16} />)}
                  {decodedFileMime ? 'Preview' : 'Preview'}
                </label>
                {decodedFilePreviewUrl && (
                  <a
                    href={decodedFilePreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                  >
                    Open in new tab <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div className="h-64 rounded-lg border border-input bg-muted/50 flex items-center justify-center overflow-hidden relative">
                {fileDecodeError ? (
                  <div className="text-destructive text-sm flex items-center gap-2">
                    <span className="font-medium">Error:</span> {fileDecodeError}
                  </div>
                ) : decodedFilePreviewUrl ? (
                  decodedFileMime.startsWith('image/') ? (
                    <img src={decodedFilePreviewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  ) : decodedFileMime === 'application/pdf' ? (
                    <iframe src={decodedFilePreviewUrl} className="w-full h-full" title="PDF Preview" />
                  ) : (
                    <div className="text-center p-4">
                      <FileText size={48} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Preview not available for this file type.</p>
                      <p className="text-xs text-muted-foreground mt-1">({decodedFileMime})</p>
                    </div>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">Enter Base64 to see preview</p>
                )}
              </div>
            </div>

            <button
              onClick={downloadDecodedFile}
              disabled={!decodedFileBlob}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download File
            </button>
          </div>
        </div>
      )}
    </ToolCard>
  );
}
