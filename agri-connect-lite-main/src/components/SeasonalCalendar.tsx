import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Sprout, Scissors, Star } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface CropCalendarEntry {
  crop: string;
  plantingStart: string;
  plantingEnd: string;
  harvestStart: string;
  harvestEnd: string;
  duration: string;
  bestSoils: string[];
  notes: string;
}

interface SavedCalendarEntry {
  id: string;
  crop: string;
  plantingDate: Date;
  expectedHarvest: Date;
  notes: string;
  profileId?: string;
}

const cropCalendar: CropCalendarEntry[] = [
  {
    crop: "Rice",
    plantingStart: "Jun",
    plantingEnd: "Jul",
    harvestStart: "Nov",
    harvestEnd: "Dec",
    duration: "120-150 days",
    bestSoils: ["clay", "loamy"],
    notes: "Requires continuous water supply"
  },
  {
    crop: "Wheat",
    plantingStart: "Nov",
    plantingEnd: "Dec",
    harvestStart: "Mar",
    harvestEnd: "Apr",
    duration: "120-140 days",
    bestSoils: ["loamy", "sandy"],
    notes: "Cool season crop, drought tolerant"
  },
  {
    crop: "Maize/Corn",
    plantingStart: "Jun",
    plantingEnd: "Jul",
    harvestStart: "Oct",
    harvestEnd: "Nov",
    duration: "90-120 days",
    bestSoils: ["loamy", "sandy"],
    notes: "Requires warm weather and good drainage"
  },
  {
    crop: "Cotton",
    plantingStart: "Apr",
    plantingEnd: "May",
    harvestStart: "Oct",
    harvestEnd: "Jan",
    duration: "180-200 days",
    bestSoils: ["sandy", "loamy"],
    notes: "Long growing season, heat loving"
  },
  {
    crop: "Sugarcane",
    plantingStart: "Feb",
    plantingEnd: "Apr",
    harvestStart: "Dec",
    harvestEnd: "Mar",
    duration: "300-365 days",
    bestSoils: ["loamy", "clay"],
    notes: "Perennial crop, requires irrigation"
  },
  {
    crop: "Tomato",
    plantingStart: "Oct",
    plantingEnd: "Nov",
    harvestStart: "Jan",
    harvestEnd: "Mar",
    duration: "90-120 days",
    bestSoils: ["loamy", "sandy"],
    notes: "Sensitive to frost, needs support"
  },
  {
    crop: "Onion",
    plantingStart: "Nov",
    plantingEnd: "Dec",
    harvestStart: "Mar",
    harvestEnd: "Apr",
    duration: "120-150 days",
    bestSoils: ["sandy", "loamy"],
    notes: "Cool season crop, shallow rooted"
  },
  {
    crop: "Potato",
    plantingStart: "Oct",
    plantingEnd: "Nov",
    harvestStart: "Jan",
    harvestEnd: "Feb",
    duration: "90-120 days",
    bestSoils: ["sandy", "loamy"],
    notes: "Cool weather crop, avoid waterlogging"
  }
];

interface SeasonalCalendarProps {
  translations: any;
  currentProfile?: any;
}

