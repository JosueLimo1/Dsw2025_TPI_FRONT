// CORRECCIÓN: Solo subimos 2 niveles (../../) para llegar a 'modules' y de ahí a 'shared'
import api from '../../shared/api/axiosInstance';

export const login = async (credentials) => {
    const response = await api.post('/authenticate/login', credentials);
    return response.data; 
};