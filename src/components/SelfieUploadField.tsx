"use client";

import { useRef, useState } from "react";

type ValidationState = {
  ok: boolean;
  message: string;
};

export function SelfieUploadField() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationState | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setValidation({ ok: false, message: "That file is not an image." });
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const minSide = Math.min(image.naturalWidth, image.naturalHeight);
      const isSquareEnough = Math.abs(image.naturalWidth - image.naturalHeight) < minSide * 0.35;
      if (minSide < 1080) {
        setValidation({ ok: false, message: "Use a photo at least 1080 x 1080 so the likeness model has enough detail." });
      } else if (!isSquareEnough) {
        setValidation({ ok: false, message: "Use a centered crop where your face is not pushed far to one side." });
      } else {
        setValidation({ ok: true, message: "Looks upload-ready. We will run server-side checks before generating." });
      }
      setPreview(url);
    };
    image.onerror = () => setValidation({ ok: false, message: "We could not preview that image. Try a JPG or PNG." });
    image.src = url;
  }

  return (
    <div
      className="dropzone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files.item(0);
        if (file && inputRef.current) {
          const transfer = new DataTransfer();
          transfer.items.add(file);
          inputRef.current.files = transfer.files;
          void handleFile(file);
        }
      }}
    >
      <div>
        {preview ? (
          <img
            alt="Selected selfie preview"
            src={preview}
            style={{ width: 180, height: 180, borderRadius: 8, objectFit: "cover", border: "1px solid var(--line)" }}
          />
        ) : (
          <div className="portrait-orbit" style={{ width: 180, margin: "0 auto 18px" }} />
        )}
        <h3>Drop your selfie here</h3>
        <p className="hint">Use a solo, well-lit, centered face photo. No sunglasses, heavy filters, or group shots.</p>
        <input
          ref={inputRef}
          className="input"
          type="file"
          name="selfie"
          accept="image/*"
          capture="user"
          required
          onChange={(event) => void handleFile(event.target.files?.item(0) ?? null)}
        />
        {validation ? (
          <p className={validation.ok ? "hint" : "error"} role="status">
            {validation.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
