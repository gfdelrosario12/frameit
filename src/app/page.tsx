"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  RotateCcw,
  X,
  Settings,
  Copy,
  RefreshCw,
  Check,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ImageFrameOverlay() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [frameLoaded, setFrameLoaded] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const caption = `𝑪𝒉𝒂𝒓𝒈𝒆 𝒚𝒐𝒖𝒓 𝒄𝒖𝒓𝒊𝒐𝒔𝒊𝒕𝒚 𝒂𝒏𝒅 𝒍𝒆𝒕 𝒚𝒐𝒖𝒓 𝒎𝒊𝒏𝒅 𝑺𝑷𝑨𝑹𝑲 𝒘𝒊𝒕𝒉 𝒊𝒏𝒏𝒐𝒗𝒂𝒕𝒊𝒐𝒏 — because knowledge is the brightest light we can ignite. 💡✨

Hi! I’m [NAME], from BSCpE X-X of the Polytechnic University of the Philippines – Manila, and I’m beyond excited to invite you to the 7th Edition of Software Engineering Day 2025 with the theme: SPARK! 🔥💻

Expect powerful talks, fresh insights, and a whole lot of inspiration that’ll leave your brain buzzing. 🧠 Get ready to explore emerging technologies, bold ideas, and the digital shifts shaping tomorrow. 🌐

Whether you're a techie or just tech-curious, this tech-talks will challenge the way you think and ignite your drive to create meaningful change. 💡⚙️🔥

🔗 Join the DP Blast here:
https://dpsed2025.vercel.app/
https://dpsed2025.vercel.app/
https://dpsed2025.vercel.app/

👥 𝐈𝐧 𝐜𝐨𝐥𝐥𝐚𝐛𝐨𝐫𝐚𝐭𝐢𝐨𝐧 𝐰𝐢𝐭𝐡:
BSCPE 4-1 & BSCPE 4-2
𝐂𝐨-𝐁𝐫𝐨𝐮𝐠𝐡𝐭 𝐭𝐨 𝐲𝐨𝐮 𝐛𝐲:
AcadArena
Pocky
STEAMlab
CaviteTech JV

🤝 𝐈𝐧 𝐏𝐚𝐫𝐭𝐧𝐞𝐫𝐬𝐡𝐢𝐩 𝐰𝐢𝐭𝐡:
Cisco NetConnect PUP - Manila
ICPEP Student Edition - PUP Manila
ACCESS
MRSP - PUP Student Edition
PUP Association of DOST Scholars - PUP ADS

🔁 Share this post, tag your tropa, and flood the comments below!
Let’s spread the spark and make #SEDSPARK2025 trend! 💥💛❤️
𝑩𝒆 𝒑𝒂𝒓𝒕 𝒐𝒇 𝒕𝒉𝒆 𝒔𝒑𝒂𝒓𝒌. 𝑻𝒉𝒆 𝒇𝒖𝒕𝒖𝒓𝒆 𝒔𝒕𝒂𝒓𝒕𝒔 𝒘𝒊𝒕𝒉 𝒀𝑶𝑼. ⚡
#7thSED2025
#SEDSPARK2025`;
  const [captionCopied, setCaptionCopied] = useState<boolean>(false);
  const [scaleInputValue, setScaleInputValue] = useState<string>("1");
  const [rotationInputValue, setRotationInputValue] = useState<string>("0");
  const [scaleError, setScaleError] = useState<string>("");
  const [rotationError, setRotationError] = useState<string>("");

  const [initialDistance, setInitialDistance] = useState<number>(0);
  const [initialScale, setInitialScale] = useState<number>(1);
  const [isPinching, setIsPinching] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const frameSrc = "/frame.png";
  const colors = {
    bg: "bg-[#07003E]",
    headerBg: "bg-[#05002D]",
    panelBg: "bg-[#FFFFFF]",
    
    accent: "bg-[#4B00A3]",
    accentHover: "hover:bg-[#6100D1]",
    
    text: "text-[#07003E]",
    textMuted: "text-[#4B00A3]",
    textDark: "text-[#4B00A3]",
    textAccent: "text-[#6100D1]",
    
    border: "border-[#4B00A3]",
    buttonBg: "bg-[#FFFFFF]",
    buttonHover: "hover:bg-[#F0F0F0]",
    buttonText: "text-[#07003E]",
    
    secondaryButton: "bg-[#F0F0F0]",
    secondaryButtonHover: "hover:bg-[#E0E0E0]",
    secondaryButtonText: "text-[#07003E]",
    
    inputBg: "bg-[#FFFFFF]",
    inputBorder: "border-[#4B00A3]",
    sliderTrack: "bg-[#E0E0E0]",
    sliderRange: "bg-[#4B00A3]"
  };
  const createFallbackFrame = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = "#131118"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#00979D"; 
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    }
    return canvas.toDataURL('image/png');
  };
  
  const defaultSettings = {
    scale: 1,
    rotation: 0,
    position: { x: 0, y: 0 }
  };
  
  const resetToDefault = () => {
    setScale(defaultSettings.scale);
    setRotation(defaultSettings.rotation);
    setPosition(defaultSettings.position);
    setScaleInputValue(defaultSettings.scale.toString());
    setRotationInputValue(defaultSettings.rotation.toString());
    setScaleError("");
    setRotationError("");
  };
  
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      
      img.onload = () => {
        console.log("Frame image loaded successfully");
        frameRef.current = img;
        setFrameLoaded(true);
      };
      
      img.onerror = () => {
        console.error("Error loading frame image, using fallback");
        const fallbackDataUrl = createFallbackFrame();
        img.onload = () => {
          console.log("Fallback frame loaded");
          frameRef.current = img;
          setFrameLoaded(true);
        };
        img.src = fallbackDataUrl;
      };
      img.src = frameSrc;
    }
    
  
    const canvas = canvasRef.current;
    if (canvas) {
      const preventDefaultTouchAction = (e: TouchEvent) => {
        if (e.target === canvas && (isDragging || isPinching)) {
          e.preventDefault();
        }
      };
    
      document.addEventListener('touchmove', preventDefaultTouchAction, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventDefaultTouchAction);
        document.head.removeChild(link);
      };
    }
    
    return () => {
      document.head.removeChild(link);
    };
  }, [isDragging, isPinching]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target || typeof event.target.result !== 'string') return;
        
        const img = new window.Image();
        img.onload = () => {
          setUploadedImage(img);
          resetToDefault();
          setShowSettings(true);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const changeImage = () => {
    document.getElementById('image-upload')?.click();
  };

  const startDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!uploadedImage) return;
    if (!showSettings) {
      setShowSettings(true);
      return;
    }
    
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };
  
  const duringDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !showSettings) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const endDrag = () => {
    setIsDragging(false);
  };
  
const getDistance = (touch1: Touch, touch2: Touch): number => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
  if (!uploadedImage) return;
  if (!showSettings) {
    setShowSettings(true);
    return;
  }

  if (e.touches.length === 2) {
    setIsPinching(true);
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const dist = getDistance(
      touch1 as unknown as Touch, 
      touch2 as unknown as Touch
    );
    setInitialDistance(dist);
    setInitialScale(scale);

    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    setIsDragging(true);
    setDragStart({
      x: centerX - position.x,
      y: centerY - position.y
    });
  } 
  else if (e.touches.length === 1) {
    setIsPinching(false);
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  }
};

const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
  e.preventDefault(); 
  
  if (!showSettings || !uploadedImage) return;

  if (e.touches.length === 2 && isPinching) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = getDistance(
      touch1 as unknown as Touch, 
      touch2 as unknown as Touch
    );
    const newScale = initialScale * (currentDistance / initialDistance);

    const boundedScale = Math.min(Math.max(newScale, 0.1), 10);
    setScale(boundedScale);
    setScaleInputValue(boundedScale.toFixed(1));

    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    if (isDragging) {
      setPosition({
        x: centerX - dragStart.x,
        y: centerY - dragStart.y
      });
    }
  } 
  else if (e.touches.length === 1 && isDragging) {
    requestAnimationFrame(() => {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    });
  }
};
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPinching && e.touches.length === 1) {
      setIsPinching(false);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    } else if (e.touches.length === 0) {
      setIsDragging(false);
      setIsPinching(false);
    }
  };
  
  const copyCaption = () => {
    navigator.clipboard.writeText(caption).then(() => {
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    });
  };
  
  const handleScaleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setScaleInputValue(inputValue);
    
    if (inputValue === "") {
      setScaleError("Value cannot be empty");
    } else {
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        setScaleError("Please enter a valid number");
      } else if (value < 0.1 || value > 10) {
        setScaleError("Value must be between 0.1 and 10");
      } else {
        setScaleError("");
        setScale(value);
      }
    }
  };
  
  const handleScaleInputBlur = () => {
    if (scaleInputValue === "") {
      setScaleInputValue(scale.toString());
      setScaleError("");
    } else {
      const value = parseFloat(scaleInputValue);
      if (!isNaN(value) && value >= 0.1 && value <= 10) {
        const roundedValue = Math.round(value * 10) / 10;
        setScale(roundedValue);
        setScaleInputValue(roundedValue.toString());
        setScaleError("");
      }
    }
  };
  
  const handleRotationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRotationInputValue(inputValue);
    
    if (inputValue === "") {
      setRotationError("Value cannot be empty");
    } else {
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        setRotationError("Please enter a valid number");
      } else if (value < 0 || value > 360) {
        setRotationError("Value must be between 0 and 360");
      } else {
        setRotationError("");
        setRotation(value);
      }
    }
  };
  
  const handleRotationInputBlur = () => {
    if (rotationInputValue === "") {
      setRotationInputValue(rotation.toString());
      setRotationError("");
    } else {
      const value = parseFloat(rotationInputValue);
      if (!isNaN(value) && value >= 0 && value <= 360) {
        setRotation(value);
        setRotationInputValue(value.toString());
        setRotationError("");
      }
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
      if (uploadedImage) {
        ctx.save();
        ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          uploadedImage,
          -uploadedImage.width * scale / 2,
          -uploadedImage.height * scale / 2,
          uploadedImage.width * scale,
          uploadedImage.height * scale
        );
        
        ctx.restore();
      }
      if (frameRef.current && frameLoaded) {
        ctx.drawImage(frameRef.current, 0, 0, canvas.width, canvas.height);
      }
    } catch (error) {
      console.error("Error drawing on canvas:", error);
    }
    
  }, [uploadedImage, scale, position, rotation, frameLoaded]);
  
  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };
  
  return (
    <div className={`min-h-screen w-full flex flex-col ${colors.bg} font-sans`}>
      {/* Main container */}
      <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4">
        {/* Header */}
        <header className="text-center mb-2">
          <div className="flex justify-center mb-2">
            <div className="relative w-[180px] h-[80px]">
              <Image
                src="/logo.png" 
                alt="FrameIt Logo"
                layout="fill"
                objectFit="contain"
                priority 
              />
            </div>
          </div>
          <h1 className={`md:text-base text-white max-w-2xl mx-auto`}>
            Effortlessly frame your photos with just one click – made by ICPEP SE PUP
          </h1>
        </header>
        
        {/* Main content area */}
        <main className="flex-grow flex flex-col md:flex-row gap-4 h-full">
          {/* Canvas Container */}
          <div className="relative flex-grow flex items-center justify-center rounded-lg p-2 md:p-4 shadow-md">
            <div className="relative max-h-180 max-w-180 aspect-square touch-none">
              <canvas 
                ref={canvasRef}
                width={800}
                height={800}
                className={`w-full h-full object-contain rounded shadow-sm ${uploadedImage ? 'cursor-pointer' : ''}`}
                onMouseDown={startDrag}
                onMouseMove={duringDrag}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              />
              
              {!uploadedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Upload className={`h-8 w-8 mb-4 ${colors.text}`} />
                  <Button 
                    className={`${colors.buttonBg} ${colors.buttonHover} ${colors.buttonText} font-medium px-6 py-2 text-sm rounded-md shadow-lg transition-all duration-200`}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Upload Image
                  </Button>
                  <input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </div>
              )}
              
              {uploadedImage && !showSettings && (
                <button
                  className={`absolute bottom-4 right-4 ${colors.buttonBg} ${colors.buttonHover} p-2 rounded-full shadow-lg transition-all duration-200`}
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4 text-white" />
                </button>
              )}
              
              {uploadedImage && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className={`${colors.textMuted} bg-black bg-opacity-40 px-2 py-1 rounded text-xs`}>
                    {isPinching}
                    {!isPinching && isDragging}
                    {(!isPinching && !isDragging && showSettings)}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Settings Panel */}
          {uploadedImage && showSettings && (
            <div className="md:w-72 lg:w-80 flex-shrink-0 md:h-auto">
              <Card className="shadow-lg border border-gray-200 bg-white overflow-hidden h-full max-h-180">
                <CardHeader className="px-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium text-gray-700">Image Settings</CardTitle>
                    <button 
                      className="text-gray-500 hover:text-gray-700 md:hidden"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {/* Scale Control */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Scale</h4>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={scaleInputValue}
                            onChange={handleScaleInputChange}
                            onBlur={handleScaleInputBlur}
                            className={`h-8 text-sm border border-gray-300 bg-white text-gray-800 
                              ${scaleError 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'focus:ring-blue-500'
                              }`}
                          />
                        </div>
                      </div>
                      
                      {scaleError && (
                        <div className="flex items-center gap-1 text-red-600 text-xs justify-end">
                          <AlertCircle className="h-3 w-3" />
                          <span>{scaleError}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 px-1">
                        <button 
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() => {
                            const newScale = Math.max(scale - 0.1, 0.1);
                            setScale(newScale);
                            setScaleInputValue(newScale.toFixed(1));
                          }}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </button>
                        <Slider
                          value={[scale]}
                          min={0.1}
                          max={10}
                          step={0.1}
                          onValueChange={(value) => {
                            setScale(value[0]);
                            setScaleInputValue(value[0].toString());
                            setScaleError("");
                          }}
                          className="flex-grow"
                        />
                        <button 
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() => {
                            const newScale = Math.min(scale + 0.1, 10);
                            setScale(newScale);
                            setScaleInputValue(newScale.toFixed(1));
                          }}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Rotation Control */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Rotation</h4>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0"
                            max="360"
                            step="1"
                            value={rotationInputValue}
                            onChange={handleRotationInputChange}
                            onBlur={handleRotationInputBlur}
                            className={`h-8 text-sm border border-gray-300 bg-white text-gray-800 
                              ${rotationError 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'focus:ring-blue-500'
                              }`}
                          />
                        </div>
                      </div>
                      
                      {rotationError && (
                        <div className="flex items-center gap-1 text-red-600 text-xs justify-end">
                          <AlertCircle className="h-3 w-3" />
                          <span>{rotationError}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 px-1">
                        <button 
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() => {
                            const newRotation = (rotation - 10 + 360) % 360;
                            setRotation(newRotation);
                            setRotationInputValue(newRotation.toString());
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <Slider
                          value={[rotation]}
                          min={0}
                          max={360}
                          step={1}
                          onValueChange={(value) => {
                            setRotation(value[0]);
                            setRotationInputValue(value[0].toString());
                            setRotationError("");
                          }}
                          className="flex-grow"
                        />
                        <button 
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() => {
                            const newRotation = (rotation + 10) % 360;
                            setRotation(newRotation);
                            setRotationInputValue(newRotation.toString());
                          }}
                        >
                          <RotateCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Position Control */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-700">Position</h4>
                      <p className="text-xs text-gray-500">
                        Drag the image to adjust position, pinch to zoom
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-8"
                        onClick={() => setPosition({ x: 0, y: 0 })}
                      >
                        Center Image
                      </Button>
                    </div>
                    
                    {/* Caption Section */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-700">
                        Social Media Caption
                      </h4>
                      <div className="relative">
                        <div 
                          className="p-2 border border-gray-200 rounded-md text-sm h-60 max-h-60 overflow-y-auto whitespace-pre-wrap break-words bg-gray-50 text-gray-800"
                        >
                          {caption}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-600 hover:text-gray-800"
                          onClick={copyCaption}
                        >
                          {captionCopied ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        
                        {captionCopied && (
                          <div className="absolute -top-6 right-0 bg-gray-700 text-white text-xs py-1 px-2 rounded shadow-sm">
                            Copied!
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="pt-1 grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        className="h-8 w-full px-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        onClick={resetToDefault}
                      >
                        <RefreshCw className="mr-1 h-4 w-4" /> Reset
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-8 w-full px-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        onClick={changeImage}
                      >
                        <Upload className="mr-1 h-4 w-4" /> Change
                      </Button>
                    </div>
                    <Button 
                      className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md" 
                      onClick={downloadImage}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          )}
        </main>
      </div>
      <input 
        id="image-upload" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageUpload}
      />
    </div>
  );
}