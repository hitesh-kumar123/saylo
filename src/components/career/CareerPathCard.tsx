import React from 'react';
import { TrendingUp, Users, DollarSign, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CareerPath } from '../../types';
import { motion } from 'framer-motion';

interface CareerPathCardProps {
  careerPath: CareerPath;
  recommended?: boolean;
  onViewDetails: (pathId: string) => void;
}

export const CareerPathCard: React.FC<CareerPathCardProps> = ({
  careerPath,
  recommended = false,
  onViewDetails,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full" hover>
        {recommended && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Recommended
            </span>
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{careerPath.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{careerPath.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">
              <span className="font-medium">{careerPath.requiredSkills.length}</span> required skills
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">
              <span className={`font-medium ${careerPath.growthRate > 10 ? 'text-green-600' : ''}`}>
                {careerPath.growthRate}%
              </span> growth rate
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">
              <span className="font-medium">{careerPath.averageSalary}</span> avg. salary
            </span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-700">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {careerPath.requiredSkills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
            {careerPath.requiredSkills.length > 5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{careerPath.requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
        
        <Button
          variant="outline"
          fullWidth
          rightIcon={<ExternalLink size={16} />}
          onClick={() => onViewDetails(careerPath.id)}
        >
          View Details
        </Button>
      </Card>
    </motion.div>
  );
};