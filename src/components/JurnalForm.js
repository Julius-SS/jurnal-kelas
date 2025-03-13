import { useState, useEffect } from "react";

const JurnalForm = ({ tambahJurnal, editData }) => {
  const [tanggal, setTanggal] = useState("");
  const [kelas, setKelas] = useState("");
  const [guru, setGuru] = useState("");
  const [subjek, setSubjek] = useState("");
  const [topik, setTopik] = useState("");
  const [kehadiran, setKehadiran] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // Menambahkan state untuk waktuDibuat
  const [waktuDibuat, setWaktuDibuat] = useState("");

  useEffect(() => {
    if (editData) {
      setTanggal(editData.tanggal);
      setKelas(editData.kelas);
      setGuru(editData.guru);
      setSubjek(editData.subjek);
      setTopik(editData.topik);
      setKehadiran(editData.kehadiran);
      setKeterangan(editData.keterangan);
      setWaktuDibuat(editData.waktuDibuat); // Set waktuDibuat jika sedang dalam mode edit
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const jurnalBaru = {
      tanggal,
      kelas,
      guru,
      subjek,
      topik,
      kehadiran,
      keterangan,
      waktuDibuat: editData ? editData.waktuDibuat : new Date().toISOString(), // Menggunakan waktuDibuat jika mengedit
    };

    tambahJurnal(jurnalBaru);
    setTanggal("");
    setKelas("");
    setGuru("");
    setSubjek("");
    setTopik("");
    setKehadiran("");
    setKeterangan("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {editData && (
        <div>
          <p><strong>Waktu Dibuat:</strong> {new Date(waktuDibuat).toLocaleString()}</p> {/* Menampilkan waktu pembuatan */}
        </div>
      )}
      <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
      <input type="text" placeholder="Kelas" value={kelas} onChange={(e) => setKelas(e.target.value)} required />
      <input type="text" placeholder="Nama Guru" value={guru} onChange={(e) => setGuru(e.target.value)} required />
      <input type="text" placeholder="Subjek" value={subjek} onChange={(e) => setSubjek(e.target.value)} required />
      <input type="text" placeholder="Topik" value={topik} onChange={(e) => setTopik(e.target.value)} required />
      <input type="text" placeholder="Kehadiran Siswa" value={kehadiran} onChange={(e) => setKehadiran(e.target.value)} required />
      <input type="text" placeholder="Keterangan" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} required />
      <button type="submit">Simpan</button>
    </form>
  );
};

export default JurnalForm;
