
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ComplaintPhotoProps {
  photoUrl?: string;
}

const ComplaintPhoto = ({ photoUrl }: ComplaintPhotoProps) => {
  if (!photoUrl) return null;

  const handleViewPhoto = () => {
    window.open(photoUrl, '_blank');
  };

  // Check if the photo is a base64 string
  const isBase64 = photoUrl.startsWith('data:image');

  return (
    <div>
      <div className="font-medium mb-1">Photo:</div>
      <div className="flex justify-center">
        <img 
          src={photoUrl} 
          alt="Complaint" 
          className="max-h-64 rounded-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      <div className="text-center mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewPhoto}
          className="text-blue-500"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Full Size
        </Button>
      </div>
    </div>
  );
};

export default ComplaintPhoto;
