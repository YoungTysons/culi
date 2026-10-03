import { money, amount } from "../../utils/format";

export default function CartDrawer({
  isOpen,
  cart,
  onClose,
  onChangeQuantity,
  onOpenCheckout,
}) {
  if (!isOpen) return null;

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.unitPrice || amount(item.price)) * item.quantity,
    0,
  );

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(event) => event.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ×
        </button>
        <h2>
          Giỏ hàng <span>{count} món</span>
        </h2>
        {cart.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px 0", color: "var(--muted, #888)" }}>
            Giỏ hàng đang trống
          </p>
        ) : (
          cart.map((item) => (
            <div className="cart-item" key={item.cartItemId || item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                {(item.size || (item.toppings && item.toppings.length > 0)) && (
                  <small style={{ fontSize: "12px", color: "var(--muted, #888)", display: "block", marginTop: "2px" }}>
                    {item.size || "Size M"}
                    {item.toppings && item.toppings.length > 0 && ` • +${item.toppings.map((t) => t.name || t.label).join(", ")}`}
                  </small>
                )}
                <span>{money(item.unitPrice || amount(item.price))}</span>
                <div className="quantity">
                  <button onClick={() => onChangeQuantity(item.cartItemId || item.id, -1)}>
                    −
                  </button>
                  {item.quantity}
                  <button onClick={() => onChangeQuantity(item.cartItemId || item.id, 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <div className="drawer-total">
          <span>Tạm tính</span>
          <b>{money(subtotal)}</b>
          <span>Phí giao hàng</span>
          <b className="free">Miễn phí</b>
          <hr />
          <strong>Tổng cộng</strong>
          <strong>{money(subtotal)}</strong>
        </div>
        <button
          className="checkout"
          onClick={() => {
            onClose();          // Đóng thanh drawer
            onOpenCheckout();   // Kích hoạt mở modal checkout
          }}
        >
          Tiến hành thanh toán →
        </button>
      </aside>
    </div >
  );
}
