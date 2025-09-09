import { API_URL } from './config';

// Generic fetch helper
const fetchForm = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }
  return res.json();
};

// **Updated** Fetch all employees to handle errors gracefully
export const fetchEmployees = async (token) => {
  const url = `${API_URL}/service-providers/employees`;
  const options = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const text = await res.text();
      // Throwing the error here will still get caught below
      throw new Error(`${res.status} - ${text}`);
    }

    const textData = await res.text();

    try {
      const jsonData = JSON.parse(textData);
      return jsonData;
    } catch (e) {
      console.warn("Response was not valid JSON. Trying to handle URL-encoded data.");
      
      const params = new URLSearchParams(textData);
      const employees = [];
      const employeesDataMap = {};

      for (const [key, value] of params.entries()) {
        const parts = key.split('_');
        
        if (parts[0] === 'employee') {
          const index = parts[1];
          const field = parts.slice(2).join('_');
          
          if (!employeesDataMap[index]) {
            employeesDataMap[index] = {};
          }
          employeesDataMap[index][field] = value;
        }
      }

      for (const key in employeesDataMap) {
        employees.push(employeesDataMap[key]);
      }
      
      return { employees };
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    // **Key Change:** Return an empty object to prevent a crash
    // This allows the component to set the state to an empty array
    // and display 0 employees instead of an error.
    return { employees: [] };
  }
};

// Register employees by count
export const registerEmployee = async ({ count }, token) => {
  const formData = new FormData();
  formData.append("count", count);

  return fetchForm(`${API_URL}/service-providers/employees/register`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
};

// Toggle employee active/inactive
export const toggleEmployeeStatusAPI = async (employeeId, newStatus, token) => {
  const endpoint = newStatus ? 'activate' : 'deactivate';
  return fetchForm(`${API_URL}/service-providers/employees/${endpoint}/${employeeId}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};