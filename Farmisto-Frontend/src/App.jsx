import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from './utils/Auth'
import Home from './Pages/Home/Home'
import MarketPlace from './Pages/MarketPlace/MarketPlace'
import About from './Pages/About/About'
import Contact from './Pages/Contact/Contact'
import PrivacyPolicy from './Pages/Privacy/PrivacyPolicy'
import NearbyFarmers from './Pages/NearbyFarmers/NearbyFarmers'
import FAQs from './Pages/Faq/FAQ'
import TermsConditions from './Pages/Terms/TermsConditions'
import Cart from './Pages/Cart/Cart'
import Register from './Pages/Register/Register'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Confirmation from './Pages/Confirmation/Confirmation'
import FarmerProfile from './Pages/NearbyFarmers/FarmerProfile'

// Farmer Dashboard (migrated from Farmisto-Retailer)
import Dashboard from './Dash/Dashboard'
import AddItem from './Dash/AddItem'
import Order from './Dash/Order'
import Message from './Dash/Message'
import Payments from './Dash/Payments'
import FarmerRegister from './Pages/FarmerRegister/Register'
import Discounts from './Pages/Discounts/Discounts'
import Settings from './Pages/Settings/Settings'
import ProfileSettings from './Pages/Settings/Sections/ProfileSettings'
import PaymentSettings from './Pages/Settings/Sections/PaymentSettings'
import HelpAndSupport from './Pages/Settings/Sections/HelpAndSupport'
import LegalAndCompliance from './Pages/Settings/Sections/LegalAndCompliance'
import Learn from './Pages/Learn/Learn'
import FarmerMarket from './Pages/FarmerMarket/Market'

const useRouteAccess = (role) => {
  const { isAuthenticated, isReady, userDetails } = useAuth()
  if (!isReady) return <div className="min-h-screen bg-cream" aria-label="Loading account" />
  if (!isAuthenticated) return <Navigate to="/form" replace />
  if (role && userDetails?.role !== role) return <Navigate to="/" replace />
  return null
}

const AuthenticatedRoutes = () => useRouteAccess() || <Outlet />
const FarmerRoutes = () => useRouteAccess("farmer") || <Outlet />

const App = () => {
  return (
    <div className='min-h-screen w-screen font-[Inter] bg-gradient-to-b from-green-50 to-white'>
      <Routes>
        {/* Consumer Routes */}
        <Route path='/' element={<Home/>}/>
        <Route path='/market' element={<MarketPlace/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/privacy' element={<PrivacyPolicy/>}/>
        <Route path='/faq' element={<FAQs/>}/>
        <Route path='/terms-conditions' element={<TermsConditions/>}/>
        <Route path='/form' element={<Register/>}/>
        <Route element={<AuthenticatedRoutes/>}>
          <Route path='/farmers' element={<NearbyFarmers/>}/>
          <Route path='/Profile' element={<FarmerProfile/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/place-order' element={<PlaceOrder/>}/>
          <Route path='/payment' element={<PlaceOrder/>}/>
          <Route path='/checkout' element={<PlaceOrder/>}/>
          <Route path='/order-confirmation' element={<Confirmation/>}/>
        </Route>

        {/* Farmer Dashboard Routes */}
        <Route element={<FarmerRoutes/>}>
          <Route path='/farmer/register' element={<FarmerRegister/>}/>
          <Route path='/farmer/dashboard' element={<Dashboard/>}/>
          <Route path='/farmer/add-item' element={<AddItem/>}/>
          <Route path='/farmer/orders' element={<Order/>}/>
          <Route path='/farmer/messages' element={<Message/>}/>
          <Route path='/farmer/payments' element={<Payments/>}/>
          <Route path='/farmer/discounts' element={<Discounts/>}/>
          <Route path='/farmer/learn' element={<Learn/>}/>
          <Route path='/farmer/market' element={<FarmerMarket/>}/>
          <Route path='/farmer/settings' element={<Settings/>}>
            <Route path='profile' element={<ProfileSettings/>}/>
            <Route path='payment' element={<PaymentSettings/>}/>
            <Route path='help' element={<HelpAndSupport/>}/>
            <Route path='legal' element={<LegalAndCompliance/>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App