// components/MercadoPagoButton.jsx
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function MercadoPagoButton({ title, price, quantity = 1, email }) {
  const [loading, setLoading] = useState(false);

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
        alert("Error al generar preferencia");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al intentar iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Redirigiendo..." : "Pagar con MercadoPago"}
    </Button>
  );
}
