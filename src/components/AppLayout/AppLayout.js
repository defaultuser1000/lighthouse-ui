import React from 'react';
import './AppLayout.scss';
import HeaderNav from "../HeaderNav/HeaderNav";

export function AppLayout(props) {
    return(
        <div className='app-layout'>
            <HeaderNav history={props.history}/>
            {props.children}
        </div>
    );
}