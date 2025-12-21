// components/MercadoPagoButton.jsx
import { useState } from "react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import Modal from "@/Components/Modal";

export default function MercadoPagoButton({ title, price, quantity = 1, email }) {
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState({ isOpen: false, message: '' });

  const handlePay = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post("/pagar-taller", {
        title,
        price,
        quantity,
        email,
      });

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setModalError({ isOpen: true, message: "Error al generar preferencia" });
      }
    } catch (err) {
      console.error(err);
      setModalError({ isOpen: true, message: "Ocurrió un error al intentar iniciar el pago." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handlePay} disabled={loading}>
        {loading ? "Redirigiendo..." : "Pagar con MercadoPago"}
      </Button>

      <Modal
        isOpen={modalError.isOpen}
        onClose={() => setModalError({ isOpen: false, message: '' })}
        title="Error"
        message={modalError.message}
        type="error"
      />
    </>
  );
}
