import { useState, useEffect } from 'react';

export interface FarmProfile {
  id: string;
  name: string;
  soilType: string;
  weather: string;
  location: string;
  notes: string;
  createdAt: Date;
  lastUsed: Date;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<FarmProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('cropwise-profiles');
    const savedActiveProfile = localStorage.getItem('cropwise-active-profile');
    
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        lastUsed: new Date(p.lastUsed)
      }));
      setProfiles(parsedProfiles);
    }
    
    if (savedActiveProfile) {
      setActiveProfile(savedActiveProfile);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cropwise-profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem('cropwise-active-profile', activeProfile);
    }
  }, [activeProfile]);

  const createProfile = (profileData: Omit<FarmProfile, 'id' | 'createdAt' | 'lastUsed'>) => {
    const newProfile: FarmProfile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastUsed: new Date()
    };
    
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfile(newProfile.id);
    return newProfile;
  };

  const updateProfile = (id: string, updates: Partial<FarmProfile>) => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, lastUsed: new Date() } : p
    ));
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfile === id) {
      setActiveProfile(null);
    }
  };

  const switchProfile = (id: string) => {
    setActiveProfile(id);
    updateProfile(id, { lastUsed: new Date() });
  };

  const getCurrentProfile = () => {
    return profiles.find(p => p.id === activeProfile) || null;
  };

  return {
    profiles,
    activeProfile,
    currentProfile: getCurrentProfile(),
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile
  };
};