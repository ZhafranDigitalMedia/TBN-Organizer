"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

type FormData = {
  namaPengantin: string;
  tanggal_acara: string;
  lokasi_acara: string;
  jumlah_tamu: string;
  tema: string;
  testimoni: string;
  featured: boolean;
};

export default function AddPortfolioForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    namaPengantin: "",
    tanggal_acara: "",
    lokasi_acara: "",
    jumlah_tamu: "",
    tema: "",
    testimoni: "",
    featured: false,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Optimasi pembentukan preview gambar
  const addFiles = (selectedFiles: File[]) => {
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length === 0) return;

    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));

    setFiles((prev) => [...prev, ...imageFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Data portfolio:", {
      ...formData,
      jumlah_tamu: Number(formData.jumlah_tamu),
      gambar: files,
    });
  };

  return (
    <div className="rounded-sm border border-[#EFEBE4] bg-[#FAF8F5] p-6 sm:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B87A5E]">
          Portfolio Management
        </p>
        <h1 className="font-serif text-2xl text-[#3D2E24] sm:text-3xl">
          Tambah Portfolio
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8C7361]">
          Tambahkan informasi pernikahan dan foto yang akan ditampilkan pada
          website portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Nama + Tanggal */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="namaPengantin"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
            >
              Nama Pengantin
            </label>
            <input
              id="namaPengantin"
              type="text"
              name="namaPengantin"
              value={formData.namaPengantin}
              onChange={handleChange}
              placeholder="Andi & Siti"
              required
              className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-[#3D2E24] outline-none transition-colors placeholder:text-[#A9988B] focus:border-[#B87A5E]"
            />
          </div>

          <div>
            <label
              htmlFor="tanggal_acara"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
            >
              Tanggal Pernikahan
            </label>
            <input
              id="tanggal_acara"
              type="date"
              name="tanggal_acara"
              value={formData.tanggal_acara}
              onChange={handleChange}
              onClick={(e) => e.currentTarget.showPicker?.()}
              required
              className="w-full cursor-pointer border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-[#3D2E24] outline-none transition-colors focus:border-[#B87A5E]"
            />
          </div>
        </div>

        {/* Lokasi + Jumlah Tamu */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="lokasi_acara"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
            >
              Lokasi
            </label>
            <input
              id="lokasi_acara"
              type="text"
              name="lokasi_acara"
              value={formData.lokasi_acara}
              onChange={handleChange}
              placeholder="Gedung Graha Sari, Jakarta"
              required
              className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-[#3D2E24] outline-none transition-colors placeholder:text-[#A9988B] focus:border-[#B87A5E]"
            />
          </div>

          <div>
            <label
              htmlFor="jumlah_tamu"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
            >
              Jumlah Tamu
            </label>
            <input
              id="jumlah_tamu"
              type="number"
              name="jumlah_tamu"
              min="0"
              value={formData.jumlah_tamu}
              onChange={handleChange}
              placeholder="500"
              required
              className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-[#3D2E24] outline-none transition-colors placeholder:text-[#A9988B] focus:border-[#B87A5E]"
            />
          </div>
        </div>

        {/* Tema */}
        <div>
          <label
            htmlFor="tema"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
          >
            Tema Wedding
          </label>
          <input
            id="tema"
            type="text"
            name="tema"
            value={formData.tema}
            onChange={handleChange}
            placeholder="Elegant Garden Wedding"
            required
            className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-[#3D2E24] outline-none transition-colors placeholder:text-[#A9988B] focus:border-[#B87A5E]"
          />
        </div>

        {/* Testimoni */}
        <div>
          <label
            htmlFor="testimoni"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
          >
            Testimoni
          </label>
          <textarea
            id="testimoni"
            name="testimoni"
            rows={4}
            value={formData.testimoni}
            onChange={handleChange}
            placeholder="Apa kata pasangan mengenai pelayanan TBN Wedding Organizer?"
            className="w-full resize-none border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm leading-relaxed text-[#3D2E24] outline-none transition-colors placeholder:text-[#A9988B] focus:border-[#B87A5E]"
          />
        </div>

        {/* Featured */}
        <div className="flex flex-col gap-3 border-y border-[#EFEBE4] py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]">
              Tampilkan sebagai Featured
            </p>
            <p className="mt-1 text-xs text-[#9A8678]">
              Portfolio featured dapat ditampilkan di halaman utama.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={formData.featured}
            aria-label="Tampilkan sebagai featured"
            onClick={() =>
              setFormData((prev) => ({ ...prev, featured: !prev.featured }))
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              formData.featured ? "bg-[#B87A5E]" : "bg-[#DCD5C9]"
            }`}
          >
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                formData.featured ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Upload Dropzone */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]">
            Foto Wedding
          </label>
          <p className="mb-4 text-xs text-[#9A8678]">
            Kamu bisa memilih beberapa foto sekaligus.
          </p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-sm border-2 border-dashed p-8 text-center transition-colors sm:p-12 ${
              isDragging
                ? "border-[#B87A5E] bg-[#F1E8DF]"
                : "border-[#DCD5C9] bg-[#F5F0E8]/50"
            }`}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE5DB]">
              <Upload className="h-5 w-5 text-[#B87A5E]" />
            </div>
            <p className="text-sm font-medium text-[#6E5544]">
              Drag & drop foto di sini
            </p>
            <p className="mt-1 text-xs text-[#9A8678]">
              atau pilih foto dari perangkat kamu
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 inline-flex items-center gap-2 border border-[#B87A5E] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#B87A5E] transition-colors hover:bg-[#B87A5E] hover:text-white"
            >
              <ImagePlus className="h-4 w-4" />
              Upload Foto
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6E5544]">
                  Preview Foto
                </p>
                <span className="text-xs text-[#9A8678]">
                  {files.length} foto dipilih
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {previews.map((preview, index) => (
                  <div
                    key={`${files[index]?.name}-${index}`}
                    className="group relative aspect-square overflow-hidden bg-[#F5F0E8]"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${files[index]?.name ?? index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Hapus ${files[index]?.name ?? "foto"}`}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2 pt-6">
                      <p className="truncate text-[10px] text-white">
                        {files[index]?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#EFEBE4] pt-6 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="bg-[#B87A5E] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#A3694E]"
          >
            Simpan Portfolio
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="border border-[#E8DFD1] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6E5544] transition-colors hover:bg-[#F5F0E8]"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