const SeasonalCalendar: React.FC<SeasonalCalendarProps> = ({ translations: t, currentProfile }) => {
  const [selectedCrop, setSelectedCrop] = useState<CropCalendarEntry | null>(null);
  const [savedEntries, setSavedEntries] = useState<SavedCalendarEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Load saved calendar entries
  useEffect(() => {
    const saved = localStorage.getItem('cropwise-calendar');
    if (saved) {
      const parsed = JSON.parse(saved).map((entry: any) => ({
        ...entry,
        plantingDate: new Date(entry.plantingDate),
        expectedHarvest: new Date(entry.expectedHarvest)
      }));
      setSavedEntries(parsed);
    }
  }, []);

  // Save calendar entries
  useEffect(() => {
    localStorage.setItem('cropwise-calendar', JSON.stringify(savedEntries));
  }, [savedEntries]);

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short' });
  };

  const isPlantingSeason = (crop: CropCalendarEntry) => {
    const currentMonth = getCurrentMonth();
    const plantingMonths = getMonthRange(crop.plantingStart, crop.plantingEnd);
    return plantingMonths.includes(currentMonth);
  };

  const isHarvestSeason = (crop: CropCalendarEntry) => {
    const currentMonth = getCurrentMonth();
    const harvestMonths = getMonthRange(crop.harvestStart, crop.harvestEnd);
    return harvestMonths.includes(currentMonth);
  };

  const getMonthRange = (start: string, end: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startIdx = months.indexOf(start);
    const endIdx = months.indexOf(end);
    
    if (startIdx <= endIdx) {
      return months.slice(startIdx, endIdx + 1);
    } else {
      return [...months.slice(startIdx), ...months.slice(0, endIdx + 1)];
    }
  };

  const addToMyCalendar = (crop: CropCalendarEntry) => {
    if (!selectedDate) return;

    // Calculate expected harvest date based on duration
    const durationDays = parseInt(crop.duration.split('-')[1] || crop.duration.split('-')[0]) || 120;
    const expectedHarvest = new Date(selectedDate);
    expectedHarvest.setDate(expectedHarvest.getDate() + durationDays);

    const newEntry: SavedCalendarEntry = {
      id: Date.now().toString(),
      crop: crop.crop,
      plantingDate: selectedDate,
      expectedHarvest,
      notes: crop.notes,
      profileId: currentProfile?.id
    };

    setSavedEntries(prev => [...prev, newEntry]);
  };

  const getCropRecommendations = () => {
    if (!currentProfile) return cropCalendar;
    
    return cropCalendar.filter(crop => 
      crop.bestSoils.includes(currentProfile.soilType)
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Seasonal Crop Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crop List */}
            <div className="space-y-3">
              <h4 className="font-semibold">Recommended Crops</h4>
              {getCropRecommendations().map((crop) => (
                <div
                  key={crop.crop}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-soft ${
                    selectedCrop?.crop === crop.crop ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{crop.crop}</h5>
                    <div className="flex gap-1">
                      {isPlantingSeason(crop) && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Sprout className="h-3 w-3 mr-1" />
                          Plant Now
                        </Badge>
                      )}
                      {isHarvestSeason(crop) && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          <Scissors className="h-3 w-3 mr-1" />
                          Harvest
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Plant: {crop.plantingStart}-{crop.plantingEnd}</span>
                    <span>Harvest: {crop.harvestStart}-{crop.harvestEnd}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="space-y-4">
              <h4 className="font-semibold">Select Planting Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              {selectedCrop && selectedDate && (
                <Button 
                  onClick={() => addToMyCalendar(selectedCrop)}
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Add {selectedCrop.crop} to My Calendar
                </Button>
              )}
            </div>
          </div>

          {/* Crop Details */}
          {selectedCrop && (
            <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedCrop.crop} Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Duration:</span>
                  <p className="text-muted-foreground">{selectedCrop.duration}</p>
                </div>
                <div>
                  <span className="font-medium">Best Soils:</span>
                  <p className="text-muted-foreground">
                    {selectedCrop.bestSoils.map(soil => 
                      t.soilTypes[soil] || soil
                    ).join(', ')}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Notes:</span>
                  <p className="text-muted-foreground">{selectedCrop.notes}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Calendar */}
      {savedEntries.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              My Planting Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedEntries
                .filter(entry => !currentProfile || entry.profileId === currentProfile.id)
                .sort((a, b) => a.plantingDate.getTime() - b.plantingDate.getTime())
                .map((entry) => (
                <div key={entry.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{entry.crop}</h5>
                    <Badge variant="outline">
                      {entry.plantingDate.toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Planted: {entry.plantingDate.toLocaleDateString()}</span>
                    <span>Expected Harvest: {entry.expectedHarvest.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeasonalCalendar;