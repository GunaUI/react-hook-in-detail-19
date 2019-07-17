import React from 'react';

const authContext = React.createContext({status : false, loginFunc  : () => {}});

export default authContext;

