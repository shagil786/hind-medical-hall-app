import { HomeController } from "@/modules/ui/home/controllers/HomeController";
import HomeView from "@/modules/ui/home/view/HomeView";

export default function Home() {
  return (
    <HomeController>
      <HomeView />
    </HomeController>
  );
}
