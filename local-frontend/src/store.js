/**
 * Frontend Store - CodingAgent Command Center state management
 * Uses observable pattern for reactive state updates
 */
class Store {
  constructor() {
    this._observers = {};
    this._state = {
      user: null,
      workspaces: [],
      currentWorkspace: null,
      missions: [],
      currentMission: null,
      agents: [],
      models: [],
      skills: [],
      evidence: [],
      approvals: [],
      schedules: [],
      events: [],
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }

  get state() {
    return this._state;
  }

  subscribe(path, callback) {
    if (!this._observers[path]) this._observers[path] = [];
    this._observers[path].push(callback);
    const value = path.split('.').reduce((obj, key) => obj?.[key], this._state);
    callback(value);
  }

  setState(updates) {
    this._state = { ...this._state, ...updates };
    this.notify();
  }

  notify() {
    Object.keys(this._observers).forEach(path => {
      this._observers[path].forEach(callback => {
        const value = path.split('.').reduce((obj, key) => obj?.[key], this._state);
        callback(value);
      });
    });
  }

  onUserChange(callback) { this.subscribe('user', callback); }
  onWorkspacesChange(callback) { this.subscribe('workspaces', callback); }
  onCurrentWorkspaceChange(callback) { this.subscribe('currentWorkspace', callback); }
  onMissionsChange(callback) { this.subscribe('missions', callback); }
  onCurrentMissionChange(callback) { this.subscribe('currentMission', callback); }
  onAgentsChange(callback) { this.subscribe('agents', callback); }
  onModelsChange(callback) { this.subscribe('models', callback); }
  onSkillsChange(callback) { this.subscribe('skills', callback); }
  onErrorChange(callback) { this.subscribe('error', callback); }
  onLoadingChange(callback) { this.subscribe('loading', callback); }
}

export const store = new Store();