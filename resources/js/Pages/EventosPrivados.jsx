import { useState } from "react";
import { Head } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Contacto() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    consulta: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/contacto", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast({
          title: "¡Mensaje enviado!",
          description: "Gracias por contactarte. Te responderemos pronto.",
          variant: "default"
        });
        setForm({ nombre: "", apellido: "", email: "", consulta: "" });
      } else {
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje. Intenta nuevamente.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-32 px-4 h-96 md:h-96 md:py-96">
      <Head title="Contacto" />
      <h1 className="text-6xl md:text-8xl font-bold mb-6 text-center ">PROXIMAMENTE</h1>
      
    </div>
  );
}
