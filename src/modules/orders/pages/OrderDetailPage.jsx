import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import { getOrderById, updateOrderStatus } from '../services/listServices';

// Etiquetas de estado para mostrar en pantalla
const STATUS_LABELS = {
  1: 'Pendiente',
  2: 'Procesando',
  3: 'Enviado',
  4: 'Entregado',
  5: 'Cancelado'
};

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar la orden
  const fetchOrder = async () => {
    setLoading(true);
    const { data } = await getOrderById(id);
    if (data) setOrder(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Función para cambiar el estado (Botones de acción)
  const handleStatusChange = async (newStatus) => {
    const statusName = STATUS_LABELS[newStatus];
    if (window.confirm(`¿Confirmar cambio de estado a "${statusName}"?`)) {
      await updateOrderStatus(id, newStatus);
      fetchOrder(); // Recargamos para ver el cambio reflejado
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando detalle...</div>;
  if (!order) return <div className="p-10 text-center text-red-600">No se encontró la orden.</div>;

  const shortId = order.id.substring(0, 8).toUpperCase();

  return (
    <Card>
      {/* CABECERA: Título y Botón Volver */}
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Orden #{shortId}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Realizada el {new Date(order.date).toLocaleString()}
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition"
        >
          Volver al listado
        </button>
      </div>

      {/* ESTADO ACTUAL */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-gray-700 font-medium">Estado Actual:</span>
        <span className="px-4 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-bold uppercase text-gray-800">
            {STATUS_LABELS[order.status] || 'Desconocido'}
        </span>
      </div>

      {/* INFO CLIENTE Y ENVÍO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 tracking-wide border-b pb-2">Cliente</h3>
            <p className="text-gray-800 text-lg font-medium">{order.customerName || 'Cliente Desconocido'}</p>
            <p className="text-gray-500 text-sm mt-1">ID: {order.customerId}</p>
        </div>
        <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 tracking-wide border-b pb-2">Detalles de Envío</h3>
            <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Dirección:</span> {order.shippingAddress || 'No especificada'}</p>
                <p><span className="font-medium">Facturación:</span> {order.billingAddress || 'Misma que envío'}</p>
            </div>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3">Producto</th>
                    <th className="px-6 py-3 text-center">Cant.</th>
                    <th className="px-6 py-3 text-right">Precio U.</th>
                    <th className="px-6 py-3 text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {/* Mapeamos los items de la orden */}
                {order.orderItems?.length > 0 ? (
                    order.orderItems.map((item) => (
                        <tr key={item.id || Math.random()}>
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {/* Intentamos mostrar nombre del producto, sino ID */}
                                {item.productName || item.product?.name || 'Producto'}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                            <td className="px-6 py-4 text-right text-gray-600">${item.unitPrice}</td>
                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                            No hay productos en esta orden (Error de datos).
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-bold text-gray-900 uppercase">Total a Pagar:</td>
                    <td className="px-6 py-4 text-right font-extrabold text-xl text-gray-900">
                        ${order.totalAmount}
                    </td>
                </tr>
            </tfoot>
        </table>
      </div>

      {/* NOTAS ADICIONALES */}
      {order.notes && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <strong>Notas del cliente:</strong> {order.notes}
          </div>
      )}

      {/* BOTONES DE ACCIÓN (CAMBIAR ESTADO) */}
      <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
        {/* Botones progresivos según el estado actual */}
        {order.status === 1 && (
            <button 
                onClick={() => handleStatusChange(2)}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition shadow-sm"
            >
                Procesar Orden (2)
            </button>
        )}
        {order.status === 2 && (
            <button 
                onClick={() => handleStatusChange(3)}
                className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition shadow-sm"
            >
                Marcar Enviado (3)
            </button>
        )}
        {order.status === 3 && (
            <button 
                onClick={() => handleStatusChange(4)}
                className="px-5 py-2.5 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition shadow-sm"
            >
                Confirmar Entrega (4)
            </button>
        )}
        
        {/* Botón de Cancelar (Siempre disponible si no está finalizada) */}
        {order.status < 4 && (
            <button 
                onClick={() => handleStatusChange(5)}
                className="px-5 py-2.5 bg-white border border-red-300 text-red-600 font-bold rounded hover:bg-red-50 transition"
            >
                Cancelar Orden
            </button>
        )}
      </div>
    </Card>
  );
}

export default OrderDetailPage;