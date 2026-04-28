// 1. API Anahtarını ve HTML elementlerini tanımlıyoruz
const API_KEY = '1640dff5'; 

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieContainer = document.getElementById('movieContainer');

// 2. Sayfa yüklendiğinde son aramayı hafızadan (localStorage) çekiyoruz
document.addEventListener('DOMContentLoaded', () => {
    const lastSearch = localStorage.getItem('lastMovieSearch');
    if (lastSearch) {
        searchInput.value = lastSearch;
        getMovie(lastSearch); // Eğer hafızada film varsa direkt onu aratıyoruz
    }
});

// 3. Butona tıklandığında aramayı tetikliyoruz
searchBtn.addEventListener('click', () => {
    const movieName = searchInput.value.trim();
    if (movieName) {
        getMovie(movieName);
    } else {
        // Hata yönetimi (Boş arama engelleme)
        movieContainer.innerHTML = '<p style="color: orange;">Lütfen bir film adı girin.</p>';
    }
});

// Kullanıcı deneyimi için Enter tuşu ile arama yapabilmeyi ekliyoruz
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 4. API'den film verilerini çeken asenkron (async/await) fonksiyonumuz
async function getMovie(movieName) {
    // İsteri karşılıyoruz: Aranacak filmi hafızaya kaydediyoruz (Sayfa yenilendiğinde kaybolmaz)
    localStorage.setItem('lastMovieSearch', movieName);
    
    // Veri gelene kadar ekranda bir yükleniyor mesajı gösterelim
    movieContainer.innerHTML = '<p>Film aranıyor, lütfen bekleyin...</p>';

    try {
        // OMDB API'ye istek atıyoruz (t= parametresi tek ve detaylı sonuç getirir)
        const response = await fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${API_KEY}`);
        const data = await response.json();

        // İsteri karşılıyoruz: Eğer API "Film bulunamadı" derse (Response: "False") hata mesajı basıyoruz
        if (data.Response === "False") {
            movieContainer.innerHTML = `<p style="color: red;">Hata: ${data.Error} (Film bulunamadı)</p>`;
            return; // Fonksiyonu burada durdur
        }

        // 5. İsteri karşılıyoruz: Veriler başarıyla geldiyse istenen detayları ekrana (HTML içine) yazdırıyoruz
        movieContainer.innerHTML = `
            <div class="movie-card">
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=Afiş+Yok'}" alt="${data.Title} Afişi" style="max-width: 250px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Tür:</strong> ${data.Genre}</p>
                <p><strong>Yönetmen:</strong> ${data.Director}</p>
                <p><strong>IMDB Puanı:</strong> ${data.imdbRating}</p>
            </div>
        `;
    } catch (error) {
        // İsteri karşılıyoruz: İnternet kopması gibi beklenmeyen hatalar için
        movieContainer.innerHTML = `<p style="color: red;">Bir bağlantı hatası oluştu. Lütfen internetinizi kontrol edip tekrar deneyin.</p>`;
        console.error("Hata detayı:", error);
    }
}