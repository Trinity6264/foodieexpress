
import Header from './Header';
import HeroSection from './home/HeroSection';
import FeatureSection from './home/FeatureSection';
import FeaturedRestaurantSection from './home/FeaturedRestaurantSection';
import TestimonialsSection from './home/TestimonialsSection';
import AboutSection from './home/AboutSection';
import CTASection from './home/CTASection';

const Landing = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <HeroSection />
            <FeatureSection />
            <FeaturedRestaurantSection />
            <TestimonialsSection />
            <AboutSection />
            <CTASection />
        </div>
    );
};

export default Landing;