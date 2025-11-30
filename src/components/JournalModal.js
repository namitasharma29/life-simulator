import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Flame, X, CheckCircle } from 'lucide-react';
import { getDailyPrompt, getTopicPrompt, getReviewPrompt } from '../data/journalPrompts';


const JournalModal = ({ onClose, onSubmit, currentStreak, getPrompt }) => {
  const [entry, setEntry] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState(null);

  useEffect(() => {
    // Get today's prompt from parent-provided function
    if (getPrompt) {
      setDailyPrompt(getPrompt());
    }
  }, [getPrompt]);

  // Count words in real-time
  useEffect(() => {
    const words = entry.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [entry]);

  const handleSubmit = () => {
    if (entry.trim().length === 0) {
      alert('Write something first! Even one word counts. 💭');
      return;
    }

    if (wordCount > 20) {
      alert('Keep it under 20 words! Concise = powerful. ✂️');
      return;
    }

    // Save the entry
    const journalEntry = {
      date: new Date().toISOString(),
      prompt: dailyPrompt.prompt,
      category: dailyPrompt.category,
      entry: entry.trim(),
      wordCount: wordCount,
    };
    
    // If this was a topic prompt, track that in the entry for analytics
    if (dailyPrompt.category === 'topic') {
      journalEntry.promptType = 'topic';
    }

    // Show success animation
    setShowSuccess(true);

    // Call parent submit handler after a brief delay
    setTimeout(() => {
      onSubmit(journalEntry);
      onClose();
    }, 1500);
  };

  const wordCountColor = () => {
    if (wordCount === 0) return '#9ca3af';
    if (wordCount <= 15) return '#10b981'; // green
    if (wordCount <= 20) return '#f59e0b'; // amber
    return '#ef4444'; // red (over limit)
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      confusion: '🤔',
      aha: '💡',
      connections: '🔗',
      application: '🎯',
      confidence: '😊',
      feynman: '🧠',
      study: '🎓',
      future: '🚀',
      motivation: '💪',
    };
    return emojiMap[category] || '✨';
  };

  if (!dailyPrompt) {
    return (
      <div 
        style={{ 
          position: 'fixed', inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 50, padding: '16px' 
        }}
      >
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', maxWidth: '48rem', width: '100%' }}>
          <p style={{ color: '#6b7280', textAlign: 'center' }}>Loading your daily prompt...</p>
        </div>
      </div>
    );
  }

  // --- Styles for Disabled Button Consistency ---
  const disabledButtonStyle = {
    background: '#e5e7eb', // Light gray background
    color: '#9ca3af', // Gray text
    cursor: 'not-allowed',
    boxShadow: 'none',
    opacity: 1, 
    pointerEvents: 'none',
  };

  // --- Styles for Success Animation ---
  // Using a style tag to define keyframes globally for the component
  const successPulseAnimation = {
    animation: 'successPulse 1.5s infinite',
    keyframeStyle: `
      @keyframes successPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `
  };

  return (
    <div 
      style={{ 
        position: 'fixed', inset: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        zIndex: 50, padding: '16px' 
      }}
      onClick={onClose}
    >
      <style>{successPulseAnimation.keyframeStyle}</style>
      <div 
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', // Standardized corner radius 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
          maxWidth: '48rem', 
          width: '100%', 
          transition: 'all 0.3s ease' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Overlay */}
        {showSuccess && (
          <div 
            style={{ 
              position: 'absolute', inset: 0, 
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', 
              borderRadius: '16px', 
              display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', zIndex: 10,
              padding: '32px'
            }}
          >
            <CheckCircle size={80} style={{ color: 'white', marginBottom: '16px', ...successPulseAnimation }} />
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Entry Saved! 🎉</h3>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>+10 XP earned</p>
          </div>
        )}

        {/* Header */}
        <div style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)', padding: '24px', borderRadius: '16px 16px 0 0', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ 
              position: 'absolute', top: '16px', right: '16px', color: 'white', 
              background: 'transparent', border: 'none', borderRadius: '50%', padding: '8px',
              opacity: 0.9, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <X size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Brain size={32} style={{ color: 'white' }} />
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>Brain Dump Roulette</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)', padding: '6px 16px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} style={{ color: '#fcd34d' }} />
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{currentStreak} day streak</span>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)', padding: '6px 16px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: '#fcd34d' }} />
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>+10 XP</span>
            </div>
          </div>
        </div>

        {/* Prompt Section: Standardized padding and margin */}
        <div style={{ padding: '32px' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px' }}>{getCategoryEmoji(dailyPrompt.category)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Today's Prompt: {dailyPrompt.category}
                </div>
                <p style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {dailyPrompt.prompt}
                </p>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>
                Your Brain Dump (20 words max)
              </label>
              <div 
                style={{ fontSize: '14px', fontWeight: 'bold', transition: 'color 0.3s ease', color: wordCountColor() }}
              >
                {wordCount} / 20 words
              </div>
            </div>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Start writing... Keep it short and honest. ✨"
              style={{
                width: '100%', 
                height: '128px', 
                padding: '16px', 
                border: '2px solid #e5e7eb',
                borderRadius: '12px', 
                resize: 'none', 
                outline: 'none', 
                fontSize: '16px', 
                color: '#1f2937', 
                transition: 'all 0.2s',
                // FIX: Added box-sizing to ensure padding/border don't affect width
                boxSizing: 'border-box', 
                boxShadow: `0 0 0 0px #fce7f3`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#ec4899';
                e.currentTarget.style.boxShadow = `0 0 0 3px #fce7f3`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = `0 0 0 0px #fce7f3`;
              }}
              autoFocus
            />

            {wordCount > 20 && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px', fontWeight: '600' }}>
                ⚠️ Over the limit! Trim it down to 20 words or less.
              </p>
            )}
          </div>

          {/* Tips: Neutral gray for non-accent information */}
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: '#4b5563' }}>
              <strong>💡 Pro tip:</strong> Don't overthink it! Stream-of-consciousness works best. 
              This is about capturing raw thoughts, not perfection.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px 24px', background: '#e5e7eb', color: '#4b5563', 
                fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer',
                transition: 'background 0.2s', fontSize: '16px'
              }}
            >
              Skip Today
            </button>
            <button
              onClick={handleSubmit}
              disabled={wordCount === 0 || wordCount > 20}
              style={{
                flex: 1, padding: '12px 24px', color: 'white', fontWeight: 'bold',
                background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                borderRadius: '10px', border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease', fontSize: '16px',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                ...(wordCount === 0 || wordCount > 20 ? disabledButtonStyle : {})
              }}
              onMouseEnter={(e) => {
                if (!(wordCount === 0 || wordCount > 20)) {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(wordCount === 0 || wordCount > 20)) {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
                }
              }}
            >
              Save Entry (+10 XP)
            </button>
          </div>

          {/* Streak Motivation */}
          {currentStreak > 0 && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                🔥 Keep the streak alive! {currentStreak === 1 ? "You're just getting started!" : 
                currentStreak < 7 ? `${7 - currentStreak} more days to unlock the Week Warrior badge!` :
                currentStreak < 30 ? `${30 - currentStreak} more days to become a 30-Day Legend!` :
                "You're a journaling legend! 👑"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalModal;