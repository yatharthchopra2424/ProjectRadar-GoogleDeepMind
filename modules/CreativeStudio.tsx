import React, { useState } from 'react';
import { Button, Card, FileUpload } from '../components/ui';
import { editImage } from '../services/geminiService';
import { Wand2, Image as ImageIcon } from 'lucide-react';

export const CreativeStudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!file || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImage(file, prompt);
      setGeneratedImage(result);
    } catch (err) {
      setError("Failed to edit image. Try a simpler prompt or different image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
          <Wand2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visual Studio</h2>
          <p className="text-slate-500">Edit project visuals or create diagram variations using AI.</p>
        </div>
      </div>

      <Card>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <FileUpload label="Upload Source Image" onChange={setFile} accept="image/*" />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Editing Instruction</label>
              <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg h-24 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                placeholder="e.g., 'Add a futuristic cyberpunk filter', 'Turn this sketch into a realistic photo', 'Remove the messy background'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleEdit} 
              disabled={!file || !prompt.trim()} 
              isLoading={loading}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              Generate Magic Edit
            </Button>
            
            {error && (
               <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            {generatedImage ? (
              <div className="relative w-full h-full">
                <img src={generatedImage} alt="AI Generated" className="w-full h-full object-contain rounded-lg" />
                <a 
                    href={generatedImage} 
                    download="edited-project-visual.png"
                    className="absolute bottom-2 right-2 bg-white/90 text-slate-800 text-xs px-2 py-1 rounded shadow hover:bg-white"
                >
                    Download
                </a>
              </div>
            ) : (
                <div className="text-center text-slate-400 p-8">
                    {loading ? (
                         <div className="flex flex-col items-center gap-2">
                             <div className="animate-spin h-8 w-8 border-4 border-pink-200 border-t-pink-600 rounded-full"></div>
                             <p>Applying magic...</p>
                         </div>
                    ) : (
                        <>
                            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Result will appear here</p>
                        </>
                    )}
                </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
