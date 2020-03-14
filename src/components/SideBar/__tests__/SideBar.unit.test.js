import React from 'react';
import { shallow } from 'enzyme';
import SideBar from '../SideBar';

test('renders HeaderNav', () => {
    const wrapper = shallow(
        <SideBar />
    );
    expect(wrapper).toMatchSnapshot();
});