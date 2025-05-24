import Address from "../../../components/ui/Adress";
import FeaturedServices from "../../../components/ui/FeaturedServices";
import WelcomeSection from "../../../components/ui/WelcomeSection";
import WhyChooseUs from "../../../components/ui/WhyChooseUs";
import HeroCarousel from "../../../components/ui/HeroCarousel";
import ReviewSection from "../../../components/ui/ReviewSection";
import VehiclePickupSection from "../../../components/ui/pickup";

const Home = () => {
  return (
    <div className="mt-16 lg:mt-[62px]">
      <HeroCarousel></HeroCarousel>
      <WelcomeSection></WelcomeSection>
      <VehiclePickupSection></VehiclePickupSection>
      <FeaturedServices></FeaturedServices>
      <WhyChooseUs></WhyChooseUs>
      <ReviewSection></ReviewSection>
      <Address></Address>
    </div>
  );
};

export default Home;
