import { API_URL } from './config';

export const fetchEmployees = async (token) => {
  const res = await fetch(`${API_URL}/service-providers/employees`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch employees');
  }
  return data;
};

export const addEmployeeAPI = async (employee, token, count = 1) => {
  try {
    const res = await fetch(`${API_URL}/service-providers/employees/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        count,
        ...employee,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to add employee');
    }
    return data;
  } catch (err) {
    console.error('Add Employee API Error:', err);
    throw err;
  }
};

export const updateEmployeeAPI = async (id, employee, token) => {
  try {
    const res = await fetch(`${API_URL}/employees-data/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(employee),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update employee');
    }
    return data;
  } catch (err) {
    console.error('Update Employee API Error:', err);
    throw err;
  }
};

export const toggleEmployeeStatusAPI = async (employeeId, newStatus, token) => {
  try {
    // Determine endpoint based on new status
    const endpoint = newStatus ? 'activate' : 'deactivate';
    const url = `${API_URL}/service-providers/employees/${endpoint}/${employeeId}`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Handle non-JSON responses safely
    if (!res.ok) {
      let errorMsg = 'Failed to toggle employee status';
      try {
        const errData = await res.json();
        errorMsg = errData.message || errData.error || errorMsg;
      } catch {
        const text = await res.text();
        console.error('Non-JSON response from backend:', text);
      }
      throw new Error(errorMsg);
    }

    // Backend might return a message instead of full employee object
    // Return a consistent object for frontend
    return { is_active: newStatus };
  } catch (err) {
    console.error('Toggle Employee Status API Error:', err);
    throw err;
  }
};


export const deleteEmployeeAPI = async (id, token) => {
  try {
    const res = await fetch(`${API_URL}/employees-data/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      let errorMsg = 'Failed to delete employee';
      try {
        const errData = await res.json();
        errorMsg = errData.message || errorMsg;
      } catch {
        console.warn('No JSON response from delete endpoint.');
      }
      throw new Error(errorMsg);
    }

    // Laravel might return 204 with empty body, so return a success message
    return { message: 'Employee deleted successfully' };
  } catch (err) {
    console.error('Delete Employee API Error:', err);
    throw err;
  }
};
