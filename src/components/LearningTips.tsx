import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw, BookOpen } from 'lucide-react';

interface FarmingTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

const farmingTips = {
  en: [
    {
      id: "tip1",
      title: "Companion Planting Benefits",
      content: "Plant marigolds with tomatoes to naturally repel pests. Basil improves tomato flavor when grown nearby. This practice reduces the need for chemical pesticides.",
      category: "Organic Farming"
    },
    {
      id: "tip2", 
      title: "Water Conservation Tip",
      content: "Mulching around plants retains soil moisture and reduces water needs by up to 50%. Use organic materials like straw or grass clippings.",
      category: "Water Management"
    },
    {
      id: "tip3",
      title: "Soil Health Secret",
      content: "Adding earthworms to your soil improves drainage and nutrient availability. One earthworm can process its own body weight in organic matter daily.",
      category: "Soil Management"
    },
    {
      id: "tip4",
      title: "Natural Fertilizer",
      content: "Banana peels are rich in potassium. Bury them near plants or make liquid fertilizer by soaking in water for 2 weeks.",
      category: "Organic Fertilizers"
    },
    {
      id: "tip5",
      title: "Pest Prevention",
      content: "Planting diverse crops creates a natural pest control system. Monocultures attract more pests than diverse gardens.",
      category: "Pest Control"
    }
  ],
  hi: [
    {
      id: "tip1",
      title: "साथी पौधे लगाने के फायदे",
      content: "टमाटर के साथ गेंदे के फूल लगाएं ताकि कीड़े प्राकृतिक रूप से दूर रहें। तुलसी टमाटर के स्वाद को बेहतर बनाती है जब पास में उगाई जाती है।",
      category: "जैविक खेती"
    },
    {
      id: "tip2",
      title: "पानी बचाने का तरीका",
      content: "पौधों के चारों ओर मल्चिंग करने से मिट्टी की नमी बनी रहती है और पानी की जरूरत 50% तक कम हो जाती है।",
      category: "जल प्रबंधन"
    },
    {
      id: "tip3",
      title: "मिट्टी स्वास्थ्य का राज",
      content: "अपनी मिट्टी में केंचुए मिलाने से जल निकासी और पोषक तत्वों की उपलब्धता बेहतर होती है।",
      category: "मृदा प्रबंधन"
    },
    {
      id: "tip4",
      title: "प्राकृतिक उर्वरक",
      content: "केले के छिलकों में पोटेशियम भरपूर होता है। उन्हें पौधों के पास दबाएं या 2 सप्ताह पानी में भिगोकर तरल उर्वरक बनाएं।",
      category: "जैविक उर्वरक"
    },
    {
      id: "tip5",
      title: "कीट नियंत्रण",
      content: "विविध फसलें लगाने से प्राकृतिक कीट नियंत्रण प्रणाली बनती है। एकल फसल में अधिक कीड़े आते हैं।",
      category: "कीट नियंत्रण"
    }
  ],
  or: [
    {
      id: "tip1",
      title: "ସାଥୀ ଗଛ ଲଗାଇବାର ଲାଭ",
      content: "ଟମାଟୋ ସହିତ ଗାଙ୍ଗୁଣୀ ଫୁଲ ଲଗାନ୍ତୁ ଯାହା ପ୍ରାକୃତିକ ଭାବରେ କୀଟପତଙ୍ଗ ଦୂରେଇ ରଖେ। ତୁଳସୀ ପାଖରେ ବଢ଼ିଲେ ଟମାଟୋର ସ୍ୱାଦ ବଢ଼ାଏ।",
      category: "ଜୈବିକ ଚାଷ"
    },
    {
      id: "tip2",
      title: "ପାଣି ସଞ୍ଚୟ ଉପାୟ",
      content: "ଗଛମାନଙ୍କ ଚାରିପାଖରେ ମଲଚିଂ କଲେ ମାଟିର ଆର୍ଦ୍ରତା ବଜାୟ ରହେ ଏବଂ ପାଣି ଆବଶ୍ୟକତା ୫୦% ପର୍ଯ୍ୟନ୍ତ କମ୍ ହୁଏ।",
      category: "ଜଳ ପରିଚାଳନା"
    },
    {
      id: "tip3",
      title: "ମାଟି ସ୍ୱାସ୍ଥ୍ୟର ରହସ୍ୟ",
      content: "ଆପଣଙ୍କ ମାଟିରେ କେଞ୍ଚୁଆ ମିଶାଇଲେ ଜଳ ନିଷ୍କାସନ ଏବଂ ପୋଷକ ତତ୍ତ୍ୱର ଉପଲବ୍ଧତା ବଢ଼େ।",
      category: "ମୃତ୍ତିକା ପରିଚାଳନା"
    },
    {
      id: "tip4",
      title: "ପ୍ରାକୃତିକ ସାର",
      content: "କଦଳୀ ଚୋପାରେ ପୋଟାସିୟମ୍ ଭରପୂର ଥାଏ। ସେଗୁଡ଼ିକୁ ଗଛ ପାଖରେ ପୋତି ଦିଅନ୍ତୁ କିମ୍ବା ୨ ସପ୍ତାହ ପାଣିରେ ଭିଜାଇ ତରଳ ସାର ତିଆରି କରନ୍ତୁ।",
      category: "ଜୈବିକ ସାର"
    },
    {
      id: "tip5",
      title: "କୀଟ ପ୍ରତିରୋଧ",
      content: "ବିବିଧ ଫସଲ ଲଗାଇଲେ ପ୍ରାକୃତିକ କୀଟ ନିୟନ୍ତ୍ରଣ ବ୍ୟବସ୍ଥା ସୃଷ୍ଟି ହୁଏ। ଏକକ ଫସଲରେ ଅଧିକ କୀଟପତଙ୍ଗ ଆସନ୍ତି।",
      category: "କୀଟ ନିୟନ୍ତ୍ରଣ"
    }
  ]
};

