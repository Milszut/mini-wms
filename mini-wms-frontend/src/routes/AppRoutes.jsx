import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Add from '../pages/Add';
import Disposed from '../pages/Disposed';
import List from '../pages/List';
import Locations from '../pages/Locations';
import Services from '../pages/Services';
import PrivateRoute from './PrivateRoute';
import ItemDetails from '../pages/ItemDetails';
import DisposedDetails from '../pages/DisposedDetails';
import Stats from '../pages/Stats';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route element={<PrivateRoute redirectTo='/login'/>}>
                <Route path="/add" element={<Add />} />
                <Route path="/disposed" element={<Disposed />} />
                <Route path='/list' element={<List />}></Route>
                <Route path="/locations" element={<Locations />} />
                <Route path="/services" element={<Services />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/itemdetails/:id" element={<ItemDetails />} />
                <Route path="/disposeddetails/:id" element={<DisposedDetails />} />
            </Route>
            <Route path='*' element={<Navigate to='/' replace/>}></Route>
        </Routes>
    )
}