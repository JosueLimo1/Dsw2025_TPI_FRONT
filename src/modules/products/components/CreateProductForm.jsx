import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'; // Importamos useParams
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
// Importamos los servicios de edición
import { getProductById, updateProduct } from '../services/update';

function CreateProductForm() {
  const { id } = useParams(); // Capturamos el ID de la URL
  const isEditMode = !!id; // Si hay ID, estamos editando

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue, // Necesario para rellenar los campos
    reset
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      isActive: true // Por defecto activo al crear
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // EFECTO: Si es modo edición, cargamos los datos
  useEffect(() => {
    if (isEditMode) {
      const loadProduct = async () => {
        try {
          const product = await getProductById(id);
          // Rellenamos el formulario (Mapeo de nombres Backend -> Formulario)
          setValue('sku', product.sku);
          setValue('cui', product.internalCode); 
          setValue('name', product.name);
          setValue('description', product.description);
          setValue('price', product.currentUnitPrice);
          setValue('stock', product.stockQuantity);
          setValue('isActive', product.isActive); // Carga si está activo o no
        } catch (error) {
          console.error("Error cargando producto:", error);
          alert("Error al cargar el producto. Puede que no exista.");
          navigate('/admin/products');
        }
      };
      loadProduct();
    }
  }, [id, isEditMode, setValue, navigate]);

  const onValid = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorBackendMessage('');
      
      const payload = {
        sku: formData.sku,
        internalCode: formData.cui,
        name: formData.name,
        description: formData.description,
        currentUnitPrice: Number(formData.price),
        stockQuantity: Number(formData.stock),
        isActive: formData.isActive // Enviamos el estado del checkbox
      };

      if (isEditMode) {
        // ACTUALIZAR
        await updateProduct(id, payload);
      } else {
        // CREAR (Forzamos activo al crear, o usamos el del form)
        await createProduct(payload);
      }

      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data || 'Error en el servidor.';
      setErrorBackendMessage(typeof msg === 'string' ? msg : 'Error desconocido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h2>
        {isEditMode && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Editando
            </span>
        )}
      </div>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onValid)}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label='SKU'
              error={errors.sku?.message}
              {...register('sku', { required: 'SKU es requerido' })}
            />
            <Input
              label='Código Único (CUI)'
              error={errors.cui?.message}
              {...register('cui', { required: 'Requerido' })}
            />
        </div>

        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', { required: 'Requerido' })}
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
              {...register('price', { required: 'Requerido', min: 0 })}
            />
            <Input
              label='Stock'
              error={errors.stock?.message}
              type='number'
              {...register('stock', { required: 'Requerido', min: 0 })}
            />
        </div>

        {/* CHECKBOX PARA ACTIVAR/DESACTIVAR (Requerimiento Soft Delete) */}
        <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
            <input 
                type="checkbox" 
                id="isActive"
                {...register("isActive")} 
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                Producto Habilitado (Visible para ventas)
            </label>
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
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateProductForm;