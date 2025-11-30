import api from '../../shared/api/axiosInstance';

// OPCIÓN A: Registro Público (Desde el Login - Sin Token)
// Siempre crea "User".
export const registerPublic = async (userData) => {
    const response = await api.post('/authenticate/client-register', userData);
    return response.data;
};

// OPCIÓN B: Registro por Admin (Desde el Dashboard - Con Token)
// Permite elegir Rol ("Admin" o "User").
export const registerByAdmin = async (userData) => {
    const response = await api.post('/authenticate/admin-register', userData);
    return response.data;
};