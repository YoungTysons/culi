export default function StorySection() {
  return (
    <section className="story-section">
      <div className="story-images">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=85"
          alt="Pha cà phê thủ công"
        />
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=85"
          alt="Không gian quán"
        />
      </div>
      <div className="story-copy">
        <small>✓ TRIẾT LÝ PHA CHẾ THỦ CÔNG</small>
        <h2>Tôn vinh hạt ngọc đất mẹ và nghệ thuật thưởng trà đương đại</h2>
        <p>
          Tại Velvet & Brew, chúng tôi không phục vụ món đồ uống đóng sẵn.
          Từng giọt cà phê được chắt lọc qua phin mộc hoặc máy nén áp suất
          chuẩn Ý, từng búp trà Oolong được ủ nở ở nhiệt độ 88°C để giữ trọn
          tầng hương thanh khiết nhất.
        </p>
        <div className="coupon">
          <span>🎁</span>
          <div>
            <strong>MUA 2 TẶNG 1 HÔM NAY</strong>
            <small>Áp dụng cho dòng Cà phê phin & Trà Oolong</small>
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText("VELVETNEW")}
          >
            Lấy mã: VELVETNEW
          </button>
        </div>
      </div>
    </section>
  );
}
