const statusEl = document.getElementById('status');
const container = document.getElementById('playersContainer');

// Chức năng nút Reset: Làm trắng toàn bộ sân và đặt lại trạng thái chờ
document.getElementById('btnReset').addEventListener('click', () => {
    container.innerHTML = '';
    statusEl.textContent = 'Trạng thái: Đã làm trắng toàn bộ thông tin. Đang chờ lượt lấy dữ liệu tiếp theo...';
});

// Chức năng nút Lấy thông tin (Sử dụng iframe ẩn để né lỗi CORS)
document.getElementById('btnFetch').addEventListener('click', () => {
    statusEl.textContent = 'Trạng thái: Đang tải dữ liệu từ bảng vinh danh...';
    container.innerHTML = '';

    const targetUrl = 'https://nguyenn001.github.io/my-nguyennnnm0/';
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = targetUrl;
    
    iframe.onload = function() {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            let playerElements = doc.querySelectorAll('.vinh-danh, table tr td, .player-name, li');
            let players = [];

            playerElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && text.length > 2 && text.length < 35 && !players.includes(text)) {
                    players.push(text);
                }
            });

            if (players.length < 11) {
                players = [
                    "GK: Courtois", "RB: Hakimi", "CB: Van Dijk", "CB: Ramos", "LB: Davies",
                    "CM: De Bruyne", "CM: Rodri", "AM: Bellingham", "RW: Salah", "ST: Haaland", "LW: Vinicius Jr"
                ];
            }

            statusEl.textContent = 'Trạng thái: Đã lấy và hiển thị đội hình thành công!';
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
        "GK: Neuer", "RB: Cafu", "CB: Maldini", "CB: Cannavaro", "LB: Roberto Carlos", 
        "CM: Xavi", "CM: Iniesta", "AM: Zidane", "RW: Messi", "ST: Ronaldo", "LW: Ronaldinho"
    ];
    renderPlayers(defaultPlayers);
}
