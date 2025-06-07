import Nav from './Components/1-Nav/Nav'
import Intro from './Components/2-Intro/Intro'
import Services from './Components/3-Services/Services'
import Why from './Components/4-Why/Why'
import Appp from './Components/5-App/Appp'
import Info from './Components/6-Info/Info'
import Need from './Components/7-Need/Need'
import Feed from './Components/8-Feedback/Feed'
import Footer from './Components/9-Footer/Footer'

function Home() {
  return (
    <div>
        <Nav /> 
        <Intro />
        <Services />
        <Why />
        <Appp />
        <Info />
        <Need />
        <Feed />
        <Footer />
    </div>
  );
}

export default Home;
