<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Acá podrías poner lógica si quisieras chequear permisos
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:32'],
            'apellido' => ['required', 'string', 'max:32'],
            'email' => ['required', 'email', 'max:64', 'unique:users,email,' . $this->user()->id],
            'calle' => ['nullable', 'string', 'max:32'],
            'numero' => ['nullable', 'string', 'max:10'],
            'ciudad' => ['nullable', 'string', 'max:32'],
            'provincia' => ['nullable', 'string', 'max:32'],
            'codigo_postal' => ['nullable', 'string', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no puede tener más de 32 caracteres.',

            'apellido.required' => 'El apellido es obligatorio.',
            'apellido.max' => 'El apellido no puede tener más de 32 caracteres.',

            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ser una dirección de correo válida.',
            'email.max' => 'El correo no puede tener más de 64 caracteres.',
            'email.unique' => 'Este correo ya está en uso.',

            'calle.max' => 'La calle no puede tener más de 32 caracteres.',
            'numero.max' => 'El número no puede tener más de 10 caracteres.',
            'ciudad.max' => 'La ciudad no puede tener más de 32 caracteres.',
            'provincia.max' => 'La provincia no puede tener más de 32 caracteres.',
            'codigo_postal.max' => 'El código postal no puede tener más de 10 caracteres.',
        ];
    }
}