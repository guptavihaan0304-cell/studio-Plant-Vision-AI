'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Paperclip } from 'lucide-react';
import Image from 'next/image';

interface AddGrowthNoteFormProps {
  analysisId: string;
  onNoteAdded: () => void;
}

export function AddGrowthNoteForm({ analysisId, onNoteAdded }: AddGrowthNoteFormProps) {
  const { user, firestore } = useFirebase();
  const { toast } = useToast();
  const [note, setNote] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !user || !firestore) {
      return;
    }

    setIsLoading(true);

    const noteData = {
      analysisId,
      userId: user.uid,
      noteDate: new Date().toISOString(),
      note,
      imageUrl: imageData,
    };

    try {
      const growthTrackersRef = collection(firestore, `users/${user.uid}/plantAnalyses/${analysisId}/growthTrackers`);
      addDocumentNonBlocking(growthTrackersRef, noteData);
      
      toast({
        title: 'Note Added',
        description: 'Your growth note has been saved.',
      });
      setNote('');
      setImagePreview(null);
      setImageData(null);
      onNoteAdded(); // Callback to refresh the timeline
    } catch (error) {
      console.error("Failed to add growth note:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your note. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Add a new growth note... (e.g., 'Watered today', 'New leaf sprouted!')"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        required
        disabled={isLoading}
      />
      {imagePreview && (
        <div className="relative w-32 h-32">
          <Image src={imagePreview} alt="Note image preview" layout="fill" className="rounded-md object-cover" />
        </div>
      )}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => document.getElementById('note-image-upload')?.click()}
          disabled={isLoading}
        >
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Attach image</span>
        </Button>
        <Input
          id="note-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !note.trim()}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Saving...' : 'Add Note'}
        </Button>
      </div>
    </form>
  );
}
