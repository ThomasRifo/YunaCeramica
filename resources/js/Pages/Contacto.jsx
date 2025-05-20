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
    <div className="max-w-xl mx-auto py-32 px-4">
      <Head title="Contacto" />
      <h1 className="text-4xl font-bold mb-6 text-center">Contacto</h1>
      <p className="text-center text-lg mb-10 text-gray-700">¿Tenés dudas, consultas o querés comunicarte? Completá el formulario y te responderemos a la brevedad.</p>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 rounded-xl shadow p-8">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="h-12 mt-1" />
        </div>
        <div>
          <Label htmlFor="apellido">Apellido</Label>
          <Input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} required className="h-12 mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="h-12 mt-1" />
        </div>
        <div>
          <Label htmlFor="consulta">Consulta</Label>
          <Textarea id="consulta" name="consulta" value={form.consulta} onChange={handleChange} required className="mt-1" rows={5} />
        </div>
        <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
          {loading ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </form>
    </div>
  );
}
