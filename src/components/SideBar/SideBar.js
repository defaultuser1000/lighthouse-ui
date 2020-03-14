import React from 'react';
import SideBarItem from './SideBarItem/SideBarItem';
import {Divider, Menu} from 'semantic-ui-react';
import './SideBar.scss';
import {SideBarHeader} from "./SideBarHeader/SideBarHeader";
import {SideBarFooter} from "./SideBarFooter/SideBarFooter";

export default class SideBar extends React.Component {
    render() {
        return (
            <Menu borderless vertical stackable fixed='left' className='side-nav'>
                <SideBarItem path='/' label='Home' icon='home'/>
                <SideBarItem path='/orders' label='Orders' icon='film'/>
                <SideBarItem path='/users' label='Users' icon='user outline'/>
                <SideBarItem path='/schedule' label='Working Schedule' icon='calendar outline'/>
                <Divider/>
                <SideBarHeader title='System'/>
                <SideBarItem path='/settings' label='Settings' icon='settings'/>

                <SideBarFooter style={{verticalAlign: 'baseline'}}/>
            </Menu>
        );
    }
}