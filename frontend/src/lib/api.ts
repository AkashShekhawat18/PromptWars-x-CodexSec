async function fetchWithConfig(endpoint: string, options: RequestInit = {}) {
  const url = `/api${endpoint}`;
  const response = await fetch(url, {
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Network error. Please try again.");
  }

  return response.json();
}

// ---------------------------------------------------------
// Authentication API
// ---------------------------------------------------------
export const authAPI = {
  login: async (data: { password: string; [key: string]: unknown }) => {
    return await fetchWithConfig("/auth/login", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },
  signup: async (data: { email: string; [key: string]: unknown }) => {
    return await fetchWithConfig("/auth/signup", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },
};

// ---------------------------------------------------------
// Tasks API
// ---------------------------------------------------------
export interface Task {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "COMPLETED";
  scheduledStart?: string;
}

export const tasksAPI = {
  getTasks: async (): Promise<Task[]> => {
    return await fetchWithConfig("/tasks");
  },
  createTask: async (task: Partial<Task>) => {
    return await fetchWithConfig("/tasks", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
  }
};

// ---------------------------------------------------------
// Documents API
// ---------------------------------------------------------
export interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "docx" | "ppt" | "txt";
  size: string;
  uploadDate: string;
}

export const documentsAPI = {
  getDocuments: async (): Promise<Document[]> => {
    return await fetchWithConfig("/documents");
  },
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await fetchWithConfig("/documents/upload", { 
      method: "POST", 
      body: formData 
    });
  }
};

// ---------------------------------------------------------
// User API
// ---------------------------------------------------------
export const userAPI = {
  getProfile: async () => {
    return await fetchWithConfig("/user/profile");
  }
};
