import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import JurnalForm from "./components/JurnalForm";

function App() {
  const [jurnalList, setJurnalList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [filterKelas, setFilterKelas] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [filterGuru, setFilterGuru] = useState("");
  const [filterSubjek, setFilterSubjek] = useState("");

  useEffect(() => {
    const dataTersimpan = localStorage.getItem("jurnalList");
    if (dataTersimpan) {
      setJurnalList(JSON.parse(dataTersimpan));
    }
  }, []);

  useEffect(() => {
    if (jurnalList.length > 0) {
      localStorage.setItem("jurnalList", JSON.stringify(jurnalList));
    } else {
      localStorage.removeItem("jurnalList");
    }
  }, [jurnalList]);

  const tambahJurnal = (jurnalBaru) => {
    jurnalBaru.diketahui = jurnalBaru.diketahui ?? false;
    
    // Menambahkan waktuDibuat untuk jurnal baru
    jurnalBaru.waktuDibuat = new Date().toISOString();  // Menyimpan waktu saat jurnal dibuat
  
    if (editIndex !== null) {
      const jurnalLama = jurnalList[editIndex];
      const selisihWaktu = (new Date() - new Date(jurnalLama.waktuDibuat)) / (1000 * 60 * 60); // Menghitung selisih waktu dalam jam
      
      if (selisihWaktu <= 24) {
        // Menyimpan waktuDibuat lama jika sedang mengedit
        const jurnalBaruList = [...jurnalList];
        jurnalBaruList[editIndex] = { ...jurnalBaru, waktuDibuat: jurnalLama.waktuDibuat };
        setJurnalList(jurnalBaruList);
      } else {
        alert("Edit hanya dapat dilakukan dalam waktu 24 jam setelah dibuat.");
      }
      setEditIndex(null);
      setEditData(null);
    } else {
      setJurnalList([...jurnalList, jurnalBaru]);
    }
  };  

  const hapusJurnal = (index) => {
    // Cek jika jurnal sudah diketahui, jangan izinkan penghapusan
    if (jurnalList[index].diketahui) {
      alert("Jurnal ini sudah diketahui dan tidak bisa dihapus.");
      return;  // Hentikan fungsi jika sudah diketahui
    }
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus jurnal ini?");
    if (isConfirmed) {
      const jurnalBaru = jurnalList.filter((_, i) => i !== index);
      setJurnalList(jurnalBaru);
    }
  };

const editJurnal = (index) => {
  // Cek jika jurnal sudah diketahui, jangan izinkan pengeditan
  if (jurnalList[index].diketahui) {
    alert("Jurnal ini sudah diketahui dan tidak bisa diedit.");
    return;  // Hentikan fungsi jika sudah diketahui
  }
  setEditIndex(index);
  setEditData(jurnalList[index]);
};


const tandaiDiketahui = (index) => {
  const jurnalBaruList = [...jurnalList];
  jurnalBaruList[index] = { ...jurnalBaruList[index], diketahui: true };  // Tandai jurnal sebagai diketahui
  setJurnalList(jurnalBaruList);
};

  const filterJurnal = jurnalList.filter((jurnal) => {
    return (
      (filterKelas === "" || jurnal.kelas === filterKelas) &&
      (filterBulan === "" || jurnal.tanggal.slice(5, 7) === filterBulan) &&
      (filterTahun === "" || jurnal.tanggal.slice(0, 4) === filterTahun) &&
      (filterGuru === "" || jurnal.guru === filterGuru) &&
      (filterSubjek === "" || jurnal.subjek === filterSubjek)
    );
  });

  const eksporKeExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filterJurnal);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jurnal Kelas");
    XLSX.writeFile(wb, "Jurnal_Kelas.xlsx");
  };

  // 🔽 Ambil nilai unik dari jurnal untuk dropdown filter
  const getUniqueValues = (key) => {
    return ["", ...new Set(jurnalList.map((j) => j[key]))]; // Tambahkan "" untuk opsi "Semua"
  };

  return (
    <div>
      <h1>📖 Jurnal Kelas</h1>
      <JurnalForm tambahJurnal={tambahJurnal} editData={editData} />

      <h2>Filter Jurnal</h2>
      <div>
        <label>Kelas: </label>
        <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)}>
          {getUniqueValues("kelas").map((kelas) => (
            <option key={kelas} value={kelas}>
              {kelas || "Semua"}
            </option>
          ))}
        </select>

        <label>Bulan: </label>
        <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)}>
          {getUniqueValues("tanggal").map((tgl) => {
            const bulan = tgl ? tgl.slice(5, 7) : "";
            return bulan && <option key={bulan} value={bulan}>{bulan}</option>;
          })}
          <option value="">Semua</option>
        </select>

        <label>Tahun: </label>
        <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)}>
          {getUniqueValues("tanggal").map((tgl) => {
            const tahun = tgl ? tgl.slice(0, 4) : "";
            return tahun && <option key={tahun} value={tahun}>{tahun}</option>;
          })}
          <option value="">Semua</option>
        </select>

        <label>Guru: </label>
        <select value={filterGuru} onChange={(e) => setFilterGuru(e.target.value)}>
          {getUniqueValues("guru").map((guru) => (
            <option key={guru} value={guru}>
              {guru || "Semua"}
            </option>
          ))}
        </select>

        <label>Subjek: </label>
        <select value={filterSubjek} onChange={(e) => setFilterSubjek(e.target.value)}>
          {getUniqueValues("subjek").map((subjek) => (
            <option key={subjek} value={subjek}>
              {subjek || "Semua"}
            </option>
          ))}
        </select>

        <button onClick={eksporKeExcel} style={{ marginLeft: "10px", background: "green", color: "white" }}>Ekspor ke Excel</button>
      </div>

      <h2>Daftar Jurnal</h2>
{filterJurnal.length === 0 ? (
  <p>Belum ada jurnal yang sesuai filter.</p>
) : (
  <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
    <thead>
      <tr>
        <th>Tanggal</th>
        <th>Kelas</th>
        <th>Guru</th>
        <th>Subjek</th>
        <th>Topik</th>
        <th>Kehadiran</th>
        <th>Keterangan</th>
        <th>Status</th>
        <th>Waktu Dibuat</th> {/* Menambahkan kolom Waktu Dibuat */}
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
  {filterJurnal.map((jurnal, index) => (
    <tr key={index}>
      <td>{jurnal.tanggal}</td>
      <td>{jurnal.kelas}</td>
      <td>{jurnal.guru}</td>
      <td>{jurnal.subjek}</td>
      <td>{jurnal.topik}</td>
      <td>{jurnal.kehadiran}</td>
      <td>{jurnal.keterangan}</td>
      <td style={{ color: jurnal.diketahui ? "green" : "red" }}>
        {jurnal.diketahui ? "✔ Sudah Diketahui Kepala Sekolah" : "❌ Belum Dicek"}
      </td>
      <td>{new Date(jurnal.waktuDibuat).toLocaleString()}</td>
      <td>
        {/* Cek apakah sudah diketahui */}
        {!jurnal.diketahui && (
          <button
            onClick={() => editJurnal(index)}
            style={{ marginRight: "5px", background: "blue", color: "white" }}
          >
            Edit
          </button>
        )}
        {!jurnal.diketahui && (
          <button
            onClick={() => hapusJurnal(index)}
            style={{ marginRight: "5px", background: "red", color: "white" }}
          >
            Hapus
          </button>
        )}
        {/* Tombol Tandai Diketahui hanya tampil jika jurnal belum dicek */}
        {!jurnal.diketahui && (
          <button
            onClick={() => tandaiDiketahui(index)}
            style={{ background: "orange", color: "white" }}
          >
            Tandai Diketahui
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
  </table>
)}
    </div>
  );
}

export default App;
