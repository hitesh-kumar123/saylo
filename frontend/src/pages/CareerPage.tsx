import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { CareerPathCard } from '../components/career/CareerPathCard';
import { Card } from '../components/ui/Card';
import { useCareerStore } from '../store/careerStore';
import { useResumeStore } from '../store/resumeStore';
import { Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

export const CareerPage: React.FC = () => {
  const { careerPaths, recommendedPaths, fetchCareerPaths, fetchRecommendedPaths } = useCareerStore();
  const { currentResume } = useResumeStore();

  useEffect(() => {
    fetchCareerPaths();
    if (currentResume) {
      fetchRecommendedPaths(currentResume.id);
    }
  }, [fetchCareerPaths, fetchRecommendedPaths, currentResume]);

  // Mock data for demonstration
  const demoCareerPaths = [
    {
      id: '1',
      title: 'Software Engineer',
      description: 'Develop and maintain software applications using programming languages like JavaScript, Python, or Java.',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
      growthRate: 22,
      averageSalary: '$110,000',
      recommendedResources: [],
    },
    {
      id: '2',
      title: 'Data Scientist',
      description: 'Analyze and interpret complex data to help organizations make better decisions.',
      requiredSkills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
      growthRate: 31,
      averageSalary: '$120,000',
      recommendedResources: [],
    },
    {
      id: '3',
      title: 'Product Manager',
      description: 'Lead the development of products from conception to launch, working with cross-functional teams.',
      requiredSkills: ['Product Strategy', 'User Research', 'Agile', 'Roadmapping', 'Analytics', 'Communication'],
      growthRate: 18,
      averageSalary: '$115,000',
      recommendedResources: [],
    },
    {
      id: '4',
      title: 'UX/UI Designer',
      description: 'Create intuitive and visually appealing interfaces for websites and applications.',
      requiredSkills: ['UI Design', 'User Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe Creative Suite'],
      growthRate: 15,
      averageSalary: '$95,000',
      recommendedResources: [],
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      description: 'Implement and maintain infrastructure and deployment systems for software development.',
      requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'Scripting'],
      growthRate: 24,
      averageSalary: '$125,000',
      recommendedResources: [],
    },
  ];

  const handleViewDetails = (pathId: string) => {
    // In a real app, this would navigate to a detail page or open a modal
    console.log(`View details for career path: ${pathId}`);
  };

  return (
    <PageLayout title="Career Guidance" subtitle="Explore career paths and get personalized recommendations">
      <div className="space-y-8">
        {/* Recommended Career Paths */}
        <div>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
          </div>
          
          {currentResume ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* In a real app, this would use recommendedPaths from the store */}
              {demoCareerPaths.slice(0, 3).map((path) => (
                <CareerPathCard 
                  key={path.id}
                  careerPath={path}
                  recommended
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume for Personalized Recommendations</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  To get personalized career path recommendations based on your skills and experience, please upload your resume.
                </p>
              </div>
            </Card>
          )}
        </div>
        
        {/* All Career Paths */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Explore All Career Paths</h2>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="filter" className="text-sm text-gray-700 mr-2">Filter by:</label>
              <select
                id="filter"
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="tech">Technology</option>
                <option value="business">Business</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* In a real app, this would use careerPaths from the store */}
            {demoCareerPaths.map((path) => (
              <CareerPathCard 
                key={path.id}
                careerPath={path}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};