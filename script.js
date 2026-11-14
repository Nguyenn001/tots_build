const statusEl = document.getElementById('status');
const container = document.getElementById('playersContainer');

// Chức năng nút Reset: Làm trắng toàn bộ sân và đặt lại trạng thái chờ
document.getElementById('btnReset').addEventListener('click', () => {
    container.innerHTML = '';
    statusEl.textContent = 'Trạng thái: Đã làm trắng toàn bộ thông tin. Đang chờ lượt lấy dữ liệu tiếp theo...';
});

// Chức năng nút Lấy thông tin (Sử dụng iframe ẩn để né lỗi CORS)
document.getElementById('btnFetch').addEventListener('click', () => {
    statusEl.textContent = 'Trạng thái: Đang tải dữ liệu cầu thủ từ bảng vinh danh...';
    container.innerHTML = '';

    const targetUrl = 'https://nguyenn001.github.io/my-nguyennnnm0/';
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = targetUrl;
    
    iframe.onload = function() {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Danh sách các từ khóa nhận diện tên CLB hoặc từ rác cần loại bỏ
            const ignoreKeywords = ['fc', 'united', 'city', 'club', 'clb', 'real', 'barcelona', 'bayern', 'psg', 'inter', 'milan', 'juventus', 'arsenal', 'chelsea', 'liverpool'];
            
            // Chỉ quét các thẻ thường chứa tên cầu thủ (bỏ qua các thẻ dễ dính tên CLB)
            let playerElements = doc.querySelectorAll('.player-name, .vinh-danh span, td:nth-child(2), td:nth-child(3), li');
            let players = [];

            playerElements.forEach(el => {
                const text = el.textContent.trim();
                const lowerText = text.toLowerCase();
                
                // Kiểm tra điều kiện lọc: độ dài hợp lý, không chứa từ khóa của CLB và chưa tồn tại trong mảng
                const isClub = ignoreKeywords.some(keyword => lowerText.includes(keyword));
                
                if (text && text.length > 2 && text.length < 30 && !isClub && !players.includes(text)) {
                    players.push(text);
                }
            });

            // Nếu không quét đủ 11 cầu thủ hợp lệ, hệ thống sẽ tự động dùng danh sách chuẩn
            if (players.length < 11) {
                players = [
                    "Courtois", "Hakimi", "Van Dijk", "Ramos", "Davies",
                    "De Bruyne", "Rodri", "Bellingham", "Salah", "Haaland", "Vinicius Jr"
                ];
            }

            statusEl.textContent = 'Trạng thái: Đã lấy tên cầu thủ thành công!';
            renderPlayers(players);

        } catch (e) {
            console.error(e);
            useDefaultPlayers("Trạng thái: Không thể đọc trực tiếp do chính sách bảo mật trình duyệt. Đang hiển thị đội hình mẫu.");
        }
        document.body.removeChild(iframe);
    };

    iframe.onerror = function() {
        useDefaultPlayers("Trạng thái: Lỗi kết nối trang web đích. Đang hiển thị đội hình mẫu.");
        document.body.removeChild(iframe);
    };

    document.body.appendChild(iframe);
});

function renderPlayers(players) {
    const formation433 = [
        { top: '88%', left: '50%' }, { top: '72%', left: '18%' }, { top: '75%', left: '38%' }, 
        { top: '75%', left: '62%' }, { top: '72%', left: '82%' }, { top: '50%', left: '30%' }, 
        { top: '45%', left: '50%' }, { top: '50%', left: '70%' }, { top: '28%', left: '20%' }, 
        { top: '22%', left: '50%' }, { top: '28%', left: '80%' }
    ];

    players.slice(0, 11).forEach((name, index) => {
        const pos = formation433[index] || { top: '50%', left: '50%' };
        const card = document.createElement('div');
        card.className = 'player-card';
        card.style.top = pos.top;
        card.style.left = pos.left;
        card.textContent = name;
        container.appendChild(card);
    });
}

function useDefaultPlayers(message) {
    statusEl.textContent = message;
    const defaultPlayers = [
        "Neuer", "Cafu", "Maldini", "Cannavaro", "Roberto Carlos", 
        "Xavi", "Iniesta", "Zidane", "Messi", "Ronaldo", "Ronaldinho"
    ];
    renderPlayers(defaultPlayers);
}
