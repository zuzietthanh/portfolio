import { useState, useRef } from "react";
import { Upload, X, Loader2, File } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

export default function FileUpload({ value, onChange, accept = "image/*", label = "Upload File", isImage = true }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value && (
        <div className="relative mb-2">
          {isImage ? (
            <Image src={value} alt="preview" className="w-full h-32 rounded-lg" fittingType="fill" />
          ) : (
            <div className="glass rounded-lg p-3 text-xs text-muted-foreground flex items-center gap-2">
              <File className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{value.split("/").pop()}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-7 w-7 rounded-full glass-strong flex items-center justify-center hover:scale-105 transition-transform"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full glass rounded-lg p-3 flex items-center justify-center gap-2 text-sm hover:glass-strong transition-all disabled:opacity-50"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Uploading..." : label}
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
    </div>
  );
}