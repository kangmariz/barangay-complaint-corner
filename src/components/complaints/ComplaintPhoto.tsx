
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ComplaintPhotoProps {
  photoUrl?: string;
}

const ComplaintPhoto = ({ photoUrl }: ComplaintPhotoProps) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset error state when photoUrl changes
    if (photoUrl) {
      setImgError(false);
      setIsLoading(true);
    }
  }, [photoUrl]);

  if (!photoUrl) return null;

  const handleViewPhoto = () => {
    // Try to open the image in a new tab
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Complaint Photo</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <img src="${photoUrl}" alt="Complaint Photo" />
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const isBase64 = typeof photoUrl === 'string' && 
    (photoUrl.startsWith('data:image') || photoUrl.includes('base64'));

  return (
    <div>
      <div className="font-medium mb-1">Photo:</div>
      <div className="flex flex-col items-center">
        {isLoading && !imgError && (
          <div className="flex justify-center items-center h-32 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!imgError ? (
          <Popover>
            <PopoverTrigger asChild>
              <img 
                src={photoUrl} 
                alt="Complaint" 
                className={`max-h-64 rounded-md cursor-pointer ${isLoading ? 'hidden' : 'block'}`}
                onError={() => {
                  setImgError(true);
                  setIsLoading(false);
                }}
                onLoad={() => setIsLoading(false)}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 max-w-none" align="center">
              <img 
                src={photoUrl} 
                alt="Complaint Full Size" 
                className="max-h-[80vh] max-w-[90vw]"
              />
            </PopoverContent>
          </Popover>
        ) : (
          <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
            Unable to display image. Click "View Full Size" to open it in a new tab.
          </div>
        )}
        
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
    </div>
  );
};

export default ComplaintPhoto;
