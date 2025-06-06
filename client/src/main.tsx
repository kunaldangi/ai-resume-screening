import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes } from 'react-router'
import { Route } from 'react-router'

import './index.css';

import Home from './Home';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<>LOGIN PAGE</>} />
				<Route path='/register' element={<>REGISTER PAGE</>} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
)
