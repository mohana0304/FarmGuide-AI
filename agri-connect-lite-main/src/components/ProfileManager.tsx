import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, User, MapPin, Trash2 } from 'lucide-react';
import { useProfiles, FarmProfile } from '@/hooks/useProfiles';
import { useToast } from '@/hooks/use-toast';

interface ProfileManagerProps {
  translations: any;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ translations: t }) => {
  const { profiles, currentProfile, createProfile, deleteProfile, switchProfile } = useProfiles();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    soilType: '',
    weather: '',
    location: '',
    notes: ''
  });

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.soilType || !newProfile.weather) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, soil type, and weather conditions.",
        variant: "destructive"
      });
      return;
    }

    createProfile(newProfile);
    setNewProfile({ name: '', soilType: '', weather: '', location: '', notes: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Profile Created",
      description: `Farm profile "${newProfile.name}" has been created successfully.`
    });
  };

  const handleDeleteProfile = (id: string, name: string) => {
    deleteProfile(id);
    toast({
      title: "Profile Deleted",
      description: `Farm profile "${name}" has been deleted.`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Farm Profiles
        </h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Farm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Farm Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Farm Name</Label>
                <Input
                  id="profile-name"
                  placeholder="e.g., North Field, Main Farm"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-soil">{t.soilType}</Label>
                  <Select value={newProfile.soilType} onValueChange={(value) => setNewProfile(prev => ({ ...prev, soilType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
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
                  <Label htmlFor="profile-weather">{t.weather}</Label>
                  <Select value={newProfile.weather} onValueChange={(value) => setNewProfile(prev => ({ ...prev, weather: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather" />
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
                <Label htmlFor="profile-location">Location</Label>
                <Input
                  id="profile-location"
                  placeholder="e.g., Village, District, State"
                  value={newProfile.location}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-notes">Notes</Label>
                <Textarea
                  id="profile-notes"
                  placeholder="Additional information about this farm..."
                  value={newProfile.notes}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <Button onClick={handleCreateProfile} className="w-full">
                Create Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No farm profiles yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {profiles.map((profile) => (
            <Card 
              key={profile.id} 
              className={`cursor-pointer transition-all hover:shadow-soft ${
                currentProfile?.id === profile.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => switchProfile(profile.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{profile.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{t.soilTypes[profile.soilType as keyof typeof t.soilTypes]}</span>
                      <span>•</span>
                      <span>{t.weatherTypes[profile.weather as keyof typeof t.weatherTypes]}</span>
                      {profile.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {profile.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id, profile.name);
                    }}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileManager;