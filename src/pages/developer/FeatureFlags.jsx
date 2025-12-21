const FeatureFlags = () => {
  const features = [
    { name: 'new_dashboard', label: 'New Dashboard UI', enabled: true, environment: 'production', description: 'Updated dashboard with new analytics' },
    { name: 'ai_recommendations', label: 'AI Course Recommendations', enabled: false, environment: 'staging', description: 'ML-based course recommendations' },
    { name: 'live_chat', label: 'Live Chat Support', enabled: true, environment: 'production', description: 'Real-time student support chat' },
    { name: 'gamification', label: 'Gamification Features', enabled: false, environment: 'development', description: 'Points, badges, and leaderboards' },
    { name: 'mobile_app', label: 'Mobile App Integration', enabled: false, environment: 'staging', description: 'Native mobile app support' },
    { name: 'advanced_analytics', label: 'Advanced Analytics', enabled: true, environment: 'production', description: 'Detailed performance analytics' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Flags</h1>
        <p className="text-gray-600">Control feature rollout and A/B testing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Features</p>
          <p className="text-3xl font-bold text-gray-900">{features.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Enabled</p>
          <p className="text-3xl font-bold text-green-600">{features.filter(f => f.enabled).length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Disabled</p>
          <p className="text-3xl font-bold text-red-600">{features.filter(f => !f.enabled).length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{feature.label}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    feature.environment === 'production' ? 'bg-green-100 text-green-700' :
                    feature.environment === 'staging' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {feature.environment.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                <p className="text-xs text-gray-500 font-mono">{feature.name}</p>
              </div>
              <label className="flex items-center space-x-3 ml-4">
                <input 
                  type="checkbox" 
                  defaultChecked={feature.enabled}
                  className="rounded w-12 h-6"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureFlags;
