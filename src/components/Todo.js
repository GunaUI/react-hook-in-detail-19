import React, { useState, useEffect } from 'react';
import axios from 'axios';

const todo = props => {

    const [currentTodoStateName, setTodoName] = useState('');

    const [currentTodoListState, pushTodoList] = useState([]);

    const [submittedStatus, updateSubmitedStatus] = useState(null);

    
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

    return (
        <React.Fragment>
            <input type="text" placeholder="Todo" onChange={inputChangeHandler} value={currentTodoStateName}/>
            <button type="button" onClick={addTodoListHandler}>Add</button>
            <ul>
                {currentTodoListState.map(todo => 
                <li key={todo.id}>{todo.name}</li>)}
            </ul>
        </React.Fragment>
    );
};

export default todo;