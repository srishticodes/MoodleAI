import React, { useRef, useState, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';

const JournalCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [text, setText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [generator, setGenerator] = useState(null);
  const [suggestionType, setSuggestionType] = useState('reflection');
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  // Load the model on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const pipe = await pipeline('text-generation', 'Xenova/distilgpt2');
      if (isMounted) setGenerator(() => pipe);
    })();
    return () => { isMounted = false; };
  }, []);

  const startDrawing = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const handleSave = () => {
    const canvasData = canvasRef.current.toDataURL();
    onSave({ text, doodle: canvasData });
  };

  const getPromptForType = (type) => {
    const prompts = {
      reflection: 'Suggest a journaling prompt for self-reflection and introspection:',
      gratitude: 'Suggest a gratitude journaling prompt to appreciate the good things in life:',
      stress: 'Suggest a journaling prompt to help process and manage stress:',
      goals: 'Suggest a journaling prompt for setting and reflecting on personal goals:',
      emotions: 'Suggest a journaling prompt to explore and understand emotions:',
      relationships: 'Suggest a journaling prompt for reflecting on relationships:',
      creativity: 'Suggest a creative journaling prompt to spark imagination:',
      mindfulness: 'Suggest a mindfulness journaling prompt for present moment awareness:'
    };
    return prompts[type] || prompts.reflection;
  };

  const handleSuggestion = async () => {
    setLoading(true);
    setSuggestion('');
    const prompt = getPromptForType(suggestionType);
    try {
      if (generator) {
        const output = await generator(prompt, { max_new_tokens: 40 });
        const suggestionText = output[0]?.generated_text?.replace(prompt, '').trim();
        setSuggestion(suggestionText);
        setSuggestions(prev => [...prev, suggestionText]);
        setCurrentSuggestionIndex(suggestions.length);
        setText(prev => prev + (prev ? '\n' : '') + suggestionText);
      } else {
        setSuggestion('AI is loading, please wait...');
      }
    } catch (e) {
      setSuggestion('Sorry, I could not generate a suggestion right now.');
    }
    setLoading(false);
  };

  const handleRegenerate = async () => {
    if (suggestions.length === 0) {
      await handleSuggestion();
      return;
    }
    setLoading(true);
    const prompt = getPromptForType(suggestionType);
    try {
      if (generator) {
        const output = await generator(prompt, { max_new_tokens: 40 });
        const suggestionText = output[0]?.generated_text?.replace(prompt, '').trim();
        setSuggestions(prev => [...prev, suggestionText]);
        setCurrentSuggestionIndex(suggestions.length);
        setSuggestion(suggestionText);
        setText(prev => prev + (prev ? '\n' : '') + suggestionText);
      }
    } catch (e) {
      setSuggestion('Sorry, I could not generate a suggestion right now.');
    }
    setLoading(false);
  };

  const handleCycleSuggestion = () => {
    if (suggestions.length === 0) return;
    const nextIndex = (currentSuggestionIndex + 1) % suggestions.length;
    setCurrentSuggestionIndex(nextIndex);
    setSuggestion(suggestions[nextIndex]);
  };

  return (
    <div className="journal-canvas">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{ border: '1px solid #ccc', background: '#fff', borderRadius: '8px' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <select
          value={suggestionType}
          onChange={e => setSuggestionType(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
        >
          <option value="reflection">Reflection</option>
          <option value="gratitude">Gratitude</option>
          <option value="stress">Stress</option>
          <option value="goals">Goals</option>
          <option value="emotions">Emotions</option>
          <option value="relationships">Relationships</option>
          <option value="creativity">Creativity</option>
          <option value="mindfulness">Mindfulness</option>
        </select>
        <button onClick={handleSuggestion} disabled={loading || !generator} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#f3e8ff', border: 'none', color: '#7c3aed', fontWeight: 'bold' }}>
          {loading ? 'Thinking...' : 'AI Suggestion'}
        </button>
        {suggestions.length > 0 && (
          <button onClick={handleRegenerate} disabled={loading || !generator} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#e0f2fe', border: 'none', color: '#0277bd', fontWeight: 'bold' }}>
            Regenerate
          </button>
        )}
        {suggestions.length > 1 && (
          <button onClick={handleCycleSuggestion} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#f1f8e9', border: 'none', color: '#33691e', fontWeight: 'bold' }}>
            Cycle ({currentSuggestionIndex + 1}/{suggestions.length})
          </button>
        )}
      </div>
      {suggestion && (
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f3e8ff', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
          <span style={{ color: '#7c3aed', fontStyle: 'italic' }}>{suggestion}</span>
        </div>
      )}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your thoughts here..."
        style={{ width: '100%', marginTop: '1rem', minHeight: '100px', borderRadius: '8px', border: '1px solid #ccc', padding: '8px' }}
      />
      <button onClick={handleSave} style={{ marginTop: '1rem' }}>Save Entry</button>
    </div>
  );
};

export default JournalCanvas; 