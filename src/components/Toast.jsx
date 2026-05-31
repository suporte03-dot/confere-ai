import { useShop } from '../context/ShopContext'

function Toast() {
  const { toastMessage, setToastMessage } = useShop()
  if (!toastMessage) return null

  return (
    <div className="toast" role="status">
      <div className="toast__inner">
        <p>{toastMessage}</p>
        <button type="button" onClick={() => setToastMessage(null)} aria-label="Fechar">×</button>
      </div>
    </div>
  )
}

export default Toast
