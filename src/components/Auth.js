import React, {useContext} from 'react'

import AuthContext from '../auth-context';

const auth = props => {
    const authVal = useContext(AuthContext);

    return <button onClick={authVal.loginFunc}>Log in!!</button> ;
};


export default auth;