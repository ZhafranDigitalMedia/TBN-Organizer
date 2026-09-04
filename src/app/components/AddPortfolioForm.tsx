"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import { ImagePlus, Upload, X, MapPin, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const WILAYAH_OPTIONS = [
  "Jakarta",
  "Bekasi",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bandung",
];

type FormData = {
  namaPengantin: string;
  tanggal_acara: string;
  wilayah: string;
  lokasi_acara: string;   // Nama Venue / Gedung
  alamat_lengkap: string; // Alamat otomatis dari OpenStreetMap
  maps_url: string;       // Link Google Maps pencarian otomatis
  jumlah_tamu: string;
  testimoni: string;
  featured: boolean;
};

type LocationSuggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export default function AddPortfolioForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    namaPengantin: "",
    tanggal_acara: "",
    wilayah: "",
    lokasi_acara: "",
    alamat_lengkap: "",
    maps_url: "",
    jumlah_tamu: "",
    testimoni: "",
    featured: false,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // State untuk Autocomplete Gratis (OpenStreetMap)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pencarian Lokasi Gratis via OpenStreetMap (Nominatim)
  const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, lokasi_acara: value }));

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    // Debounce 400ms agar tidak spam API
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const query = `${value} ${formData.wilayah}`.trim();
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=id&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Gagal mengambil lokasi:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  // User memilih salah satu hasil lokasi
  const handleSelectLocation = (item: LocationSuggestion) => {
    // Ambil bagian pertama nama tempat dari display_name
    const namaGedung = item.display_name.split(",")[0];
    const alamatLengkap = item.display_name;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${namaGedung} ${alamatLengkap}`
    )}`;

    setFormData((prev) => ({
      ...prev,
      lokasi_acara: namaGedung,
      alamat_lengkap: alamatLengkap,
      maps_url: googleMapsUrl,
    }));

    setShowDropdown(false);
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Jika alamat_lengkap belum terisi dari dropdown, buat default maps_url
      const finalMapsUrl =
        formData.maps_url ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${formData.lokasi_acara} ${formData.wilayah}`
        )}`;

      data.append("namaPengantin", formData.namaPengantin);
      data.append("tanggal_acara", formData.tanggal_acara);
      data.append("wilayah", formData.wilayah);
      data.append("lokasi_acara", formData.lokasi_acara);
      data.append("alamat_lengkap", formData.alamat_lengkap || formData.lokasi_acara);
      data.append("maps_url", finalMapsUrl);
      data.append("jumlah_tamu", formData.jumlah_tamu);
      data.append("testimoni", formData.testimoni);
      data.append("featured", String(formData.featured));

      files.forEach((file) => {
        data.append("gambar", file);
      });

      const response = await fetch("/api/portfolio", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan portfolio");
      }

      alert("Portfolio berhasil disimpan!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Gagal menyimpan portfolio:", error);
      alert("Gagal menyimpan portfolio.");
    }
  };

  return (
    <div className="rounded-sm border border-[#EFEBE4] bg-[#FAF8F5] p-6 sm:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-tbn-terracotta">
          Portfolio Management
        </p>
        <h1 className="font-serif text-2xl text-tbn-dark sm:text-3xl">
          Tambah Portfolio
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8C7361]">
          Tambahkan informasi pernikahan dan foto yang akan ditampilkan pada website portfolio.
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
              className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-tbn-dark outline-none transition-colors placeholder:text-[#A9988B] focus:border-tbn-terracotta"
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
              className="w-full cursor-pointer border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-tbn-dark outline-none transition-colors focus:border-tbn-terracotta"
            />
          </div>
        </div>

        {/* Wilayah + Lokasi Detail (OSM Free Search) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="wilayah"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
            >
              Wilayah (Kota/Kabupaten)
            </label>
            <select
              id="wilayah"
              name="wilayah"
              value={formData.wilayah}
              onChange={handleChange}
              required
              className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-tbn-dark outline-none transition-colors focus:border-tbn-terracotta"
            >
              <option value="" disabled>
                -- Pilih Wilayah --
              </option>
              {WILAYAH_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label
              htmlFor="lokasi_acara"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]"
            >
              Nama Venue / Gedung
            </label>

            <div className="relative">
              <input
                type="text"
                name="lokasi_acara"
                value={formData.lokasi_acara}
                onChange={handleLocationInputChange}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                placeholder="Ketik nama gedung (contoh: Graha Sari)..."
                required
                className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 pr-10 text-sm text-tbn-dark outline-none transition-colors placeholder:text-[#A9988B] focus:border-tbn-terracotta"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9988B]">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin text-tbn-terracotta" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Dropdown Rekomendasi Alamat Gratis */}
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border border-[#E8DFD1] bg-white shadow-lg">
                {suggestions.map((item) => (
                  <li
                    key={item.place_id}
                    onClick={() => handleSelectLocation(item)}
                    className="cursor-pointer border-b border-[#F5F0E8] px-4 py-2.5 text-xs text-tbn-dark transition-colors hover:bg-[#F5F0E8] last:border-none"
                  >
                    <p className="font-semibold text-tbn-dark">
                      {item.display_name.split(",")[0]}
                    </p>
                    <p className="truncate text-[10px] text-[#8C7361]">
                      {item.display_name}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Alamat Lengkap & Link Maps (Tampil Otomatis) */}
        {formData.alamat_lengkap && (
          <div className="rounded-sm border border-[#E8DFD1] bg-[#F5F0E8]/60 p-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-tbn-terracotta mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E5544]">
                  Alamat Lengkap Terdeteksi:
                </p>
                <p className="text-xs text-[#3A2E2B] leading-relaxed mt-0.5">
                  {formData.alamat_lengkap}
                </p>
              </div>
            </div>

            {formData.maps_url && (
              <a
                href={formData.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-tbn-terracotta hover:underline pt-1"
              >
                Lihat di Google Maps &rarr;
              </a>
            )}
          </div>
        )}

        {/* Jumlah Tamu */}
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
            className="w-full border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm text-tbn-dark outline-none transition-colors placeholder:text-[#A9988B] focus:border-tbn-terracotta"
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
            className="w-full resize-none border border-[#E8DFD1] bg-[#F5F0E8] px-4 py-3 text-sm leading-relaxed text-tbn-dark outline-none transition-colors placeholder:text-[#A9988B] focus:border-tbn-terracotta"
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
              formData.featured ? "bg-tbn-terracotta" : "bg-[#DCD5C9]"
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
                ? "border-tbn-terracotta bg-[#F1E8DF]"
                : "border-[#DCD5C9] bg-[#F5F0E8]/50"
            }`}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE5DB]">
              <Upload className="h-5 w-5 text-tbn-terracotta" />
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
              className="mt-5 inline-flex items-center gap-2 border border-tbn-terracotta px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-tbn-terracotta transition-colors hover:bg-tbn-terracotta hover:text-white"
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
            className="bg-tbn-terracotta px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#A3694E]"
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