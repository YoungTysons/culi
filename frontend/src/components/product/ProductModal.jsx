import { money, amount } from "../../utils/format";

function Choice({ title, children }) {
  return (
    <div className="choice">
      <b>{title}</b>
      {children}
    </div>
  );
}
const TOPPING_OPTIONS = [
  { id: 1, name: "Trân châu đen mật mía", price: 5000 },
  { id: 2, name: "Trân châu hoàng kim dai giòn", price: 7000 },
  { id: 3, name: "Kem Cheese dẻo", price: 10000 },
];

export default function ProductModal({
  product,
  custom,
  setCustom,
  onClose,
  onAddToCart,
}) {
  if (!product) return null;

  const customTotal =
    amount(product.price) +
    custom.size +
    custom.toppings.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ×
        </button>
        <div className="modal-product">
          <img src={product.image} alt={product.name} />
          <div>
            <span className="tag">BEST SELLER</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <strong>{money(customTotal)}</strong>
          </div>
        </div>
        <Choice title="1. Chọn kích cỡ">
          <div>
            {[
              ["Size S", 0],
              ["Size M", 6000],
              ["Size L", 12000],
            ].map(([label, value]) => (
              <button
                className={custom.size === value ? "active" : ""}
                onClick={() => setCustom({ ...custom, size: value })}
                key={label}
              >
                {label}
                <small>{value ? `+${money(value)}` : "Tiêu chuẩn"}</small>
              </button>
            ))}
          </div>
        </Choice>
        <Choice title="2. Độ ngọt">
          <div className="compact">
            {["0%", "30%", "50%", "70%", "100%"].map((value) => (
              <button
                className={custom.sugar === value ? "active" : ""}
                onClick={() => setCustom({ ...custom, sugar: value })}
                key={value}
              >
                {value}
              </button>
            ))}
          </div>
        </Choice>
        <Choice title="3. Lượng đá">
          <div className="compact">
            {["Không đá", "Ít đá", "Chuẩn", "Nhiều đá"].map((value) => (
              <button
                className={custom.ice === value ? "active" : ""}
                onClick={() => setCustom({ ...custom, ice: value })}
                key={value}
              >
                {value}
              </button>
            ))}
          </div>
        </Choice>
        <Choice title="4. Thêm topping">
          <div className="toppings">
            {TOPPING_OPTIONS.map((tp) => {
              const isChecked = custom.toppings?.some(
                (item) => item.id === tp.id || item.label === tp.name || item.name === tp.name
              );
              return (
                <label key={tp.id}>
                  <input
                    type="checkbox"
                    checked={!!isChecked}
                    onChange={(event) =>
                      setCustom({
                        ...custom,
                        toppings: event.target.checked
                          ? [...custom.toppings.filter((it) => it.id !== tp.id && it.name !== tp.name && it.label !== tp.name), tp]
                          : custom.toppings.filter(
                              (item) => item.id !== tp.id && item.name !== tp.name && item.label !== tp.name
                            ),
                      })
                    }
                  />
                  {tp.name}
                  <strong>+{money(tp.price)}</strong>
                </label>
              );
            })}
          </div>
        </Choice>
        <button
          className="add-modal"
          onClick={() => {
            onAddToCart(product, custom);
            onClose();
          }}
        >
          Thêm vào giỏ · {money(customTotal)}
        </button>
      </div>
    </div>
  );
}
