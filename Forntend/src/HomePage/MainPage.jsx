import Header from "./Header.jsx"
import MainContainer from "./MainContainer.jsx"
import Toolbar from '@mui/material/Toolbar';
import Footer from "./Footer.jsx";
export function MainPage (){
    return (
        <>
        <Header/>
        <Toolbar />
        <MainContainer/>
        <Footer/>
        </>
    )
}