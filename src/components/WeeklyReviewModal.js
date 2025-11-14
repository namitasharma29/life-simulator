import React, { useState, useEffect } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Trophy, Target, Sparkles, TrendingUp, X } from 'lucide-react';
import topicStorage from '../utils/topicStorage';
import weeklyReviewStorage from '../utils/weeklyReviewStorage';

const WeeklyReviewModal = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [reviewData, setReviewData] = useState({
    topics: [],
    biggestWin: '',
    biggestWTF: '',
    nextWeekFocus: [],
    customGoal: ''
  });
  const [generatedQuests, setGeneratedQuests] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load this week's topics on mount
  useEffect(() => {
    const thisWeekTopics = topicStorage.getThisWeekTopics();
    setReviewData(prev => ({
      ...prev,
      topics: thisWeekTopics.map(t => ({
        id: t.id,
        topicName: t.topicName,
        course: t.course,
        confidenceBefore: t.confidence,
        confidenceAfter: t.confidence // Start with same value
      }))
    }));
  }, []);

  // Update topic confidence
  const updateTopicConfidence = (topicId, newConfidence) => {
    setReviewData(prev => ({
      ...prev,
      topics: prev.topics.map(t =>
        t.id === topicId ? { ...t, confidenceAfter: newConfidence } : t
      )
    }));
  };

  // Handle focus selection
  const toggleFocus = (focus) => {
    setReviewData(prev => ({
      ...prev,
      nextWeekFocus: prev.nextWeekFocus.includes(focus)
        ? prev.nextWeekFocus.filter(f => f !== focus)
        : [...prev.nextWeekFocus, focus]
    }));
  };

  // Handle form submission
  const handleComplete = () => {
    // Generate quests based on review
    const quests = weeklyReviewStorage.generateNextWeekQuests(reviewData);
    setGeneratedQuests(quests);

    // Save review to storage
    const success = weeklyReviewStorage.saveWeeklyReview({
      ...reviewData,
      generatedQuests: quests
    });

    if (success) {
      // Update topic confidences in topic storage
      reviewData.topics.forEach(topic => {
        if (topic.confidenceAfter !== topic.confidenceBefore) {
          topicStorage.updateTopicConfidence(topic.id, topic.confidenceAfter);
        }
      });

      setShowSuccess(true);

      // Call parent complete handler after animation
      setTimeout(() => {
        onComplete(quests); // Pass quests to parent for XP/achievements
      }, 2000);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence <= 2) return '#ef4444';
    if (confidence === 3) return '#f59e0b';
    return '#10b981';
  };

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  // Get week-over-week comparison
  const comparison = weeklyReviewStorage.getWeekOverWeekComparison();

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Overlay */}
        {showSuccess && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              animation: 'fadeIn 0.3s ease-in'
            }}
          >
            <CheckCircle size={80} style={{ color: 'white', marginBottom: '24px' }} />
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Review Complete! 🎉
            </h2>
            <p style={{ color: 'white', fontSize: '18px' }}>
              +50 XP earned • Next week's quests generated
            </p>
          </div>
        )}

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
            padding: '24px',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Trophy size={32} style={{ color: 'white' }} />
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                Weekly Review
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', margin: 0 }}>
                {topicStorage.getCurrentWeekRange()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'white',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          {/* STEP 1: Topic Review */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={24} style={{ color: '#8b5cf6' }} />
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Review Your Topics
                </h3>
              </div>
              
              <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '15px' }}>
                You logged <strong>{reviewData.topics.length} topics</strong> this week! 
                {reviewData.topics.length === 0 ? ' Add some topics before reviewing.' : ' Adjust confidence levels if they changed.'}
              </p>

              {reviewData.topics.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
                  <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '8px' }}>No topics logged this week</p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Log some topics using the Topic Logger before doing your weekly review!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviewData.topics.map(topic => (
                    <div
                      key={topic.id}
                      style={{
                        padding: '20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb'
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1f2937', marginBottom: '4px' }}>
                          {topic.topicName}
                        </div>
                        {topic.course && (
                          <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                            {topic.course}
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                          Confidence Level
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={topic.confidenceAfter}
                            onChange={(e) => updateTopicConfidence(topic.id, parseInt(e.target.value))}
                            style={{ flex: 1, accentColor: getConfidenceColor(topic.confidenceAfter) }}
                          />
                          <div
                            style={{
                              minWidth: '50px',
                              textAlign: 'center',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontWeight: 'bold',
                              fontSize: '16px',
                              backgroundColor: getConfidenceColor(topic.confidenceAfter),
                              color: 'white'
                            }}
                          >
                            {topic.confidenceAfter}
                          </div>
                        </div>
                        {topic.confidenceAfter !== topic.confidenceBefore && (
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                            Changed from {topic.confidenceBefore} → {topic.confidenceAfter}
                            {topic.confidenceAfter > topic.confidenceBefore ? ' 📈' : ' 📉'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Wins & WTFs */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Trophy size={24} style={{ color: '#8b5cf6' }} />
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Wins & WTFs
                </h3>
              </div>

              <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '15px' }}>
                Celebrate your progress and identify what needs clarity.
              </p>

              {/* Biggest Win */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  🏆 What was your BIGGEST WIN this week?
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  Example: "Finally understood how eigenvalues work in PCA!"
                </p>
                <textarea
                  value={reviewData.biggestWin}
                  onChange={(e) => setReviewData(prev => ({ ...prev, biggestWin: e.target.value }))}
                  placeholder="Describe your win..."
                  maxLength={200}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', textAlign: 'right' }}>
                  {reviewData.biggestWin.length}/200 characters
                </div>
              </div>

              {/* Biggest WTF */}
              <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  ❓ What's your BIGGEST WTF (still confusing)?
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  Example: "Why does regularization prevent overfitting?"
                </p>
                <textarea
                  value={reviewData.biggestWTF}
                  onChange={(e) => setReviewData(prev => ({ ...prev, biggestWTF: e.target.value }))}
                  placeholder="What's still fuzzy..."
                  maxLength={200}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', textAlign: 'right' }}>
                  {reviewData.biggestWTF.length}/200 characters
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Next Week Planning */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Target size={24} style={{ color: '#8b5cf6' }} />
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Plan Next Week
                </h3>
              </div>

              <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '15px' }}>
                What do you want to focus on next week?
              </p>

              {/* Focus Areas */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Select your focus areas (choose any):
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { id: 'review-weak', label: '📚 Review weak topics', desc: `${reviewData.topics.filter(t => t.confidenceAfter <= 3).length} topics need review` },
                    { id: 'apply-learning', label: '🛠️ Apply what I learned', desc: 'Build a mini-project' },
                    { id: 'learn-new', label: '✨ Learn something new', desc: 'Explore new concepts' },
                    { id: 'interview-prep', label: '🎯 Practice interview questions', desc: 'Get interview-ready' }
                  ].map(focus => (
                    <button
                      key={focus.id}
                      onClick={() => toggleFocus(focus.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        border: `2px solid ${reviewData.nextWeekFocus.includes(focus.id) ? '#8b5cf6' : '#e5e7eb'}`,
                        backgroundColor: reviewData.nextWeekFocus.includes(focus.id) ? '#f3e8ff' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#1f2937', marginBottom: '2px' }}>
                          {focus.label}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {focus.desc}
                        </div>
                      </div>
                      {reviewData.nextWeekFocus.includes(focus.id) && (
                        <CheckCircle size={20} style={{ color: '#8b5cf6' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Goal */}
              <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  🎯 ONE specific goal for next week (optional):
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  Example: "Build a simple recommender system using cosine similarity"
                </p>
                <input
                  type="text"
                  value={reviewData.customGoal}
                  onChange={(e) => setReviewData(prev => ({ ...prev, customGoal: e.target.value }))}
                  placeholder="Your specific goal..."
                  maxLength={100}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', textAlign: 'right' }}>
                  {reviewData.customGoal.length}/100 characters
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Celebration & Summary */}
          {step === 4 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Sparkles size={48} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  Amazing Work This Week!
                </h3>
                <p style={{ color: '#6b7280', fontSize: '15px' }}>
                  Here's your progress summary and personalized quests for next week.
                </p>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '28px' }}>
                <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '2px solid #dbeafe' }}>
                  <div style={{ fontSize: '13px', color: '#1e40af', fontWeight: '600', marginBottom: '4px' }}>Topics Learned</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a8a' }}>
                    {comparison.topics.thisWeek}
                    {comparison.topics.change !== 0 && (
                      <span style={{ fontSize: '16px', marginLeft: '8px', color: comparison.topics.change > 0 ? '#10b981' : '#ef4444' }}>
                        {comparison.topics.change > 0 ? '↑' : '↓'}{Math.abs(comparison.topics.change)}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px solid #bbf7d0' }}>
                  <div style={{ fontSize: '13px', color: '#15803d', fontWeight: '600', marginBottom: '4px' }}>Avg Confidence</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#166534' }}>
                    {comparison.confidence.thisWeek}
                    {comparison.confidence.change !== '0.0' && (
                      <span style={{ fontSize: '16px', marginLeft: '8px', color: parseFloat(comparison.confidence.change) > 0 ? '#10b981' : '#ef4444' }}>
                        {parseFloat(comparison.confidence.change) > 0 ? '↑' : '↓'}{Math.abs(parseFloat(comparison.confidence.change))}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Generated Quests Preview */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <TrendingUp size={20} style={{ color: '#8b5cf6' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Your Personalized Quests
                  </h4>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  Based on your review, here are 7 quests for next week:
                </p>
                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {weeklyReviewStorage.generateNextWeekQuests(reviewData).map((quest, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div
                        style={{
                          minWidth: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: quest.priority === 'high' ? '#fef3c7' : quest.priority === 'medium' ? '#dbeafe' : '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: quest.priority === 'high' ? '#92400e' : quest.priority === 'medium' ? '#1e40af' : '#6b7280'
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{quest.text}</div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b5cf6' }}>
                        +{quest.xp} XP
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            padding: '20px 32px',
            borderTop: '2px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}

          <div style={{ flex: 1 }} />

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && reviewData.topics.length === 0}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: step === 1 && reviewData.topics.length === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 1 && reviewData.topics.length === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle size={20} />
              Complete Review (+50 XP)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReviewModal;