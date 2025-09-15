import { API_URL } from './config';

// Generic fetch helper
const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || 'An error occurred');
        error.statusCode = res.status;
        error.errors = data.errors || null;
        throw error;
    }
    return data;
};

// Fetch all employees
export const fetchEmployees = async (token) => {
    const url = `${API_URL}/service-providers/employees`;
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    };
    return fetchJson(url, options);
};

export const registerEmployeesAPI = async ({ count }, token) => {
    return fetchJson(`${API_URL}/service-providers/employees/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ count }),
    });
};


export const toggleEmployeeStatusAPI = async (employeeId, status, token) => {
    return fetchJson(`${API_URL}/service-providers/employees/${status}/${employeeId}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
};

// Fetch employee summary
export const fetchEmployeeSummary = async (token) => {
    return fetchJson(`${API_URL}/service-providers/employees/summary`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });
};

// Fetch provider profile
export const fetchProfile = async (token) => {
    return fetchJson(`${API_URL}/service-providers/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });
};

// Logout
export const logoutAPI = async (token) => {
    return fetchJson(`${API_URL}/service-providers/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });
};