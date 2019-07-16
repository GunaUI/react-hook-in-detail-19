import React, { useState } from 'react';

const todo = props => {

    // const [currentTodoStateName, setTodoName] = useState('');

    // const [currentTodoListState, pushTodoList] = useState([]);

    const [todoStateData, setTodoStateFunc] = useState(
        {
        currentTodoStateName: '',
        currentTodoListState: []
        }
    );

    const inputChangeHandler = (event) => {
        setTodoStateFunc({
            currentTodoStateName : event.target.value,
            currentTodoListState : todoStateData.currentTodoListState
        });
    }
    const addTodoListHandler = () => {
        // pushTodoList(currentTodoListState.concat(currentTodoStateName));

        setTodoStateFunc({
            currentTodoStateName : todoStateData.currentTodoStateName,
            currentTodoListState : todoStateData.currentTodoListState.concat(todoStateData.currentTodoStateName)
        });
    }

    return (
        <React.Fragment>
            <input type="text" placeholder="Todo" onChange={inputChangeHandler} value={todoStateData.currentTodoStateName}/>
            <button type="button" onClick={addTodoListHandler}>Add</button>
            <ul>
                {todoStateData.currentTodoListState.map(todo => 
                <li key={todo}>{todo}</li>)}
            </ul>
        </React.Fragment>
    );
};

export default todo;