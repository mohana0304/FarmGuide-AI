import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiagnosisResult {
  id: string;
  filename: string;
  disease: string;
  riskLevel: 'low' | 'medium' | 'high';
  symptoms: string[];
  preventiveMeasures: string[];
  treatment: string;
  confidence: number;
  timestamp: Date;
}

interface CropDiagnosisProps {
  translations: any;
}

const CropDiagnosis: React.FC<CropDiagnosisProps> = ({ translations: t }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load saved diagnoses from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('cropwise-diagnoses');
    if (saved) {
      const parsed = JSON.parse(saved).map((d: any) => ({
        ...d,
        timestamp: new Date(d.timestamp)
      }));
      setDiagnosisResults(parsed);
    }
  }, []);

  // Save diagnoses to localStorage
  React.useEffect(() => {
    localStorage.setItem('cropwise-diagnoses', JSON.stringify(diagnosisResults));
  }, [diagnosisResults]);

  const mockDiseases = [
    {
      disease: "Leaf Spot Disease",
      symptoms: ["Dark spots on leaves", "Yellowing around spots", "Leaf drop"],
      preventiveMeasures: ["Improve air circulation", "Avoid overhead watering", "Remove infected leaves"],
      treatment: "Apply copper-based fungicide spray every 7-10 days",
      riskLevel: "medium" as const
    },
    {
      disease: "Powdery Mildew",
      symptoms: ["White powdery coating", "Stunted growth", "Curled leaves"],
      preventiveMeasures: ["Ensure good air flow", "Avoid overcrowding", "Water at soil level"],
      treatment: "Spray with neem oil or baking soda solution",
      riskLevel: "low" as const
    },
    {
      disease: "Bacterial Blight",
      symptoms: ["Water-soaked spots", "Brown lesions", "Wilting"],
      preventiveMeasures: ["Use certified seeds", "Crop rotation", "Avoid working in wet fields"],
      treatment: "Remove infected plants, apply copper bactericide",
      riskLevel: "high" as const
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = async (filename: string): Promise<DiagnosisResult> => {
    // Simulate AI analysis based on filename patterns
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    const confidence = 70 + Math.random() * 25; // 70-95%
    
    return {
      id: Date.now().toString(),
      filename,
      disease: randomDisease.disease,
      riskLevel: randomDisease.riskLevel,
      symptoms: randomDisease.symptoms,
      preventiveMeasures: randomDisease.preventiveMeasures,
      treatment: randomDisease.treatment,
      confidence: Math.round(confidence),
      timestamp: new Date()
    };
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await simulateAnalysis(selectedImage.name);
      setDiagnosisResults(prev => [result, ...prev]);
      
      toast({
        title: "Analysis Complete",
        description: `Detected: ${result.disease} (${result.confidence}% confidence)`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again with a different image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Crop Disease Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imagePreview ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Crop Image</h3>
              <p className="text-muted-foreground mb-4">
                Take a clear photo of the affected crop area for AI analysis
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Crop for analysis"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearImage}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearImage}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diagnosis Results */}
      {diagnosisResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Previous Diagnoses</h3>
          {diagnosisResults.map((result) => (
            <Card key={result.id} className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{result.disease}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getRiskColor(result.riskLevel)} flex items-center gap-1`}>
                      {getRiskIcon(result.riskLevel)}
                      {result.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <Badge variant="outline">{result.confidence}% confidence</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analyzed: {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Symptoms Detected:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Recommended Treatment:</h4>
                  <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3">
                    {result.treatment}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Preventive Measures:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.preventiveMeasures.map((measure, index) => (
                      <li key={index}>{measure}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropDiagnosis;