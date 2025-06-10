import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';

export default function EmailModal({ open, onClose, onSend, isLoading }) {
    const [emailData, setEmailData] = useState({
        title: '',
        content: '',
        includeReview: false
    });

    const handleChange = (field) => (event) => {
        setEmailData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleCheckboxChange = (event) => {
        setEmailData(prev => ({
            ...prev,
            includeReview: event.target.checked
        }));
    };

    const handleSend = () => {
        onSend(emailData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon />
                    Enviar Email a Participantes
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Título del Email"
                        fullWidth
                        value={emailData.title}
                        onChange={handleChange('title')}
                        required
                    />
                    <TextField
                        label="Contenido del Email"
                        fullWidth
                        multiline
                        rows={6}
                        value={emailData.content}
                        onChange={handleChange('content')}
                        required
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={emailData.includeReview}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Incluir sección de reseña"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSend} 
                    variant="contained" 
                    color="primary"
                    disabled={isLoading || !emailData.title || !emailData.content}
                >
                    {isLoading ? 'Enviando...' : 'Enviar Email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
} 