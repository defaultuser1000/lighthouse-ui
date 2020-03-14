import React from 'react';
import {shallow} from 'enzyme/build';
import {SideBarItem} from '../SideBarItem';

describe('SideBarItem', () => {

    test('renders empty SideBarItem', () => {
        const wrapper = shallow(
            <SideBarItem/>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('renders highlighted SideBarItem that navigates to /settings', () => {
        const wrapper = shallow(
            <SideBarItem highlighted icon='settings' label='Settings'/>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('render non-highlighted SideBarItem that navigates to /settings', () => {
        const wrapper = shallow(
            <SideBarItem icon='settings' label='Settings'/>
        );
        expect(wrapper).toMatchSnapshot();
    });

});

