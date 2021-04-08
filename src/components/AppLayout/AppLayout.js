import React from 'react';
import './AppLayout.scss';
import HeaderNav from "../HeaderNav/HeaderNav";
import SideBar from "../SideBar/SideBar";

export function AppLayout(props) {
    return(
        <div className='app-layout'>
            <HeaderNav history={props.history}/>
            <SideBar/>
            {props.children}
        </div>
    );
}