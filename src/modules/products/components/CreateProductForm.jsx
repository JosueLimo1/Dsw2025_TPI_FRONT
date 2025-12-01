import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '', // Esto irá a internalCode
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorBackendMessage('');
      
      await createProduct(formData);

      // Si todo sale bien, volvemos a la lista
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      // Manejo de errores genérico por si no tienes el helper 'frontendErrorMessage'
      const msg = error.response?.data?.message || error.response?.data || 'Error al crear el producto.';
      setErrorBackendMessage(typeof msg === 'string' ? msg : 'Error desconocido en el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Producto</h2>
      </div>

      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit(onValid)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label='SKU'
              error={errors.sku?.message}
              {...register('sku', { required: 'SKU es requerido' })}
            />
            <Input
              label='Código Único (CUI)'
              error={errors.cui?.message}
              {...register('cui', { required: 'Código Único es requerido' })}
            />
        </div>

        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', { required: 'Nombre es requerido' })}
        />
        
        <Input
          label='Descripción'
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label='Precio ($)'
              error={errors.price?.message}
              type='number'
              {...register('price', {
                required: 'Requerido',
                min: { value: 0, message: 'No puede ser negativo' },
              })}
            />
            <Input
              label='Stock'
              error={errors.stock?.message}
              type='number'
              {...register('stock', {
                required: 'Requerido',
                min: { value: 0, message: 'No puede ser negativo' },
              })}
            />
        </div>

        {errorBackendMessage && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-center font-bold">
                {errorBackendMessage}
            </div>
        )}

        <div className='flex justify-end gap-3 mt-4'>
          <Button 
            type='button' 
            className='bg-gray-400 hover:bg-gray-500'
            onClick={() => navigate('/admin/products')}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateProductForm;