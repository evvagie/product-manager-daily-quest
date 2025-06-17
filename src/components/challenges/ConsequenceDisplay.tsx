
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Consequence {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: string;
}

interface ConsequenceDisplayProps {
  consequences: Consequence[];
}

export const ConsequenceDisplay = ({ consequences }: ConsequenceDisplayProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'negative': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200';
      case 'negative': return 'border-red-200';
      default: return 'border-yellow-200';
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold text-black">Impact of Your Decision</h3>
      {consequences.map((consequence, index) => (
        <Card key={index} className={`bg-white ${getBorderColor(consequence.type)}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {getIcon(consequence.type)}
              <div className="flex-1">
                <h4 className="font-medium text-black">{consequence.title}</h4>
                <p className="text-gray-700 mt-1">{consequence.description}</p>
                <p className="text-sm text-gray-600 mt-2 italic">{consequence.impact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
