let method = "tambah";
let editid = null;

let formTambahBuku  = document.getElementById("formTambahBuku");
let inputJudul      = document.getElementById("inputJudul");
let inputPenulis    = document.getElementById("inputPenulis");
let inputTahun      = document.getElementById("inputTahun");
let inputSelesai    = document.getElementById("inputSelesai");

let infoRak = document.getElementById("infoRak");
let bukuBelumSelesai = document.getElementById("boxBelumSelesai");
let bukuSudahSelesai = document.getElementById("boxSudahSelesai");

const localName = "mybook";

const set = (dt = false) =>{
    let buku = dt ? dt : localStorage.getItem(localName);

    bukuBelumSelesai.innerHTML = "";
    bukuSudahSelesai.innerHTML = "";
    let bukuParse = JSON.parse(buku);
    for (let i in bukuParse){
        if (bukuParse[i].isComplete){
            bukuSudahSelesai.insertAdjacentHTML("beforeend",theme(bukuParse[i]));
        }else{
            bukuBelumSelesai.insertAdjacentHTML( "beforeend",theme(bukuParse[i]) );
        }
    }
}

window.addEventListener("load", function () {
    if (localStorage.getItem(localName) === null){
        localStorage.setItem(localName, JSON.stringify([]))
    }

    set();
})

formTambahBuku.addEventListener("submit", function (e) {
    e.preventDefault();

    let id = Date.now();
    let bukuBaru = {
        id: id,
        title: inputJudul.value,
        author: inputPenulis.value,
        year: inputTahun.value,
        isComplete: inputSelesai.checked,
    }

    let bukuLama = JSON.parse(localStorage.getItem(localName));
    if (method === "edit"){
        bukuBaru[id] = editid;
        let a = bukuLama.findIndex(b => b.id === editid);
        Object.assign(bukuLama[a], bukuBaru);
    }else{
        bukuLama.push(bukuBaru)
    }
    localStorage.setItem(localName, JSON.stringify(bukuLama));

    formTambahBuku.reset();
    set();

    method = "tambah";
    editid = null;
    infoRak.innerHTML = "Belum selesai dibaca";
})

function theme(buku) {
    let tooltipMove = !buku.isComplete ? "Sudah selesai dibaca" : "Belum Selesai dibaca";
    let a = buku.isComplete ? `<i class="ti ti-x"></i>` : `<i class="ti ti-check"></i>`;
    let b = buku.isComplete ? `onclick=aksi.not(${buku.id})` : `onclick=aksi.done(${buku.id})`;

    return `<div class="col-sm-6 col-6 mb-3">
        <div class="d-flex flex-column justify-content-center align-items-center border border-secondary p-2 rounded-2">
            <div class="fs-5 text-center">${buku.title}</div>
            <span class="small">( ${buku.year} )</span>
            <span>${buku.author}</span>
            <hr class="w-100">
            <div class="text-center">
                <button onclick="aksi.edit(${buku.id})" class="btn btn-warning btn-sm" title="Edit Buku"><i class="ti ti-edit"></i></button>
                <button class="btn btn-success btn-sm" data-bs-toggle="tooltip" ${b} title="${tooltipMove}">${a}</button>
                <button onclick="aksi.del(${buku.id})" class="btn btn-danger btn-sm" title="Hapus Buku"><i class="ti ti-trash"></i></button>
            </div>
        </div>
    </div>`;
}

const aksi = {
    del(i){
        let e = JSON.parse(localStorage.getItem(localName));
        let x = confirm("Yakin akan menghapus ?");
        if (x){
            let z = e.filter(b=>b.id !== i)
            this.set(z)
        }
    },
    edit(i){
        method = "edit";
        editid = i;

        let e = JSON.parse(localStorage.getItem(localName));
        let a = e.findIndex(b => b.id === i);
        inputJudul.value = e[a].title;
        inputPenulis.value = e[a].author;
        inputTahun.value = e[a].year;
        inputSelesai.checked = e[a].isComplete;

        infoRak.innerHTML = e[a].isComplete ? "Sudah selesai dibaca" : "Belum selesai dibaca"
    },
    done(i){
        let e = JSON.parse(localStorage.getItem(localName));
        let a = e.findIndex(b => b.id === i);
        e[a]["isComplete"] = true;
        this.set(e);
    },
    not(i){
        let e = JSON.parse(localStorage.getItem(localName));
        let a = e.findIndex(b => b.id === i);
        e[a]["isComplete"] = false;
        this.set(e);
    },
    set(obj){
        localStorage.setItem(localName, JSON.stringify(obj));
        set();
    }

}

function cari(){
    loading(bukuSudahSelesai);
    loading(bukuBelumSelesai);

    let a = document.getElementById("inputCari")
    let b = a.value;
    if (b === ""){
        setTimeout(()=>{
            set();
        }, 1000)
    }else{
        let q = JSON.parse(localStorage.getItem(localName));
        let w = q.filter(e => e.title.includes(b))
        let r = JSON.stringify(w);

        setTimeout(()=>{
            set(r);
        }, 1000)
    }

}

const loading = (elm) => {
    elm.innerHTML = `<div class="text-center"><span class="loader"></span></div>`;
}

const cr = document.getElementById("inputCari");
cr.addEventListener("keydown", function (e) {
    if(e.key === "Enter"){
        cari();
    }
})

inputSelesai.addEventListener("change", function (e) {
    infoRak.innerHTML = this.checked ? "Sudah selesai dibaca" : "Belum selesai dibaca"
})