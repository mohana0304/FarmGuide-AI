import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search, BookOpen, HelpCircle } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

const knowledgeBase: KnowledgeItem[] = [
  {
    id: "1",
    category: "Soil Management",
    title: "How to test soil pH at home",
    content: "You can test soil pH using a simple home kit or digital pH meter. Mix soil with distilled water in 1:2 ratio, let it settle for 30 minutes, then test the water. pH 6.0-7.0 is ideal for most crops. If pH is too low (acidic), add lime. If too high (alkaline), add sulfur or organic matter.",
    tags: ["soil", "pH", "testing", "acidic", "alkaline"]
  },
  {
    id: "2",
    category: "Pest Control",
    title: "Natural pest control methods",
    content: "Use neem oil spray (2-3 ml per liter water) for soft-bodied pests. Plant marigolds as companion plants to repel harmful insects. Encourage beneficial insects like ladybugs and lacewings. Use sticky traps for flying pests. Soap solution (1 tsp dish soap per liter water) helps control aphids.",
    tags: ["pest", "natural", "neem", "companion planting", "organic"]
  },
  {
    id: "3",
    category: "Water Management",
    title: "Signs of overwatering and underwatering",
    content: "Overwatering signs: Yellow leaves, soft stems, fungal growth, bad smell from soil. Underwatering signs: Wilted leaves, dry soil, stunted growth, leaf drop. Check soil moisture by inserting finger 2 inches deep. Water when top inch is dry but soil below is still slightly moist.",
    tags: ["water", "irrigation", "overwatering", "underwatering", "moisture"]
  },
  {
    id: "4",
    category: "Plant Diseases",
    title: "Common fungal diseases and prevention",
    content: "Powdery mildew: White powdery coating on leaves. Prevent with good air circulation and avoid overhead watering. Blight: Dark spots on leaves/fruits. Remove infected parts immediately. Root rot: Yellowing and wilting. Improve drainage and reduce watering. Always use clean tools and practice crop rotation.",
    tags: ["diseases", "fungal", "mildew", "blight", "rot", "prevention"]
  },
  {
    id: "5",
    category: "Fertilization",
    title: "When and how to apply fertilizers",
    content: "Apply fertilizers early morning or evening to avoid leaf burn. Basal application: During land preparation. Top dressing: During vegetative growth. Foliar spray: During flowering. Always water after fertilizer application. Never apply on wet leaves. Follow the 4R principle: Right source, Right rate, Right time, Right place.",
    tags: ["fertilizer", "application", "timing", "basal", "foliar", "4R"]
  },
  {
    id: "6",
    category: "Crop Planning",
    title: "Crop rotation benefits and planning",
    content: "Rotate crops every season to break pest cycles and improve soil health. Follow legumes with heavy feeders like corn. Don't plant same family crops consecutively. Example rotation: Rice → Wheat → Legumes → Vegetables. This improves nitrogen fixation, reduces pests, and maintains soil fertility naturally.",
    tags: ["rotation", "planning", "legumes", "nitrogen", "soil health"]
  },
  {
    id: "7",
    category: "Harvesting",
    title: "How to know when crops are ready to harvest",
    content: "Fruits: Check color, firmness, and ease of picking. Grains: Test moisture content (should be 12-14%). Leaves: Harvest in early morning when moisture is high. Root vegetables: Check size and gently dig to inspect. Seeds: Wait for pods to dry and rattle. Always harvest in dry weather when possible.",
    tags: ["harvest", "timing", "maturity", "moisture", "quality"]
  },
  {
    id: "8",
    category: "Weather Protection",
    title: "Protecting crops from extreme weather",
    content: "Frost protection: Cover with cloth, use water sprays, or light fires. Heat stress: Provide shade cloth, increase irrigation, mulch heavily. Strong winds: Install windbreaks, stake tall plants. Heavy rain: Ensure good drainage, cover delicate crops. Hail: Use hail nets or temporary structures.",
    tags: ["weather", "frost", "heat", "wind", "rain", "hail", "protection"]
  }
];

interface KnowledgeBaseProps {
  language: string;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(knowledgeBase.map(item => item.category)));

  const filteredItems = knowledgeBase.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedItems = categories.map(category => ({
    category,
    items: filteredItems.filter(item => item.category === category)
  })).filter(group => group.items.length > 0);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Offline Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farming guides, tips, and solutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            {groupedItems.map((group) => (
              <div key={group.category}>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  {group.category}
                </h3>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <Card key={item.id} className="shadow-sm">
                      <Collapsible
                        open={openItems.has(item.id)}
                        onOpenChange={() => toggleItem(item.id)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between text-left">
                              <div className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-accent" />
                                <span className="font-medium">{item.title}</span>
                              </div>
                              {openItems.has(item.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground leading-relaxed mb-3">
                              {item.content}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No articles found for "{searchTerm}". Try different keywords.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;