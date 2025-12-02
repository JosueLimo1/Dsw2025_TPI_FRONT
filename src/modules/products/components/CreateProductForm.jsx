import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

// Importamos componente Card para el contenedor
import Card from '../../shared/components/Card';

// Servicios
import { createProduct } from '../services/create';
import { getProductById, updateProduct } from '../services/update';

function CreateProductForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      isActive: true
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Carga de datos iniciales para edición
  useEffect(() => {
    if (isEditMode) {
      const loadProduct = async () => {
        try {
          const product = await getProductById(id);
          // Rellenamos el formulario (Backend -> Inputs)
          setValue('sku', product.sku);
          setValue('cui', product.internalCode);
          setValue('name', product.name);
          setValue('description', product.description);
          setValue('price', product.currentUnitPrice);
          setValue('stock', product.stockQuantity);
          setValue('isActive', product.isActive);
        } catch (error) {
          console.error("Error cargando:", error);
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
      
      // PREPARACIÓN DE DATOS (Inputs -> Backend)
      // Aquí convertimos los nombres y tipos de datos
      const payload = {
        sku: formData.sku,
        internalCode: formData.cui, // Mapeo: cui -> internalCode
        name: formData.name,
        description: formData.description,
        currentUnitPrice: Number(formData.price), // Conversión a Número
        stockQuantity: Number(formData.stock),    // Conversión a Número
        isActive: formData.isActive
      };

      console.log("Enviando:", payload); // Para verificar en consola

      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload); // Ahora create.js recibe este objeto limpio
      }

      navigate('/admin/products');

    } catch (error) {
      console.error(error);
      const responseData = error.response?.data;
      let errorDisplay = 'Error al procesar la solicitud.';

      // Lógica para mostrar el error exacto que manda el backend
      if (responseData) {
          if (responseData.errors) {
              const messages = Object.values(responseData.errors).flat();
              errorDisplay = messages.join(' | ');
          } 
          else if (typeof responseData === 'string') {
              errorDisplay = responseData;
          }
          else if (responseData.message || responseData.detail) {
              errorDisplay = responseData.message || responseData.detail;
          }
      }
      setErrorBackendMessage(errorDisplay);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estilos CSS para asegurar que los inputs se vean bien (Fondo gris y bordes)
  const labelStyle = "block mb-2 text-sm font-medium text-gray-900";
  const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5";
  const errorStyle = "mt-1 text-xs text-red-600 font-medium";

  return (
    <Card>
      {/* Título */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Producto' : 'Registrar Nuevo Producto'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
            Complete los campos a continuación para {isEditMode ? 'modificar' : 'dar de alta'} un ítem.
        </p>
      </div>

      <form className='flex flex-col gap-6' onSubmit={handleSubmit(onValid)}>
        
        {/* Fila 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className={labelStyle}>SKU (Identificador)</label>
                <input
                    type="text"
                    className={inputStyle}
                    placeholder="Ej: PROD-123"
                    {...register('sku', { required: 'El SKU es obligatorio' })}
                />
                {errors.sku && <p className={errorStyle}>{errors.sku.message}</p>}
            </div>
            
            <div>
                <label className={labelStyle}>Código Interno (CUI)</label>
                <input
                    type="text"
                    className={inputStyle}
                    placeholder="Ej: INT-001"
                    {...register('cui', { required: 'El Código es obligatorio' })}
                />
                {errors.cui && <p className={errorStyle}>{errors.cui.message}</p>}
            </div>
        </div>

        {/* Fila 2 */}
        <div>
            <label className={labelStyle}>Nombre del Producto</label>
            <input
                type="text"
                className={inputStyle}
                placeholder="Ej: Smartphone Samsung"
                {...register('name', { required: 'El nombre es obligatorio' })}
            />
            {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
        </div>
        
        <div>
            <label className={labelStyle}>Descripción</label>
            <textarea
                rows="3"
                className={inputStyle}
                placeholder="Ingrese detalles..."
                {...register('description')}
            />
        </div>

        {/* Fila 3: Precios y Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
                <label className={labelStyle}>Precio Unitario ($)</label>
                <input
                    type="number"
                    step="0.01"
                    className={inputStyle}
                    {...register('price', { required: 'Requerido', min: 0 })}
                />
                {errors.price && <p className={errorStyle}>Precio inválido</p>}
            </div>
            
            <div>
                <label className={labelStyle}>Stock Disponible</label>
                <input
                    type="number"
                    className={inputStyle}
                    {...register('stock', { required: 'Requerido', min: 0 })}
                />
                {errors.stock && <p className={errorStyle}>Stock inválido</p>}
            </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100 transition cursor-pointer bg-white">
            <input 
                type="checkbox" 
                id="isActive"
                {...register("isActive")} 
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-gray-700 font-medium cursor-pointer select-none">
                Producto Habilitado para la venta
            </label>
        </div>

        {/* Error Backend */}
        {errorBackendMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium text-center">
                 {errorBackendMessage}
            </div>
        )}

        {/* Botones */}
        <div className='flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200'>
          <button 
            type='button' 
            className='py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 transition'
            onClick={() => navigate('/admin/products')}
          >
            Cancelar
          </button>
          
          <button 
            type='submit' 
            disabled={isSubmitting}
            className={`text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 transition shadow-md ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Datos'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateProductForm;