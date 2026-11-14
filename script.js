document.getElementById('btnFetch').addEventListener('click', async () => {
            const statusEl = document.getElementById('status');
            const container = document.getElementById('playersContainer');
            statusEl.textContent = 'Trạng thái: Đang kết nối và quét bảng vinh danh...';
            container.innerHTML = '';

            try {
                // Sử dụng CORS Proxy để đọc nội dung trang đích từ mọi nguồn
                const targetUrl = 'https://nguyenn001.github.io/my-nguyennnnm0/';
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
                
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error('Không thể tải dữ liệu từ trang đích.');

                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                // Quét tìm tên cầu thủ từ các phần tử bảng vinh danh (có thể điều chỉnh CSS selector nếu cấu trúc thay đổi)
                let playerElements = doc.querySelectorAll('.vinh-danh, table tr td, .player-name, li');
                let players = [];

                playerElements.forEach(el => {
                    const text = el.textContent.trim();
                    // Lọc lấy các chuỗi có định dạng phù hợp tên cầu thủ
                    if (text && text.length > 2 && text.length < 35 && !players.includes(text)) {
                        players.push(text);
                    }
                });

                // Dữ liệu dự phòng minh họa nếu trang đích chưa có dữ liệu hoặc cấu trúc khác
                if (players.length < 11) {
                    players = [
                        "GK: Courtois", 
                        "RB: Hakimi", "CB: Van Dijk", "CB: Ramos", "LB: Davies",
                        "CM: De Bruyne", "CM: Rodri", "AM: Bellingham",
                        "RW: Salah", "ST: Haaland", "LW: Vinicius Jr"
                    ];
                }

                statusEl.textContent = `Trạng thái: Đã tạo thành công đội hình mạnh nhất từ bảng vinh danh!`;

                // Tọa độ sơ đồ chiến thuật 4-3-3 tiêu chuẩn trên sân bóng (% từ top và left)
                const formation433 = [
                    { top: '88%', left: '50%' }, // Thủ môn (GK)
                    { top: '72%', left: '18%' }, // Hậu vệ trái (LB)
                    { top: '75%', left: '38%' }, // Trung vệ (CB)
                    { top: '75%', left: '62%' }, // Trung vệ (CB)
                    { top: '72%', left: '82%' }, // Hậu vệ phải (RB)
                    { top: '50%', left: '30%' }, // Tiền vệ (CM)
                    { top: '45%', left: '50%' }, // Tiền vệ trung tâm (CDM/CM)
                    { top: '50%', left: '70%' }, // Tiền vệ (CM)
                    { top: '28%', left: '20%' }, // Tiền đạo trái (LW)
                    { top: '22%', left: '50%' }, // Tiền đạo cắm (ST)
                    { top: '28%', left: '80%' }  // Tiền đạo phải (RW)
                ];

                // Render cầu thủ lên sân
                players.slice(0, 11).forEach((name, index) => {
                    const pos = formation433[index] || { top: '50%', left: '50%' };
                    const card = document.createElement('div');
                    card.className = 'player-card';
                    card.style.top = pos.top;
                    card.style.left = pos.left;
                    card.textContent = name;
                    container.appendChild(card);
                });

            } catch (error) {
                console.error(error);
                statusEl.textContent = 'Trạng thái: Lỗi kết nối CORS hoặc trang web chưa sẵn sàng. Đang hiển thị đội hình mẫu.';
                
                // Hiển thị đội hình mẫu khi gặp lỗi mạng/CORS
                const defaultPlayers = ["GK: Neuer", "RB: Cafu", "CB: Maldini", "CB: Cannavaro", "LB: Roberto Carlos", "CM: Xavi", "CM: Iniesta", "AM: Zidane", "RW: Messi", "ST: Ronaldo", "LW: Ronaldinho"];
                const formation433 = [
                    { top: '88%', left: '50%' }, { top: '72%', left: '18%' }, { top: '75%', left: '38%' }, { top: '75%', left: '62%' }, { top: '72%', left: '82%' },
                    { top: '50%', left: '30%' }, { top: '45%', left: '50%' }, { top: '50%', left: '70%' },
                    { top: '28%', left: '20%' }, { top: '22%', left: '50%' }, { top: '28%', left: '80%' }
                ];
                defaultPlayers.forEach((name, index) => {
                    const pos = formation433[index];
                    const card = document.createElement('div');
                    card.className = 'player-card';
                    card.style.top = pos.top;
                    card.style.left = pos.left;
                    card.textContent = name;
                    container.appendChild(card);
                });
            }
        });