interface LearningTipsProps {
  language: 'en' | 'hi' | 'or';
}

const LearningTips: React.FC<LearningTipsProps> = ({ language }) => {
  const [currentTip, setCurrentTip] = useState<FarmingTip | null>(null);
  const [viewedTips, setViewedTips] = useState<Set<string>>(new Set());

  const tips = farmingTips[language];

  useEffect(() => {
    // Load viewed tips from localStorage
    const saved = localStorage.getItem(`cropwise-viewed-tips-${language}`);
    if (saved) {
      setViewedTips(new Set(JSON.parse(saved)));
    }
    
    // Load current tip or set random one
    const savedCurrentTip = localStorage.getItem(`cropwise-current-tip-${language}`);
    if (savedCurrentTip) {
      setCurrentTip(JSON.parse(savedCurrentTip));
    } else {
      showRandomTip();
    }
  }, [language]);

  useEffect(() => {
    // Save viewed tips to localStorage
    localStorage.setItem(`cropwise-viewed-tips-${language}`, JSON.stringify(Array.from(viewedTips)));
  }, [viewedTips, language]);

  useEffect(() => {
    // Save current tip to localStorage
    if (currentTip) {
      localStorage.setItem(`cropwise-current-tip-${language}`, JSON.stringify(currentTip));
    }
  }, [currentTip, language]);

  const showRandomTip = () => {
    const unviewedTips = tips.filter(tip => !viewedTips.has(tip.id));
    
    let selectedTip: FarmingTip;
    
    if (unviewedTips.length > 0) {
      // Show unviewed tip
      selectedTip = unviewedTips[Math.floor(Math.random() * unviewedTips.length)];
    } else {
      // All tips viewed, reset and show random
      setViewedTips(new Set());
      selectedTip = tips[Math.floor(Math.random() * tips.length)];
    }
    
    setCurrentTip(selectedTip);
    setViewedTips(prev => new Set([...prev, selectedTip.id]));
  };

  const getNextTip = () => {
    showRandomTip();
  };

  if (!currentTip) return null;

  return (
    <Card className="shadow-soft border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Did You Know?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-primary mb-2">{currentTip.title}</h4>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {currentTip.content}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{currentTip.category}</span>
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={getNextTip}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Next Tip
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          {viewedTips.size} of {tips.length} tips explored
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningTips;