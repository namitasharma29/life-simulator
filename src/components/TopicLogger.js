import React, { useState } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';
import topicStorage from '../utils/topicStorage';

const TopicLogger = ({ styles, onTopicAdded }) => { onTopicAdded
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course: '',
    topicName: '',
    confidence: 3,
    notes: '',
    tags: ''
  });
  const [recentTopics, setRecentTopics] = useState(topicStorage.getThisWeekTopics());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'confidence' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.topicName.trim()) {
      alert('Please enter a topic name!');
      return;
    }

    const topic = {
      course: formData.course.trim(),
      topicName: formData.topicName.trim(),
      confidence: formData.confidence,
      notes: formData.notes.trim(),
      tags: formData.tags.trim().split(',').map(t => t.trim()).filter(t => t)
    };

    if (topicStorage.saveTopic(topic)) {
      console.log('✅ Topic logged:', topic.topicName);
      setFormData({
        course: '',
        topicName: '',
        confidence: 3,
        notes: '',
        tags: ''
      });
      setShowForm(false);
      setRecentTopics(topicStorage.getThisWeekTopics());
      if (onTopicAdded) onTopicAdded();
    }
  };

  const handleDeleteTopic = (topicId) => {
    if (window.confirm('Delete this topic?')) {
      topicStorage.deleteTopic(topicId);
      setRecentTopics(topicStorage.getThisWeekTopics());
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence <= 2) return '#ef4444'; // red
    if (confidence === 3) return '#f59e0b'; // amber
    return '#10b981'; // green
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>
        <BookOpen size={20} style={{ color: '#e11d48' }} />
        📚 Learning Topics
      </h3>

      {/* Add Topic Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '16px',
          background: showForm ? '#f3f4f6' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          color: showForm ? '#4b5563' : 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.3s'
        }}
      >
        {showForm ? <X size={18} /> : <Plus size={18} />}
        {showForm ? 'Cancel' : '+ Log Topic'}
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#4b5563' }}>
              Course (optional)
            </label>
            <input
              type="text"
              name="course"
              placeholder="e.g., MA 279"
              value={formData.course}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#4b5563' }}>
              Topic Name *
            </label>
            <input
              type="text"
              name="topicName"
              placeholder="e.g., Linear Algebra Basics"
              value={formData.topicName}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#4b5563' }}>
              Confidence (1-5)
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="range"
                name="confidence"
                min="1"
                max="5"
                value={formData.confidence}
                onChange={handleInputChange}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: getConfidenceColor(formData.confidence), minWidth: '30px', textAlign: 'center' }}>
                {formData.confidence}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#4b5563' }}>
              Notes (optional)
            </label>
            <textarea
              name="notes"
              placeholder="Key insights, areas to review..."
              value={formData.notes}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '60px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#4b5563' }}>
              Tags (comma-separated, optional)
            </label>
            <input
              type="text"
              name="tags"
              placeholder="e.g., math, linear-algebra, vectors"
              value={formData.tags}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Save Topic
          </button>
        </form>
      )}

      {/* Recent Topics List */}
      {recentTopics.length > 0 && (
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>
            This Week's Topics ({recentTopics.length})
          </h4>
          {recentTopics.map(topic => (
            <div
              key={topic.id}
              style={{
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '8px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  {topic.topicName}
                  {topic.course && <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '8px' }}>({topic.course})</span>}
                </div>
                {topic.notes && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    {topic.notes}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: getConfidenceColor(topic.confidence),
                      color: 'white'
                    }}
                  >
                    Confidence: {topic.confidence}
                  </span>
                  {topic.tags && topic.tags.length > 0 && (
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {topic.tags.join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  marginLeft: '8px'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {recentTopics.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
          <p>No topics logged this week yet.</p>
          <p style={{ fontSize: '12px' }}>Start logging to get personalized prompts! 🎯</p>
        </div>
      )}
    </div>
  );
};

export default TopicLogger;
