'use client'

import HeroSection from '../components/home/HeroSection'
import SectionDivider from '../components/home/SectionDivider'
import NovidadesSection from '../components/home/NovidadesSection'
import CategoryShowcase from '../components/home/CategoryShowcase'
import FeaturedCollection from '../components/home/FeaturedCollection'
import BestsellersSection from '../components/home/BestsellersSection'
import BenefitsBar from '../components/home/BenefitsBar'
import BrandEssence from '../components/home/BrandEssence'
import InstagramSection from '../components/home/InstagramSection'
import Newsletter from '../components/home/Newsletter'
import { useShop } from '../context/ShopContext'

function HomePage({ featuredCollection = null }) {
  const { products, categories } = useShop()

  return (
    <>
      <HeroSection />
      <SectionDivider variant="light" showSaint />
      <main>
        <BestsellersSection products={products} />
        <SectionDivider variant="dark" showSaint />
        <NovidadesSection products={products} />
        <SectionDivider variant="light" showSaint />
        <CategoryShowcase categories={categories} />
        <SectionDivider variant="dark" showSaint />
        <FeaturedCollection featuredCollection={featuredCollection} />
        <SectionDivider variant="light" showSaint />
        <BrandEssence />
        <SectionDivider variant="dark" showSaint />
        <InstagramSection />
        <SectionDivider variant="light" showSaint />
        <BenefitsBar />
        <SectionDivider variant="dark" showSaint />
        <Newsletter />
      </main>
    </>
  )
}

export default HomePage
