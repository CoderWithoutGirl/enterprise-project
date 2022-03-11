import NavBar from '../components/navbar'
import Footer from '../components/footer'

const ApplicationBaseLayout = ({children}) => {
    return (
      <>
        <NavBar />
        <main className='mt-[5rem] mb-[20rem]'>{children}</main>
        <Footer />
      </>
    );
}
export default ApplicationBaseLayout;