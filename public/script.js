const API_KEY = 'kuncirahasia123'; 

async function analyze() {
    const code = document.getElementById('code').value.toUpperCase();
    if(!code) return alert('Masukkan Kode!');

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');

    try {
        const res = await fetch(`/api/stocks/${code}/analysis`, {
            headers: { 'x-api-key': API_KEY }
        });
        const json = await res.json();

        if(json.status === 'success') {
            const s = json.data.stock_data;
            document.getElementById('resCode').innerText = s.code;
            document.getElementById('resName').innerText = s.name;
            document.getElementById('resSector').innerText = s.sector;
            document.getElementById('resPrice').innerText = 'Rp ' + s.last_price.toLocaleString();
            document.getElementById('resCap').innerText = (s.market_cap / 1e12).toFixed(2) + ' T';
            document.getElementById('resAI').innerText = json.data.ai_recommendation;
            
            document.getElementById('result').classList.remove('hidden');
        } else {
            alert('Gagal: ' + json.message);
        }
    } catch(e) {
        alert('Error koneksi!');
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}