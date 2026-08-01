import HeroSection from '../components/home/HeroSection'
import SectionDivider from '../components/home/SectionDivider'
import NovidadesSection from '../components/home/NovidadesSection'
import CategoryShowcase from '../components/home/CategoryShowcase'
import FeaturedCollection from '../components/home/FeaturedCollection'
import BestsellersSection from '../components/home/BestsellersSection'
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
      <SectionDivider variant="light" showSaint />
      <main>
        <NovidadesSection />
        <SectionDivider variant="light" showSaint />
        <CategoryShowcase />
        <SectionDivider variant="dark" showSaint />
        <FeaturedCollection />
        <SectionDivider variant="light" showSaint />
        <BestsellersSection />
        <SectionDivider variant="light" showSaint />
        <LookbookSection />
        <SectionDivider variant="dark" showSaint />
        <BenefitsBar />
        <SectionDivider variant="dark" showSaint />
        <AboutBrand />
        <BrandValues />
        <SectionDivider variant="light" showSaint />
        <InstagramSection />
        <SectionDivider variant="light" showSaint />
        <Newsletter />
      </main>
    </>
  )
}

export default HomePage
