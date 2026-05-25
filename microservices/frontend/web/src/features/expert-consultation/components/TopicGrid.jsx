import React from 'react';
import { Bug, Sprout, Droplets, Calendar, Store } from 'lucide-react';

const TOPICS = [
  { id: 'crop_disease', name: 'Crop Disease', icon: Bug },
  { id: 'soil_health', name: 'Soil Health', icon: Sprout },
  { id: 'pest_management', name: 'Pest Mgmt', icon: Bug },
  { id: 'irrigation', name: 'Irrigation', icon: Droplets },
  { id: 'crop_planning', name: 'Planning', icon: Calendar },
  { id: 'market', name: 'Market', icon: Store },
];

const TopicGrid = ({ selectedTopic, onTopicSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Select Topic</h3>
      <div className="grid grid-cols-2 gap-3">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isSelected = selectedTopic === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-green-600 bg-green-50 text-green-700 shadow-sm' 
                  : 'border-gray-100 bg-white hover:border-green-200 text-gray-600'
              }`}
            >
              <Icon size={24} className={`mb-2 transition-colors ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-xs font-semibold ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                {topic.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicGrid;
