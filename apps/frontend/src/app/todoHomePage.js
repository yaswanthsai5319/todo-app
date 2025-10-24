"use client";
import { todoApi } from "@/lib/todoApi";
import { useEffect, useState } from "react";
import TodoModal from "@/components/todoModal";
import CreateTodoModal from "@/components/CreateTodoModal";

function TodoHomePage() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await todoApi.getAllTodos();
            setTodos(data);
        } catch (err) {
            setError("Failed to fetch todos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatId = (id) => {
        if (typeof id === "string" && id.length > 8) {
            return `${id.slice(0, 8)}...`;
        }
        return id;
    };

    const handleTodoClick = (todo) => {
        setSelectedTodo(todo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTodo(null);
    };

    const handleSaveTodo = async (updatedData) => {
        try {
            await todoApi.updateTodo(selectedTodo.id, updatedData);
            await fetchTodos();
            handleCloseModal();
        } catch (err) {
            console.error("Failed to update todo:", err);
            alert("Failed to update todo. Please try again.");
        }
    };

    async function handleComplete(id) {
        try {
            await todoApi.toggleComplete(id);
            await fetchTodos();
        } catch (err) {
            console.error("Failed to complete todo:", err);
            alert("Failed to complete todo. Please try again.");
        }
    }

    async function handleUndoComplete(id) {
        try {
            await todoApi.toggleComplete(id);
            await fetchTodos();
        } catch (err) {
            console.error("Failed to undo complete todo:", err);
            alert("Failed to undo complete todo. Please try again.");
        }
    }

    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    const handleCreateTodo = async (newData) => {
        try {
            await todoApi.createTodo(newData);
            await fetchTodos();
            handleCloseCreateModal();
        } catch (err) {
            console.error("Failed to create todo:", err);
            alert("Failed to create todo. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await todoApi.deleteTodo(id);
            await fetchTodos();
        } catch (err) {
            console.error("Failed to delete todo:", err);
            alert("Failed to delete todo. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-2xl font-semibold text-gray-700">
                    Loading todos...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-2xl font-semibold text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10 text-center">
                <h1 className="text-5xl font-bold text-gray-800 mb-2">
                    📝 My Todo List
                </h1>
                <p className="text-gray-600 text-lg">
                    Manage your tasks efficiently
                </p>
            </div>

            {/* Create Button */}
            <div className="flex justify-center mb-10">
                <button
                    onClick={handleOpenCreateModal}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                >
                    ➕ Create New Todo
                </button>
            </div>

            {/* Todos */}
            <div className="max-w-7xl mx-auto">
                {todos.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-xl text-gray-500">
                            No todos found. Start creating some!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {todos.map((todo) => (
                            <div
                                key={todo.id}
                                onClick={() => handleTodoClick(todo)}
                                className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 cursor-pointer transform hover:scale-105 ${
                                    todo.isCompleted
                                        ? "border-green-500 bg-green-50"
                                        : "border-blue-500"
                                }`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                                        ID: {formatId(todo.id)}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            todo.isCompleted
                                                ? "bg-green-200 text-green-800"
                                                : "bg-yellow-200 text-yellow-800"
                                        }`}
                                    >
                                        {todo.isCompleted
                                            ? "✅ Completed"
                                            : "⏳ Pending"}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h2
                                    className={`text-xl font-bold mb-3 ${
                                        todo.isCompleted
                                            ? "line-through text-gray-500"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {todo.title}
                                </h2>
                                <p
                                    className={`text-gray-600 mb-4 min-h-[60px] ${
                                        todo.isCompleted ? "line-through" : ""
                                    }`}
                                >
                                    {todo.description || "No description provided"}
                                </p>

                                {/* Buttons - side by side */}
                                <div className="flex items-center gap-3 mt-4">
                                    {todo.isCompleted ? (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUndoComplete(todo.id);
                                            }}
                                            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-semibold shadow-md"
                                        >
                                            ↩️ Undo
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleComplete(todo.id);
                                            }}
                                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold shadow-md"
                                        >
                                            ✅ Complete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (
                                                window.confirm(
                                                    "Are you sure you want to delete this todo?"
                                                )
                                            ) {
                                                handleDelete(todo.id);
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold shadow-md"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                                {/* Footer */}
                                <div className="pt-4 mt-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
                                    <span>🗓️ {new Date(todo.createdAt).toLocaleDateString()}</span>
                                    <span>
                                        🕒{" "}
                                        {new Date(todo.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <TodoModal
                todo={selectedTodo}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTodo}
            />
            <CreateTodoModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSave={handleCreateTodo}
            />
        </div>
    );
}

export default TodoHomePage;
