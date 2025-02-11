'use client'
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MdDelete, MdEdit } from "react-icons/md";


const Todo = () => {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  
    const initialTodos = [];
    const getTodos = () => initialTodos;

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    initialData: initialTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo) => [...todos, newTodo],
    onSuccess: (newData) => {queryClient.setQueryData(['todos'], newData)},
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (index) => todos.filter((_, i) => i !== index),
    onSuccess: (newData) => { queryClient.setQueryData(['todos'], newData)},
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ index, newText }) => {
      return todos.map((todo, i) => (i === index ? newText : todo));
    },
    onSuccess: (newData) => { queryClient.setQueryData(['todos'], newData)},
  });

  const addOrUpdateTodo = () => {

    if (editingIndex !== null) {
      updateTodoMutation.mutate({ index: editingIndex, newText: inputValue });
      setEditingIndex(null);
    } else {
      addTodoMutation.mutate(inputValue);
    }
    setInputValue('');
  };

  const editTodo = (index) => {
    setInputValue(todos[index]);
    setEditingIndex(index);
  };

  const deleteTodo = (index) => {
    deleteTodoMutation.mutate(index);
  };

  return (
    <div className="container py-5 bg-green-400 mx-auto">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-blue-500 text-2xl font-medium">TODO</h1>
        <div className="bg-gray-700 p-4 mt-4 flex">
     
          <input
            type="text" placeholder="Enter Something here..." className="p-2 rounded outline-none font-medium text-black" onChange={(e) => setInputValue(e.target.value)}  value={inputValue} />
         
         <button className="p-2 bg-blue-400 ml-4 font-medium rounded" onClick={addOrUpdateTodo}>
            {editingIndex !== null ? 'UPDATE' : 'ADD'}
          </button>

        </div>

        <div>
          
          {todos.map((todo, index) => (
            <div key={index} className="flex justify-between py-2 bg-white mt-4 w-64 rounded items-center">
             
              <h1 className="text-black px-2">{todo}</h1>

              <div className="flex">
             <button className="mr-4 text-black" onClick={() => editTodo(index)}> <MdEdit />
                </button>
                <button className="mr-4 text-black" onClick={() => deleteTodo(index)}> <MdDelete /> </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
