import { BrowserRouter } from 'react-router-dom';

import { LazySection, About, Contact, Experience, BookPortal, Hero, Navbar, Tech, Works, StarsCanvas, Feedbacks } from './components';



const App = () => {

  return (
    <BrowserRouter>
      <div className='relative w-full overflow-x-hidden z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
         <Tech />
          <Works />
          <Feedbacks />
          <LazySection id="bookportal" minHeight="100vh" rootMargin="1000px 0px">
        
      
        <div className='relative z-0'>
          
          
         
          <BookPortal />
     
          
          <StarsCanvas />
        </div>
          
        </LazySection>
      </div>
    </BrowserRouter>  
  )
}

export default App
