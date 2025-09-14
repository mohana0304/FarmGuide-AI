import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Leaf, MessageCircle, Globe, Loader2, Send, User, Camera, Beaker, Calendar, BookOpen, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfiles } from '@/hooks/useProfiles';
import ProfileManager from './ProfileManager';
import CropDiagnosis from './CropDiagnosis';
import FertilizerAdvice from './FertilizerAdvice';
import SeasonalCalendar from './SeasonalCalendar';
import KnowledgeBase from './KnowledgeBase';
import DataExport from './DataExport';
import LearningTips from './LearningTips';

// Multilingual content
const translations = {
  en: {
    title: "CropWise",
    subtitle: "AI Crop Recommender for Farmers",
    recommendation: "Recommendation",
    chat: "Chat",
    language: "Language",
    soilType: "Soil Type",
    weather: "Weather Conditions",
    problem: "Problem Description",
    generateRec: "Generate Recommendation",
    chatPlaceholder: "Ask the AI advisor a question...",
    send: "Send",
    loading: "Generating...",
    soilTypes: {
      clay: "Clay",
      sandy: "Sandy",
      loamy: "Loamy",
      silty: "Silty"
    },
    weatherTypes: {
      dry: "Dry",
      humid: "Humid", 
      moderate: "Moderate",
      rainy: "Rainy"
    }
  },
  hi: {
    title: "फसल सलाहकार",
    subtitle: "किसानों के लिए AI फसल सिफारिश",
    recommendation: "सिफारिश",
    chat: "चैट",
    language: "भाषा",
    soilType: "मिट्टी का प्रकार",
    weather: "मौसम की स्थिति",
    problem: "समस्या का विवरण",
    generateRec: "सिफारिश प्राप्त करें",
    chatPlaceholder: "AI सलाहकार से प्रश्न पूछें...",
    send: "भेजें",
    loading: "तैयार कर रहे हैं...",
    soilTypes: {
      clay: "चिकनी मिट्टी",
      sandy: "रेतीली मिट्टी",
      loamy: "दोमट मिट्टी",
      silty: "गाद मिट्टी"
    },
    weatherTypes: {
      dry: "सूखा",
      humid: "नम",
      moderate: "मध्यम",
      rainy: "बारिश"
    }
  },
  or: {
    title: "ଫସଲ ପରାମର୍ଶଦାତା",
    subtitle: "କୃଷକଙ୍କ ପାଇଁ AI ଫସଲ ସୁପାରିଶ",
    recommendation: "ସୁପାରିଶ",
    chat: "ଚାଟ୍",
    language: "ଭାଷା",
    soilType: "ମାଟିର ପ୍ରକାର",
    weather: "ପାଗ ଅବସ୍ଥା",
    problem: "ସମସ୍ୟାର ବର୍ଣ୍ଣନା",
    generateRec: "ସୁପାରିଶ ପାଆନ୍ତୁ",
    chatPlaceholder: "AI ପରାମର୍ଶଦାତାଙ୍କୁ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
    send: "ପଠାନ୍ତୁ",
    loading: "ପ୍ରସ୍ତୁତ କରୁଛି...",
    soilTypes: {
      clay: "ମାଟି",
      sandy: "ବାଲି ମାଟି",
      loamy: "ଦୋମଟ ମାଟି",
      silty: "ଗାଦ ମାଟି"
    },
    weatherTypes: {
      dry: "ଶୁଖିଲା",
      humid: "ଆର୍ଦ୍ର",
      moderate: "ମଧ୍ୟମ",
      rainy: "ବର୍ଷା"
    }
  }
};

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FormData {
  soilType: string;
  weather: string;
  problem: string;
}

