import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Beaker, Droplets, Calendar, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FertilizerRecommendation {
  id: string;
  soilType: string;
  weather: string;
  problem: string;
  fertilizers: {
    type: string;
    npkRatio: string;
    application: string;
    timing: string;
    amount: string;
  }[];
  irrigation: {
    frequency: string;
    amount: string;
    method: string;
    schedule: string[];
  };
  timestamp: Date;
}

interface FertilizerAdviceProps {
  formData: any;
  translations: any;
}

const FertilizerAdvice: React.FC<FertilizerAdviceProps> = ({ formData, translations: t }) => {
  const [recommendations, setRecommendations] = useState<FertilizerRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load saved recommendations
  useEffect(() => {
    const saved = localStorage.getItem('cropwise-fertilizer-advice');
    if (saved) {
      const parsed = JSON.parse(saved).map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp)
      }));
      setRecommendations(parsed);
    }
  }, []);

  // Save recommendations
  useEffect(() => {
    localStorage.setItem('cropwise-fertilizer-advice', JSON.stringify(recommendations));
  }, [recommendations]);

  const fertilizerDatabase = {
    clay: {
      dry: {
        fertilizers: [
          { type: "Organic Compost", npkRatio: "3-2-2", application: "Broadcasting before planting", timing: "Pre-season", amount: "2-3 tons/hectare" },
          { type: "NPK Complex", npkRatio: "10-26-26", application: "Basal application", timing: "At sowing", amount: "150-200 kg/hectare" }
        ],
        irrigation: { frequency: "Every 7-10 days", amount: "25-30mm", method: "Drip irrigation recommended", schedule: ["Early morning (6-8 AM)", "Evening (5-7 PM)"] }
      },
      humid: {
        fertilizers: [
          { type: "Potash Rich Fertilizer", npkRatio: "12-12-24", application: "Split application", timing: "Vegetative stage", amount: "100-120 kg/hectare" },
          { type: "Calcium Ammonium Nitrate", npkRatio: "27-0-0", application: "Top dressing", timing: "Flowering stage", amount: "50-75 kg/hectare" }
        ],
        irrigation: { frequency: "Every 10-14 days", amount: "15-20mm", method: "Furrow irrigation", schedule: ["Morning (7-9 AM)"] }
      }
    },
    sandy: {
      dry: {
        fertilizers: [
          { type: "Slow Release NPK", npkRatio: "15-15-15", application: "Deep placement", timing: "Pre-planting", amount: "200-250 kg/hectare" },
          { type: "Vermicompost", npkRatio: "2-1-1", application: "Soil mixing", timing: "Land preparation", amount: "3-4 tons/hectare" }
        ],
        irrigation: { frequency: "Every 3-4 days", amount: "20-25mm", method: "Sprinkler system", schedule: ["Early morning (5-7 AM)", "Late evening (6-8 PM)"] }
      },
      humid: {
        fertilizers: [
          { type: "Balanced NPK", npkRatio: "20-20-20", application: "Fertigation", timing: "Weekly during growth", amount: "100-150 kg/hectare" },
          { type: "Micronutrient Mix", npkRatio: "0-0-0+Zn,B,Fe", application: "Foliar spray", timing: "Vegetative stage", amount: "2-3 kg/hectare" }
        ],
        irrigation: { frequency: "Every 5-7 days", amount: "15-18mm", method: "Drip irrigation", schedule: ["Morning (6-8 AM)"] }
      }
    },
    loamy: {
      dry: {
        fertilizers: [
          { type: "DAP (Di-Ammonium Phosphate)", npkRatio: "18-46-0", application: "Basal dose", timing: "At sowing", amount: "100-125 kg/hectare" },
          { type: "Farmyard Manure", npkRatio: "0.5-0.2-0.5", application: "Pre-planting incorporation", timing: "Land preparation", amount: "8-10 tons/hectare" }
        ],
        irrigation: { frequency: "Every 5-7 days", amount: "25-30mm", method: "Flood irrigation", schedule: ["Morning (7-9 AM)"] }
      },
      moderate: {
        fertilizers: [
          { type: "NPK Complex", npkRatio: "14-28-14", application: "Broadcasting with incorporation", timing: "Pre-sowing", amount: "150-175 kg/hectare" },
          { type: "Urea", npkRatio: "46-0-0", application: "Split application", timing: "Top dressing", amount: "100-120 kg/hectare" }
        ],
        irrigation: { frequency: "Every 7-10 days", amount: "20-25mm", method: "Sprinkler irrigation", schedule: ["Morning (6-8 AM)", "Evening (5-7 PM)"] }
      }
    }
  };

  const generateRecommendation = async () => {
    if (!formData.soilType || !formData.weather) {
      toast({
        title: "Missing Information",
        description: "Please fill in soil type and weather conditions first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const soilData = fertilizerDatabase[formData.soilType as keyof typeof fertilizerDatabase];
      const weatherData = soilData?.[formData.weather as keyof typeof soilData] || 
                          soilData?.['moderate' as keyof typeof soilData] || 
                          Object.values(soilData)[0];

      const recommendation: FertilizerRecommendation = {
        id: Date.now().toString(),
        soilType: formData.soilType,
        weather: formData.weather,
        problem: formData.problem || '',
        fertilizers: weatherData.fertilizers,
        irrigation: weatherData.irrigation,
        timestamp: new Date()
      };

      setRecommendations(prev => [recommendation, ...prev]);
      
      toast({
        title: "Recommendation Generated",
        description: "Fertilizer and irrigation advice is ready!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-accent" />
            Fertilizer & Irrigation Advice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Soil Type:</span>
                <p className="text-muted-foreground">
                  {formData.soilType ? t.soilTypes[formData.soilType] : 'Not selected'}
                </p>
              </div>
              <div>
                <span className="font-medium">Weather:</span>
                <p className="text-muted-foreground">
                  {formData.weather ? t.weatherTypes[formData.weather] : 'Not selected'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={generateRecommendation}
              disabled={isGenerating || !formData.soilType || !formData.weather}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Beaker className="h-4 w-4 mr-2 animate-pulse" />
                  Generating Advice...
                </>
              ) : (
                <>
                  <Beaker className="h-4 w-4 mr-2" />
                  Get Fertilizer & Irrigation Advice
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommendations</h3>
          {recommendations.map((rec) => (
            <Card key={rec.id} className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t.soilTypes[rec.soilType]} • {t.weatherTypes[rec.weather]}
                  </CardTitle>
                  <Badge variant="outline">
                    {rec.timestamp.toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fertilizer Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    Fertilizer Recommendations
                  </h4>
                  <div className="grid gap-4">
                    {rec.fertilizers.map((fertilizer, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{fertilizer.type}</h5>
                          <Badge className="bg-green-100 text-green-800">
                            NPK: {fertilizer.npkRatio}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="font-medium">Application:</span>
                            <p className="text-muted-foreground">{fertilizer.application}</p>
                          </div>
                          <div>
                            <span className="font-medium">Timing:</span>
                            <p className="text-muted-foreground">{fertilizer.timing}</p>
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span>
                            <p className="text-muted-foreground">{fertilizer.amount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Irrigation Schedule */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    Irrigation Schedule
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="font-medium">Frequency:</span>
                        <p className="text-muted-foreground">{rec.irrigation.frequency}</p>
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span>
                        <p className="text-muted-foreground">{rec.irrigation.amount}</p>
                      </div>
                      <div>
                        <span className="font-medium">Method:</span>
                        <p className="text-muted-foreground">{rec.irrigation.method}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        Best Timing:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {rec.irrigation.schedule.map((time, index) => (
                          <Badge key={index} variant="secondary">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FertilizerAdvice;