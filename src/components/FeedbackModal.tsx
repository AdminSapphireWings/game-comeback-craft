import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import { MessageSquare, Github } from 'lucide-react';

export const FeedbackModal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      toast({ title: 'Error', description: 'Please fill in both fields.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      toast({ title: 'Success', description: 'Thank you for your feedback!' });
      setOpen(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm transition-all text-left w-full">
          <MessageSquare size={16} className="text-gold" />
          <span>Feedback</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a2333] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-gold">Send Feedback</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black/40 border-white/10" />
          <Textarea placeholder="Describe your issue or suggestion..." value={description} onChange={(e) => setDescription(e.target.value)} className="bg-black/40 border-white/10" />
          <Button onClick={handleSubmit} disabled={loading} className="bg-gold text-[#0a0f1a] hover:bg-gold/90">
            {loading ? 'Sending...' : 'Submit'}
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-white/40 text-xs mb-2">Want to get technical?</p>
          <a 
            href="https://github.com/AdminSapphireWings/game-comeback-craft" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm font-medium"
          >
            <Github size={16} />
            Submit an issue on GitHub
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
