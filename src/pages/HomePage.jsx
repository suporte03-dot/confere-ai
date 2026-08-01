import HeroSection from '../components/home/HeroSection'
import SectionDivider from '../components/home/SectionDivider'
import NovidadesSection from '../components/home/NovidadesSection'
import FeaturedCollection from '../components/home/FeaturedCollection'
import LookbookSection from '../components/home/LookbookSection'
import BenefitsBar from '../components/home/BenefitsBar'
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
        <SectionDivider variant="dark" showSaint />
        <LookbookSection />
        <SectionDivider variant="light" showSaint />
        <AboutBrand />
        <BrandValues />
        <BenefitsBar />
        <InstagramSection />
        <Newsletter />
        <SectionDivider variant="light" showSaint />
      </main>
    </>
  )
}

export default HomePage
