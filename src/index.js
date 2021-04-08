import React from 'react';
import {render} from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";

// const AlertTemplate = ({style, options, message, close}) => (
//     <div style={style}>
//         {options.type === 'info' && '!'}
//         {options.type === 'success' && ':)'}
//         {options.type === 'error' && ':('}
//         {message}
//         <button onClick={close}>X</button>
//     </div>
// );

render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

if (module.hot) module.hot.accept();
