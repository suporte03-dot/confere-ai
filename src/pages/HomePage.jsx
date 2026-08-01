import HeroSection from '../components/home/HeroSection'
import SectionDivider from '../components/home/SectionDivider'
import NovidadesSection from '../components/home/NovidadesSection'
import FeaturedCollection from '../components/home/FeaturedCollection'
import AboutBrand from '../components/home/AboutBrand'
import BrandValues from '../components/home/BrandValues'
import InstagramSection from '../components/home/InstagramSection'
import Newsletter from '../components/home/Newsletter'

function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionDivider
        variant="light"
        showSaint
        className="section-divider--after-hero"
      />
      <main>
        <NovidadesSection />
        <SectionDivider variant="light" showSaint />
        <FeaturedCollection />
        <SectionDivider variant="light" showSaint />
        <AboutBrand />
        <BrandValues />
        <InstagramSection />
        <Newsletter />
        <SectionDivider variant="light" showSaint />
      </main>
    </>
  )
}

export default HomePage
