
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: 'message' | 'reaction' | 'alert';
}

interface TeamChatProps {
  messages: TeamMessage[];
}

export const TeamChat = ({ messages }: TeamChatProps) => {
  return (
    <Card className="bg-white border-gray-200 mb-6">
      <CardContent className="p-4">
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                  {msg.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-black">{msg.sender}</span>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <p className={`text-sm mt-1 ${
                  msg.type === 'alert' ? 'text-red-600 font-medium' : 
                  msg.type === 'reaction' ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
