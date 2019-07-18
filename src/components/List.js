import React, {} from 'react'

const list = props => {
    console.log('Rendering List ...');

    return <ul>
            {props.items.map(todo => (
                <li key={todo.id} onClick={props.OnclickRemoveHandler.bind(this, todo.id)}>
                {todo.name}
                </li>
            ))}
            </ul>
};

export default list;