import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle, Clock, Star, ExternalLink, Edit2, Trash2, BookOpen, X } from 'lucide-react';


/**
 * ResourceLibrary UI Component (UI-only)
 *
 * Required props:
 * - styles: object
 * - resources: array
 * - filteredResources: array
 * - showAddModal, setShowAddModal: bool, fn
 * - searchQuery, setSearchQuery: string, fn
 * - filterType, setFilterType: string, fn
 * - filterStatus, setFilterStatus: string, fn
 * - selectedResource, setSelectedResource: object, fn
 * - showDetailsModal, setShowDetailsModal: bool, fn
 * - handleAddResource: fn
 * - handleStatusChange: fn
 * - handleDeleteResource: fn
 * - applyFilters: fn
 * - RESOURCE_STATUS: object (constants)
 * - RESOURCE_TYPES: object (constants)
 * - getResourceTypeIcon: fn
 * - getResourceStats: fn (returns {total, completed, inProgress})
 * - getCompletionRate: fn (returns %)
 * - formatDuration: fn
 */
const ResourceLibrary = ({
  styles,
  resources,
  filteredResources,
  showAddModal,
  setShowAddModal,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  selectedResource,
  setSelectedResource,
  showDetailsModal,
  setShowDetailsModal,
  handleAddResource,
  handleStatusChange,
  handleDeleteResource,
  applyFilters,
  RESOURCE_STATUS,
  RESOURCE_TYPES,
  getResourceTypeIcon,
  getResourceStats,
  getCompletionRate,
  formatDuration
}) => {
  // All state, logic, and helpers are managed by parent and passed as props
  const stats = getResourceStats();
  const completionRate = getCompletionRate();

  const getStatusColor = (status) => {
    switch (status) {
      case RESOURCE_STATUS.COMPLETED:
        return '#10b981';
      case RESOURCE_STATUS.IN_PROGRESS:
        return '#f59e0b';
      default:
        return '#9ca3af';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case RESOURCE_STATUS.COMPLETED:
        return 'Completed';
      case RESOURCE_STATUS.IN_PROGRESS:
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={24} style={{ color: '#8b5cf6' }} />
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📚 Resource Library
            </h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <Plus size={18} />
            Add Resource
          </button>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{stats.total}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Resources</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{stats.completed}</div>
            <div style={{ fontSize: '12px', color: '#047857' }}>Completed</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>{stats.inProgress}</div>
            <div style={{ fontSize: '12px', color: '#92400e' }}>In Progress</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#ede9fe', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>{completionRate}%</div>
            <div style={{ fontSize: '12px', color: '#5b21b6' }}>Completion</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: 'white'
            }}
          >
            <option value="all">All Types</option>
            {Object.entries(RESOURCE_TYPES).map(([key, value]) => (
              <option key={value} value={value}>
                {getResourceTypeIcon(value)} {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: 'white'
            }}
          >
            <option value="all">All Status</option>
            <option value={RESOURCE_STATUS.NOT_STARTED}>Not Started</option>
            <option value={RESOURCE_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={RESOURCE_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
          <BookOpen size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '8px' }}>
            {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
              ? 'No resources match your filters' 
              : 'No resources yet'}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            {searchQuery || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start building your learning library!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onStatusChange={handleStatusChange}
              onClick={() => {
                setSelectedResource(resource);
                setShowDetailsModal(true);
              }}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <AddResourceModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddResource}
          RESOURCE_TYPES={RESOURCE_TYPES}
        />
      )}

      {/* Resource Details Modal */}
      {showDetailsModal && selectedResource && (
        <ResourceDetailsModal
          resource={selectedResource}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedResource(null);
          }}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteResource}
        />
      )}
    </div>
  );
};

