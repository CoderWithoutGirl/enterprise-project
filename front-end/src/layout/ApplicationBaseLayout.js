import NavBar from '../components/navbar'
import Footer from '../components/footer'

const ApplicationBaseLayout = ({children}) => {
    return (
        <>
            <NavBar />
            {children}
            <Footer />
        </>
    )
}
export default ApplicationBaseLayout;