import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes visuales
import Card from '../../shared/components/Card';

// Servicios
import { getOrders, updateOrderStatus } from '../services/listServices';

// Mapeo de etiquetas de estado (Solo texto para diseño limpio)
const ORDER_STATUS_LABELS = {
  1: 'Pendiente',
  2: 'Procesando',
  3: 'Enviado',
  4: 'Entregado',
  5: 'Cancelado'
};

function ListOrdersPage() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [allOrders, setAllOrders] = useState([]); 
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // 1. Carga de Datos
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Obtenemos las órdenes del backend
        const { data } = await getOrders('', null, 1, 100);
        
        if (data) {
          const list = Array.isArray(data) ? data : (data.items || data.productItems || []);
          setAllOrders(list);
          setFilteredOrders(list);
        }
      } catch (err) {
        console.error(err);
        setAllOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 2. Lógica de Filtrado (Nombre y Estado)
  useEffect(() => {
    let result = allOrders;

    // Filtrar por Nombre de Cliente
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.customerName?.toLowerCase().includes(term)
      );
    }

    // Filtrar por Estado
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === Number(statusFilter));
    }

    setFilteredOrders(result);
    setPageNumber(1); 
  }, [searchTerm, statusFilter, allOrders]);

  // 3. Lógica de Paginación
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const currentOrders = filteredOrders.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  // Estilos CSS
  const inputStyle = "w-full border border-gray-300 bg-white rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-colors";
  const selectStyle = "border border-gray-300 rounded-lg p-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer";

  return (
    <div>
      <Card>
        <div className='mb-6 border-b pb-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Gestión de Órdenes</h1>
        </div>

        {/* Barra de Filtros */}
        <div className='flex flex-col md:flex-row gap-4 justify-between items-end md:items-center'>
          
          {/* --- BUSCADOR CON LUPA --- */}
          <div className='w-full md:w-1/2 flex gap-2'>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text" 
              placeholder='Buscar por cliente...' 
              className={inputStyle}
            />
            
            {/* Botón Lupa (Estilo simple y profesional) */}
            <button 
                className="p-2.5 bg-purple-100 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-200 transition-colors"
                aria-label="Buscar"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </button>
          </div>

          {/* Filtro de Estado */}
          <div className="w-full md:w-1/3">
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${selectStyle} w-full`}
            >
                <option value="all">Todos los estados</option>
                <option value="1">Pendiente</option>
                <option value="2">Procesando</option>
                <option value="3">Enviado</option>
                <option value="4">Entregado</option>
                <option value="5">Cancelado</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Órdenes */}
      <div className='mt-6 flex flex-col gap-3'>
        {loading ? (
            <div className="text-center p-8 text-gray-500">Cargando...</div>
        ) : (
            currentOrders.length > 0 ? (
                currentOrders.map((order) => {
                  const shortId = order.id.substring(0, 8).toUpperCase();
                  const statusLabel = ORDER_STATUS_LABELS[order.status] || 'Desconocido';
                  
                  return (
                    <Card key={order.id}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-1">
                            
                            {/* IZQUIERDA: Datos */}
                            <div className="w-full text-left">
                                <h3 className="text-lg font-bold text-gray-900">
                                    #{shortId} - {order.customerName || 'Cliente Desconocido'}
                                </h3>
                                
                                <div className="mt-1 text-sm text-gray-600 font-medium flex flex-wrap gap-3 items-center">
                                    <span>{statusLabel}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>Total: <b className="text-gray-900">${order.totalAmount}</b></span>
                                </div>
                            </div>

                            {/* DERECHA: Botón Ver Detalle */}
                            <div className="w-full sm:w-auto flex justify-end">
                                <button 
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:text-purple-700 transition text-sm"
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                >
                                    Ver Detalle
                                </button>
                            </div>
                        </div>
                    </Card>
                  );
                })
            ) : (
                <div className="text-center p-12 bg-white rounded border border-gray-200 text-gray-500">
                    No se encontraron resultados.
                </div>
            )
        )}
      </div>

      {/* Paginación Minimalista */}
      {totalPages > 1 && (
          <div className='flex justify-end items-center mt-8 gap-3 text-sm font-medium'>
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(p => p - 1)}
              className='px-3 py-1 text-gray-600 hover:text-black disabled:opacity-30 transition'
            >
              Anterior
            </button>
            
            <div className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-bold">
                {pageNumber}
            </div>
            
            <span className="text-gray-500 text-xs">
                de {totalPages}
            </span>

            <button
              disabled={pageNumber >= totalPages} 
              onClick={() => setPageNumber(p => p + 1)}
              className='px-3 py-1 text-gray-600 hover:text-black disabled:opacity-30 transition'
            >
              Siguiente
            </button>
          </div>
      )}
    </div>
  );
}

export default ListOrdersPage;