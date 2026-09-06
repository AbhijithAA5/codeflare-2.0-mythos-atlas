import { AtlasSection } from "@/components/longnight/atlas-section";
import { BestiarySection } from "@/components/longnight/bestiary-section";
import { ColophonSection } from "@/components/longnight/colophon-section";
import { EmberGlow } from "@/components/longnight/ember-glow";
import { GuideQuiz } from "@/components/longnight/guide-quiz";
import { Journey } from "@/components/longnight/journey";
import { OfferingsSection } from "@/components/longnight/offerings-section";
import { SiteChrome } from "@/components/longnight/site-chrome";
import { SoundToggle } from "@/components/longnight/sound-toggle";
import { TaleEngine } from "@/components/longnight/tale-engine";

export default function App() {
  return (
    <main>
      <SiteChrome />
      <SoundToggle />
      <EmberGlow />
      <Journey />
      <AtlasSection />
      <BestiarySection />
      <GuideQuiz />
      <TaleEngine />
      <OfferingsSection />
      <ColophonSection />
    </main>
  );
}