const CropRecommender = () => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'or'>('en');
  const [formData, setFormData] = useState<FormData>({ soilType: '', weather: '', problem: '' });
  const [recommendation, setRecommendation] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentProfile } = useProfiles();

  const t = translations[language];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cropwise-language') as 'en' | 'hi' | 'or';
    const savedFormData = localStorage.getItem('cropwise-form');
    const savedChat = localStorage.getItem('cropwise-chat');
    const savedRecommendation = localStorage.getItem('cropwise-recommendation');

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedChat) setChatMessages(JSON.parse(savedChat));
    if (savedRecommendation) setRecommendation(savedRecommendation);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('cropwise-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cropwise-form', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('cropwise-chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('cropwise-recommendation', recommendation);
  }, [recommendation]);

  const simulateAIResponse = async (input: string, isRecommendation = false): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    if (isRecommendation) {
      const responses = [
        `Based on your ${formData.soilType} soil and ${formData.weather} weather conditions, I recommend planting wheat or barley. These crops are well-suited for your conditions and will help with ${formData.problem}. Consider crop rotation with legumes to improve soil fertility.`,
        `For ${formData.soilType} soil in ${formData.weather} conditions, rice cultivation would be ideal. To address ${formData.problem}, implement drip irrigation and use organic fertilizers. Monitor soil pH regularly.`,
        `Given your soil type and weather, I suggest growing corn or millet. These drought-resistant crops will thrive and help solve ${formData.problem}. Apply compost and practice intercropping for best results.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      const chatResponses = [
        "Based on agricultural best practices, I recommend implementing crop rotation to maintain soil health and prevent pest buildup.",
        "For optimal crop growth, ensure proper irrigation, maintain soil pH between 6.0-7.0, and use organic fertilizers when possible.",
        "Consider using integrated pest management techniques and companion planting to naturally protect your crops.",
        "Monitor weather patterns regularly and adjust your farming practices accordingly. Early planning is key to successful farming.",
        "Soil testing is crucial. Test your soil every 2-3 years to understand nutrient levels and make informed decisions."
      ];
      return chatResponses[Math.floor(Math.random() * chatResponses.length)];
    }
  };

  const handleGenerateRecommendation = async () => {
    if (!formData.soilType || !formData.weather) {
      toast({
        title: "Missing Information",
        description: "Please fill in soil type and weather conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await simulateAIResponse(JSON.stringify(formData), true);
      setRecommendation(response);
      toast({
        title: "Recommendation Generated",
        description: "Your personalized crop recommendation is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await simulateAIResponse(chatInput);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{t.subtitle}</p>
          
          {/* Language Switcher */}
          <div className="flex items-center justify-center mt-4 gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={(value: 'en' | 'hi' | 'or') => setLanguage(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="or">ଓଡ଼ିଆ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Profile Manager */}
        <ProfileManager translations={t} />

        {/* Learning Tips */}
        <LearningTips language={language} />

        {/* Main Tabs */}
        <Tabs defaultValue="recommendation" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="recommendation" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              {t.recommendation}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {t.chat}
            </TabsTrigger>
            <TabsTrigger value="diagnosis" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Diagnosis
            </TabsTrigger>
            <TabsTrigger value="fertilizer" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Fertilizer
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Knowledge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendation" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  {t.recommendation}
                </CardTitle>
                <CardDescription>
                  Provide your farming details to get personalized crop recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soil-type">{t.soilType}</Label>
                    <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${t.soilType.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">{t.soilTypes.clay}</SelectItem>
                        <SelectItem value="sandy">{t.soilTypes.sandy}</SelectItem>
                        <SelectItem value="loamy">{t.soilTypes.loamy}</SelectItem>
                        <SelectItem value="silty">{t.soilTypes.silty}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weather">{t.weather}</Label>
                    <Select value={formData.weather} onValueChange={(value) => setFormData(prev => ({ ...prev, weather: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${t.weather.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry">{t.weatherTypes.dry}</SelectItem>
                        <SelectItem value="humid">{t.weatherTypes.humid}</SelectItem>
                        <SelectItem value="moderate">{t.weatherTypes.moderate}</SelectItem>
                        <SelectItem value="rainy">{t.weatherTypes.rainy}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem">{t.problem}</Label>
                  <Textarea
                    id="problem"
                    placeholder={`Describe any farming challenges or goals...`}
                    value={formData.problem}
                    onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={handleGenerateRecommendation}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-soft"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.loading}
                    </>
                  ) : (
                    t.generateRec
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recommendation Result */}
            {recommendation && (
              <Card className="shadow-elevated border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">AI Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{recommendation}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-accent" />
                  AI Agri-Advisor Chat
                </CardTitle>
                <CardDescription>
                  Ask questions about farming, crops, and agricultural best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chat Messages */}
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Start a conversation with the AI advisor
                    </p>
                  ) : (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.isUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">{t.loading}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder={t.chatPlaceholder}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !chatInput.trim()}
                    size="icon"
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnosis">
            <CropDiagnosis translations={t} />
          </TabsContent>

          <TabsContent value="fertilizer">
            <FertilizerAdvice formData={formData} translations={t} />
          </TabsContent>

          <TabsContent value="calendar">
            <SeasonalCalendar translations={t} currentProfile={currentProfile} />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeBase language={language} />
          </TabsContent>
        </Tabs>

        {/* Data Export */}
        <DataExport language={language} currentProfile={currentProfile} />
      </div>
    </div>
  );
};

export default CropRecommender;