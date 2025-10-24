import api from "./api";

const todoApis = {
    getAllTodos: async () => {
        const response =  await api.get("/todos");
        return response.data;
    },

    getTodo: async (id) => {
        const response = await api.get(`/todos/${id}`);
        return response.data;
    },

    // Create new todo
    createTodo: async (data) => {

        const response = await api.post('/todos', data);
        return response.data;
    },

    // Update todo
    updateTodo: async (id, data) => {
        const response = await api.put(`/todos/${id}`, data);
        return response.data;
    },

    // Toggle complete
    toggleComplete: async (id) => {
        const response = await api.put(`/todos/${id}/toggle`);
        return response.data;
    },

    // Delete todo
    deleteTodo: async (id) => {
        console.log("Deleting todoAPI with ID:", id);
        await api.put(`/todos/${id}/delete`);
    },
}

export default todoApis;

export { todoApis as todoApi };