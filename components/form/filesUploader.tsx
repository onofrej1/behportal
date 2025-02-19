"use client";
import React, { memo, useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Progress } from "../ui/progress";
import { useUploadForm } from "@/hooks/useUploadForm";
import { useDialog } from "@/state";

interface FileUploaderProps {
  name?: any;
  onChange: (files: File[]) => void;
  allowedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  uploadText?: string;
  open: boolean;
  onClose: () => void;
}

export default function FilesUploader(props: FileUploaderProps) {
  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

  const {
    onChange,
    allowedTypes = allowedFileTypes,
    maxSize = 1024 * 1024,
    maxFiles = 10,
    //uploadText,
    open,
    onClose,
  } = props;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  //const [test, setTest] = useState('init');
  const [filesLimit, setFilesLimit] = useState(false);
  const { uploadForm, progress } = useUploadForm();
  //const [fileUploaderOpen, setFileUploaderOpen] = useState(true);
  const {
    open: openDialog,
    setTitle,
    setAction,
    setContent,
    isOpen,
  } = useDialog();

  useEffect(() => {
    if (open) {
      setContent(<Content selectedFiles={selectedFiles} />);
      openDialog();
    }
  }, [open]);

  useEffect(() => {
    if (!isOpen) {
      onClose();
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.prototype.slice.call(event.target.files);
    const uploaded = [...selectedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert("This file type is not supported !");
        return;
      }

      if (file.size > maxSize) {
        alert("Uploaded file is too big !");
        return;
      }
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === maxFiles) setFilesLimit(true);
        if (uploaded.length > maxFiles) {
          alert(`You can only add a maximum of ${maxFiles} files`);
          setFilesLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) {
      setSelectedFiles(uploaded);
      onChange(uploaded);
      setContent(<Content selectedFiles={uploaded} />);
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files as File[];
    console.log(droppedFiles);
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
    }
  };

  const removeFile = (selectedFiles: File[], file: File) => {
    const files = selectedFiles.filter((f) => f.name !== file.name);
    setSelectedFiles(files);
    onChange(files);
    setContent(<Content selectedFiles={files} />);
  };

  /*const onFileUpload = () => {
    onChange(selectedFiles);
  }*/

  const Content = ({ selectedFiles }: { selectedFiles: File[] }) => (
    <div className="border border-gray p-3">
      <div
        className="flex items-center justify-center w-full mb-3"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="flex flex-col gap-3">
          {selectedFiles.map((file) => (
            <div className="flex items-center justify-between" key={file.name}>
              <div>{file.name}</div>
              <div>
                <XIcon onClick={() => removeFile(selectedFiles, file)} className="size-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return null;
}