// ============================================
// Resource Card Component
// ============================================
const ResourceCard = ({ resource, onStatusChange, onClick, getStatusColor, getStatusLabel, RESOURCE_STATUS, getResourceTypeIcon }) => {
  const statusColor = getStatusColor(resource.status);
  const statusLabel = getStatusLabel(resource.status);

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Status Bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: statusColor }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ fontSize: '24px' }}>{getResourceTypeIcon(resource.type)}</div>
        <div
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: statusColor + '20',
            color: statusColor
          }}
        >
          {statusLabel}
        </div>
      </div>

      {/* Title */}
      <h4
        onClick={onClick}
        style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {resource.title}
      </h4>

      {/* Topics */}
      {resource.topics && resource.topics.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {resource.topics.slice(0, 3).map((topic, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              {topic}
            </span>
          ))}
          {resource.topics.length > 3 && (
            <span style={{ fontSize: '11px', color: '#9ca3af', padding: '4px 8px' }}>
              +{resource.topics.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '12px', color: '#6b7280' }}>
        {resource.duration && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            {resourceStorage.formatDuration(resource.duration)}
          </div>
        )}
        {resource.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
            {resource.rating}/5
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {resource.status === RESOURCE_STATUS.NOT_STARTED && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(resource.id, resourceStorage.RESOURCE_STATUS.IN_PROGRESS);
            }}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Start Learning
          </button>
        )}
        {resource.status === RESOURCE_STATUS.IN_PROGRESS && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(resource.id, resourceStorage.RESOURCE_STATUS.COMPLETED);
            }}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle size={14} />
            Mark Complete
          </button>
        )}
        {resource.status === RESOURCE_STATUS.COMPLETED && (
          <div
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle size={14} />
            Completed
          </div>
        )}
        {resource.url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(resource.url, '_blank');
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ExternalLink size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// Add Resource Modal
// ============================================
const AddResourceModal = ({ onClose, onSave, RESOURCE_TYPES }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: RESOURCE_TYPES.ARTICLE,
    url: '',
    description: '',
    duration: '',
    difficulty: 'Intermediate',
    topics: '',
    tags: '',
    author: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title!');
      return;
    }

    const resource = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : null,
      topics: formData.topics.split(',').map(t => t.trim()).filter(t => t),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    onSave(resource);
  };

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
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Add Learning Resource
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '24px' }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., A/B Testing Fundamentals"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Type & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                {Object.entries(resourceStorage.RESOURCE_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {resourceStorage.getResourceTypeIcon(value)} {key.charAt(0) + key.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value={resourceStorage.DIFFICULTY.BEGINNER}>Beginner</option>
                <option value={resourceStorage.DIFFICULTY.INTERMEDIATE}>Intermediate</option>
                <option value={resourceStorage.DIFFICULTY.ADVANCED}>Advanced</option>
              </select>
            </div>
          </div>

          {/* URL */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              URL (optional)
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Duration & Author */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="StatQuest"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Topics */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Topics (comma-separated)
            </label>
            <input
              type="text"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="A/B Testing, Statistics, Hypothesis Testing"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="python, statistics, product-analytics"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

  const ResourceDetailsModal = ({ resource, onClose, onStatusChange, onDelete, onUpdate }) => {
    const [notes, setNotes] = useState(resource.personalNotes || '');
    const [editingNotes, setEditingNotes] = useState(false);

    const handleSaveNotes = () => {
      onUpdate({ personalNotes: notes });
      setEditingNotes(false);
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '32px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                {resource.title}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {resourceStorage.getResourceTypeIcon(resource.type)} {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#9ca3af',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Status
            </label>
            <select
              value={resource.status}
              onChange={(e) => onStatusChange(resource.id, e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <option value={resourceStorage.RESOURCE_STATUS.NOT_STARTED}>Not Started</option>
              <option value={resourceStorage.RESOURCE_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={resourceStorage.RESOURCE_STATUS.COMPLETED}>Completed</option>
            </select>
          </div>

          {/* URL */}
          {resource.url && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                URL
              </label>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  wordBreak: 'break-all',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {resource.url}
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          {/* Description */}
          {resource.description && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Description
              </label>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                {resource.description}
              </p>
            </div>
          )}

          {/* Duration & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {resource.duration && (
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Duration
                </label>
                <p style={{ color: '#6b7280' }}>
                  {resource.duration} minutes
                </p>
              </div>
            )}
            {resource.difficulty && (
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Difficulty
                </label>
                <p style={{ color: '#6b7280' }}>
                  {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                </p>
              </div>
            )}
          </div>

          {/* Personal Notes */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Personal Notes
              </label>
              <button
                onClick={() => setEditingNotes(!editingNotes)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {editingNotes ? 'Done' : 'Edit'}
              </button>
            </div>
            {editingNotes ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your personal notes..."
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={handleSaveNotes}
                  style={{
                    padding: '10px 16px',
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <p style={{ color: '#6b7280', lineHeight: '1.6', minHeight: '60px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                {notes || 'No notes yet'}
              </p>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => {
              if (window.confirm('Delete this resource permanently?')) {
                onDelete(resource.id);
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🗑️ Delete Resource
          </button>
        </div>
      </div>
    );
  };

export default ResourceLibrary;