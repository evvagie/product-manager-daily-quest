
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  title: string;
  author: string;
  description: string;
  tags: string[];
  onView: () => void;
}

const RecommendationCard = ({ title, author, description, tags, onView }: RecommendationCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-100 to-blue-100 border-purple-200 p-4 sm:p-6">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-2">by {author}</p>
            <p className="text-gray-700 text-sm mb-3 sm:mb-4">{description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-700 border-purple-500/30 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* View Button - positioned differently on mobile vs desktop */}
          <div className="sm:ml-4 sm:flex-shrink-0">
            <Button 
              onClick={onView}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2"
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
