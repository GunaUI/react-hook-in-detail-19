import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

import List from './List';

import { useFormInput } from '../hooks/forms'

const todo = props => {

    const [currentTodoStateName, setTodoName] = useState('');

    const [currentTodoListState, pushTodoList] = useState([]);

    const [submittedStatus, updateSubmitedStatus] = useState(null);

    const todoInput = useFormInput();

    
    useEffect(() => {
        axios.get('https://test-21ad7.firebaseio.com/todos.json')
        .then(result => {
            console.log(result)
            const todoData = result.data;
            const todos = []
            for (const key in todoData){
                todos.push({id : key , name: todoData[key].name})
            }
            pushTodoList(todos);
        })
        return () => {
            console.log('Cleanup');
        };
    },[]);

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    const todoListReducer = (state, action) => {
        switch(action.type) {
            case 'ADD':
                return state.concat(action.payload);
            case 'REMOVE':
                return state.filter((todo) => todo.id != action.payload.id);
            default:
                return state;
        }
    };

    useReducer(todoListReducer, [])

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            console.log('mouseMoveHandler cleaned up');
        };
    }, []);

    useEffect(() => {
        if(submittedStatus!=null){
            pushTodoList(currentTodoListState.concat(submittedStatus));
        }
    }, [submittedStatus]);

    const inputChangeHandler = (event) => {
        setTodoName(event.target.value);
    }

    const addTodoListHandler = () => {
        
        axios.post('https://test-21ad7.firebaseio.com/todos.json',{name : currentTodoStateName} )
            .then(res =>{
                setTimeout(()=>{
                    const updatedTodoVal = {id : res.data.name , name: currentTodoStateName}
                    updateSubmitedStatus(updatedTodoVal);

                }, 300);
            })
            .catch(error =>{
                console.log(error);
            })
    }

    const todoRemoveHandler = todoId => {
        axios
            .delete(`https://test-3e15a.firebaseio.com/todos/${todoId}.json`)
            .then(res => {
            dispatch({ type: 'REMOVE', payload: todoId });
            })
            .catch(err => console.log(err));
    };

    return (
        <React.Fragment>
            <input type="text" placeholder="Todo" onChange={inputChangeHandler} value={currentTodoStateName}/>
            <button type="button" onClick={addTodoListHandler}>Add</button>
            <List item={todoList} OnclickRemoveHandler={todoRemoveHandler}/>
        </React.Fragment>
    );
};

export default todo;