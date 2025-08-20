import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { CheckCircle, Trash2, User, Mail, MessageSquare, AlertTriangle, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export default function ReviewCardDashboard({ review, showActions = true, onActionComplete }) {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [messageExpanded, setMessageExpanded] = React.useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = React.useState(false);
  const [localReview, setLocalReview] = React.useState(review);
  const [processing, setProcessing] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, message: '', severity: 'success' });
  
  const messageRef = React.useRef(null);
  const containerRef = React.useRef(null);
  
  // Actualizar review local cuando cambie la prop
  React.useEffect(() => {
    setLocalReview(review);
  }, [review]);

  // Función para detectar si el texto se desborda
  const checkTextOverflow = React.useCallback(() => {
    if (messageRef.current && containerRef.current) {
      const messageElement = messageRef.current;
      const containerElement = containerRef.current;
      
      // Obtener las dimensiones del contenedor del mensaje
      const containerRect = containerElement.getBoundingClientRect();
      
      // Crear un elemento temporal para medir el texto completo
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.width = containerRect.width + 'px';
      tempElement.style.fontSize = getComputedStyle(messageElement).fontSize;
      tempElement.style.fontFamily = getComputedStyle(messageElement).fontFamily;
      tempElement.style.lineHeight = getComputedStyle(messageElement).lineHeight;
      tempElement.style.padding = getComputedStyle(messageElement).padding;
      tempElement.style.margin = getComputedStyle(messageElement).margin;
      tempElement.style.wordWrap = 'break-word';
      tempElement.style.overflowWrap = 'break-word';
      tempElement.style.whiteSpace = 'pre-wrap';
      tempElement.textContent = localReview.mensaje;
      
      document.body.appendChild(tempElement);
      
      const textHeight = tempElement.offsetHeight;
      const containerHeight = containerElement.offsetHeight;
      
      document.body.removeChild(tempElement);
      
      // Considerar un margen para el botón "Ver más"
      const availableHeight = containerHeight - 50;
      
      // Si el texto es más alto que el espacio disponible, mostrar el botón
      const needsExpansion = textHeight > availableHeight;
      setShouldShowExpandButton(needsExpansion);
      
      // Si el texto no necesita expansión, asegurar que no esté expandido
      if (!needsExpansion && messageExpanded) {
        setMessageExpanded(false);
      }
    }
  }, [localReview.mensaje, messageExpanded]);

  // Verificar overflow cuando el componente se monta
  React.useEffect(() => {
    const timer = setTimeout(checkTextOverflow, 100);
    return () => clearTimeout(timer);
  }, [checkTextOverflow]);

  // Verificar overflow cuando cambia el mensaje
  React.useEffect(() => {
    const timer = setTimeout(checkTextOverflow, 100);
    return () => clearTimeout(timer);
  }, [localReview.mensaje, checkTextOverflow]);

  const handleToggleStatus = async () => {
    const newStatus = !localReview.habilitada;
    setProcessing(true);
    
    try {
      const response = await axios.put(route('dashboard.reviews.toggle-status', localReview.id));
      
      // Actualizar el estado local
      const updatedReview = {
        ...localReview,
        habilitada: newStatus
      };
      setLocalReview(updatedReview);
      
      setToast({
        open: true,
        message: newStatus ? 'La reseña fue habilitada correctamente.' : 'La reseña fue deshabilitada correctamente.',
        severity: 'success'
      });
      
      // Notificar al componente padre con la review actualizada
      if (onActionComplete) onActionComplete(updatedReview, 'toggle');
      
    } catch (error) {
      setToast({
        open: true,
        message: `No se pudo ${newStatus ? 'habilitar' : 'deshabilitar'} la reseña.`,
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setProcessing(true);
    
    try {
      await axios.delete(route('dashboard.reviews.delete', localReview.id));
      
      setToast({
        open: true,
        message: 'La reseña fue eliminada correctamente.',
        severity: 'success'
      });
      setDeleteModalOpen(false);
      
      // Notificar al componente padre para que remueva la review de la lista
      if (onActionComplete) onActionComplete(localReview, 'delete');
      
    } catch (error) {
      setToast({
        open: true,
        message: 'No se pudo eliminar la reseña.',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusButton = () => {
    if (!showActions) return null;
    
    // Convertir el valor a booleano de manera más robusta
    const isEnabled = Boolean(localReview.habilitada);
    
    const buttonText = isEnabled ? 'Deshabilitar' : 'Aceptar';
    const buttonColor = isEnabled 
      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
      : 'bg-green-600 hover:bg-green-700 text-white';
    const icon = isEnabled ? <AlertTriangle className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />;
    
    return (
      <Button
        onClick={handleToggleStatus}
        disabled={processing}
        className={`flex-1 ${buttonColor}`}
        size="sm"
      >
        {icon}
        {buttonText}
      </Button>
    );
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 w-full flex flex-col overflow-hidden ${
        messageExpanded ? 'min-h-[380px]' : 'h-[380px]'
      }`}>
        {/* Nombre completo */}
        <div className="flex items-center mb-3 flex-shrink-0">
          <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {localReview.nombre} {localReview.apellido}
          </h3>
        </div>
        
        {/* Email */}
        <div className="flex items-center mb-4 flex-shrink-0">
          <Mail className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <p className="text-xs text-gray-600 break-all line-clamp-1">{localReview.email}</p>
        </div>
        
        {/* Taller */}
        <p className="text-xs text-gray-500 mb-3 flex-shrink-0">
          Taller: <span className="font-medium truncate">{localReview.taller}</span>
        </p>
        
        {/* Mensaje */}
        <div className="mb-4 flex-grow flex flex-col overflow-hidden" ref={containerRef}>
          <div className="flex items-start mb-2 flex-shrink-0">
            <MessageSquare className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-gray-700">Mensaje:</p>
          </div>
          <div className="flex-grow overflow-hidden">
            <p 
              ref={messageRef}
              className={`text-xs text-gray-600 leading-relaxed pl-6 break-words overflow-wrap-anywhere hyphens-auto ${
                !messageExpanded && shouldShowExpandButton ? 'line-clamp-4' : ''
              }`}
            >
              {localReview.mensaje}
            </p>
            {(shouldShowExpandButton || messageExpanded) && (
              <button
                onClick={() => setMessageExpanded(!messageExpanded)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium ml-6 mt-1 flex items-center"
              >
                {messageExpanded ? 'Ver menos' : 'Ver más'}
                <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-200 ${messageExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
        
        {/* Fecha */}
        <p className="text-xs text-gray-400 mb-4 flex-shrink-0">
          Enviada: {new Date(localReview.fecha_publicacion).toLocaleDateString('es-AR')}
        </p>
        
        {/* Estado */}
        <div className="mb-4 flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            Boolean(localReview.habilitada)
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {Boolean(localReview.habilitada) ? 'Habilitada' : 'Pendiente'}
          </span>
        </div>
        
        {/* Botones de acción */}
        {showActions && (
          <div className="flex gap-2 flex-shrink-0">
            {getStatusButton()}
            
            <Button
              onClick={handleDelete}
              disabled={processing}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar esta reseña? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={processing}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
} 